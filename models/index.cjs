const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const Utms = require('./utms.cjs');
const Users = require('./users.cjs');
const User_utm_mediums = require('./user-utm-mediums.cjs');
const User_utm_sources = require('./user-utm-sources.cjs');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.cjs')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

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

module.exports = db;
