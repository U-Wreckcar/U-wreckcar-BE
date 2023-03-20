// const dotenv = require("dotenv");
import dotenv from 'dotenv';
dotenv.config();

export default {
    test_db_config: {
        host: process.env.RDS_HOST,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DBNAME,
    },
};
