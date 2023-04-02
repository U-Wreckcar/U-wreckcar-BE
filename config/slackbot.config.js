import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACKBOT_TOKEN);

export default async (sender, message) => {
    try {
        const result = await slack.chat.postMessage({
            text: `${sender}:\n${message}`,
            channel: `${process.env.CHANNEL_ID}`,
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};
