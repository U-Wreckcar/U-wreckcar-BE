import axios from 'axios';

const sendWebhook = async (data) => {
    try {
        await axios.post(`${process.env.WEBHOOK_URL}`, data);
    } catch (err) {
        console.error('Error sending webhook:', err.message);
    }
};

export const linearMiddleware = async (req, res, next) => {
    const startTime = Date.now();

    // 요청에 대한 정보 추출
    const requestData = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
    };

    // 웹훅 전송
    await sendWebhook({
        event: 'request',
        data: requestData,
    });

    // 응답 후처리
    res.on('finish', async () => {
        const elapsedTime = Date.now() - startTime;

        // 응답에 대한 정보 추출
        const responseData = {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
            elapsedTime,
        };

        // 웹훅 전송
        await sendWebhook({
            event: 'response',
            data: responseData,
        });
    });

    // 에러 처리
    res.on('error', async (err) => {
        // 웹훅 전송
        await sendWebhook({
            event: 'error',
            data: {
                message: err.message,
                stack: err.stack,
            },
        });
    });

    next();
};

