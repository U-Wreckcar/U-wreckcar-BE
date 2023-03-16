import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import Utms from './utms.js';
import Users from './users.js';
import User_utm_mediums from './user-utm-mediums.js';
import User_utm_sources from './user-utm-sources.js';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
import config from '../config/config.js';
const db = {};

const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
    host: config[env].host,
    dialect: config[env].dialect,
    timezone: '+09:00',
    dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true,
    },
});

db.Utms = Utms(sequelize, Sequelize);
db.Users = Users(sequelize, Sequelize);
db.User_utm_mediums = User_utm_mediums(sequelize, Sequelize);
db.User_utm_sources = User_utm_sources(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
