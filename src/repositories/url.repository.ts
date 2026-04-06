import { Url, IUrl } from '../models/Url';

//createUrl interface for the creation of the url
// This interface represents the structure of the URL that will be created and stored in the database
export interface createUrl{
    originalUrl: string;
    shortUrl: string;
}

//urlStats interface for the statistics of the url
// This interface represents the structure of the URL statistics that will be returned to the client
// It includes the original URL, the shortened URL, the number of clicks, and timestamps for creation and updates
export interface UrlStats {
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}



export class UrlRepository {

    async create(data : createUrl): Promise<IUrl> {
        const url = new Url(data);
        return await url.save();
    }




    //findByShortUrl method to find a url by its shortUrl
    // This method takes a shortUrl as a parameter and returns the corresponding URL document from the database
    async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
        return await Url.findOne({ shortUrl });
    }



    //findAll method to find all the urls in the database
    // This method returns all URL documents from the database, sorted by creation date in descending order
    async findAll() {
        //find all the urls in the database and return them in the form of an array of UrlStats

        //select only the required fields and sort them by createdAt in descending order
        const urls = await Url.find().select({
            _id: 1,
            originalUrl: 1,
            shortUrl: 1,
            clicks: 1,
            createdAt: 1,
            updatedAt: 1
        }).sort({ createdAt: -1 });


        //map the urls to the UrlStats interface and return them
        return urls.map(url => ({
            id: url._id?.toString() || '',
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        }));
    }


    //incrementClicks method to increment the clicks of a url
    // This method takes a shortUrl as a parameter and increments the clicks count of the corresponding URL document in the database
    async incrementClicks(shortUrl: string): Promise<void> {
        await Url.findOneAndUpdate({ shortUrl }, { $inc: { clicks: 1 } });
    }



    //findStastsByShortUrl method to find the statistics of a url by its shortUrl
    // This method takes a shortUrl as a parameter and returns the statistics of the corresponding URL document from the database



    async findStastsByShortUrl(shortUrl: string): Promise<UrlStats | null> {
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            return null;
        }
        return {
            id: url._id?.toString() || '',
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        };
    }



}
