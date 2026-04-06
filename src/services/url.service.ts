import { serverConfig } from '../config';
import { CacheRepository } from '../repositories/cache.repository';
import { toBase62 } from '../utils/base62';
import { UrlRepository } from './../repositories/url.repository';
import { NotFoundError } from '../utils/errors/app.error';


export class UrlService {

    constructor(
        private readonly UrlRepository: UrlRepository,
        private readonly cacheRepository: CacheRepository
    ) {}


    // Create a short URL for a given original URL
    // This method generates a unique short URL by getting the next unique ID from the cache repository and converting it to a base62 string
    // It then stores the mapping of the short URL to the original URL in both Redis cache and the database for persistence
    // Finally, it returns an object containing the original URL, the short URL, and the full short URL (including the base URL)

    async createShortUrl(originalUrl: string){
        // Get the next unique ID for the new URL mapping
        const NextId = await this.cacheRepository.getNextId();

        // Convert the unique ID to a base62 string to create the short URL
        const shortUrl = toBase62(NextId);

        // Store the URL mapping in Redis for quick access
        await this.cacheRepository.setUrlMapping(shortUrl, originalUrl);

        // Store the URL mapping in the database for persistence
        const url = await this.UrlRepository.create({ originalUrl, shortUrl });

        const baseUrl = serverConfig.BASE_URL;
        const fullShortUrl = `${baseUrl}/${shortUrl}`;

        return {
            id:url._id.toString(),
            originalUrl,
            shortUrl,
            fullShortUrl,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        }
    }



    // Get the original URL for a given short URL
    // This method first tries to retrieve the original URL from Redis cache for fast access
    // If the original URL is not found in cache, it looks it up in the database
    // If the URL is found in the database, it increments the click count and stores the mapping in Redis cache for future requests
    // Finally, it returns an object containing the original URL and the short URL

    async getOriginalUrl(shortUrl: string) {
        // Try to get the original URL from Redis cache first

        const originalUrl = await this.cacheRepository.getUrlMapping(shortUrl);

        if (originalUrl) {
            // If the original URL is found in cache, return it
            return {
                originalUrl,
                shortUrl,
            }

        }


        // If the original URL is not found in cache, look it up in the database
        const url = await this.UrlRepository.findByShortUrl(shortUrl);

        if (!url) {
            // If the URL is not found in the database
            throw new NotFoundError('URL not found');
        }
        //increment the clicks count for the URL in the database
        await this.UrlRepository.incrementClicks(shortUrl);

        // Store the URL mapping in Redis cache for future requests
        await this.cacheRepository.setUrlMapping(shortUrl, url.originalUrl);

        return {
            originalUrl: url.originalUrl,
            shortUrl
        }  

    }

    async incrementClicks(shortUrl: string) {
        await this.UrlRepository.incrementClicks(shortUrl);
        return;
    }   
}


