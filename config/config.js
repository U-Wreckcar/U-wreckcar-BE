import dotenv from 'dotenv';

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

export default config;
