import 'dotenv/config';

const config = {
    development: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DBNAME,
        host: process.env.RDS_HOST,
        dialect: 'mysql',
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: 'root',
        password: null,
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
};

export default config;
