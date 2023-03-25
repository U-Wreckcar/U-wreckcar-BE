import db from '../../config/mongo.config.js';

export async function getShortUrlClickCount(short_id) {
    try{
        const userInfo = await db
            .collection(`${process.env.COLLECTION_NAME}`)
            .findOne({ shortId: short_id }, { clickCount: 1, _id: 0 });
        return userInfo.clickCount;
    } catch (err) {
        console.error(err);
        return err;
    }
}
