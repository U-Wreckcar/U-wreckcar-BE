// const dotenv = require("dotenv");
import dotenv from 'dotenv';
dotenv.config();

export default {
    "test_db_config":{
        "host": process.env.MYSQL_DB_ENV_HOST,
        "user": process.env.MYSQL_DB_ENV_USER,
        "password": process.env.MYSQL_DB_ENV_PASSWORDM,
        "database": process.env.MYSQL_DB_ENV_DATABASE
    }
}

