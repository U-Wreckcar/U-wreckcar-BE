import Slack from 'slack-node';

const slack = new Slack(process.env.SLACKBOT_TOKEN);

export default async (sender, message) => {
    slack.api(
        'chat.postMessage',
        {
            text: `${sender}:\n${message}`,
            channel: '#test',
            icon_emoji: 'slack',
        },
        (error, response) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(response);
        }
    );
};
