const dotenv = require('dotenv');

// .env 파일에서 환경 변수를 읽어들입니다.
dotenv.config();

const config = {
    development: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DBNAME,
        host: process.env.RDS_HOST,
        dialect: process.env.RDS_DIALECT,
    },
    test: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DBNAME,
        host: process.env.RDS_HOST,
        dialect: process.env.RDS_DIALECT,
    },
    production: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DBNAME,
        host: process.env.RDS_HOST,
        dialect: process.env.RDS_DIALECT,
    },
};

module.exports = config;
