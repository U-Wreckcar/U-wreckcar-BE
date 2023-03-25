import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
    service: 'Naver', // 사용할 이메일 서비스
    host: 'smtp.naver.com',
    port: 465,
    auth: {
        user: `${process.env.NODEMAILER_ACCOUNT}`, // 발신자 이메일
        pass: `${process.env.NODEMAILER_PASSWORD}`, // 발신자 이메일 비밀번호
    },
});
