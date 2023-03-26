import db from '../../config/mongo.config.js';

export async function getShortUrlClickCount(short_id) {
    try {
        const userInfo = await db
            .collection(`${process.env.COLLECTION_NAME}`)
            .findOne({ shortId: short_id }, { clickCount: 1, _id: 0 });
        return userInfo.clickCount;
    } catch (err) {
        console.error(err);
        return err;
    }
}

export async function deleteShortUrl(shorten_url) {
    try {
        const short_id = shorten_url.slice(27);
        await db.collection(`${process.env.COLLECTION_NAME}`).deleteOne({ shortId: short_id });
    } catch (err) {
        console.error(err);
        return err;
    }
}
