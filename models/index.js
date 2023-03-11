import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';

const basename = path.basename(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || 'development';
const config = import('../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(path.dirname(new URL(import.meta.url).pathname))
    .filter(file => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = import(path.join(path.dirname(new URL(import.meta.url).pathname), file)).default;
      db[model.name] = model(sequelize, Sequelize.DataTypes);
    });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ force: true });

// force true 시 디비 날려버리고 새로만듭니다! 첫실행 후 꼭 false로 바꿔주기!

export { sequelize, Sequelize };

export default db;
