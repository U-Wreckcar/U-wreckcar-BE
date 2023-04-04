import db from '../../config/mongo.config.js';
import { drawdb } from '../../config/mongo.config.js';
import Slack from '../../config/slackbot.config.js';

export async function getShortUrlClickCount(short_id) {
    try {
        const userInfo = await db
            .collection(`${process.env.COLLECTION_NAME}`)
            .findOne({ shortId: short_id }, { clickCount: 1, _id: 0 });
        return userInfo.clickCount;
    } catch (err) {
        console.error(err);
        await Slack('getShortUrlClickCount', err);
        return err;
    }
}

export async function deleteShortUrl(shorten_url) {
    try {
        const short_id = shorten_url.slice(27);
        const result =  db.collection(`${process.env.COLLECTION_NAME}`).deleteOne({ shortId: short_id });
        return (await result).acknowledged
    } catch (err) {
        console.error(err);
        await Slack('deleteShortUrl', err);
        return false;
    }
}

export async function recordWithdrawReason(reason) {
    try {
        await drawdb.collection('reason').insertOne({
            reason,
        });
        return true;
    } catch (err) {
        console.error(err);
        await Slack('recordWithdrawReason', err);
        return false;
    }
}
