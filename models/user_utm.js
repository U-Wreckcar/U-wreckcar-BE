import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User_utm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_utm.init({
    user_utm_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    utm_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_utm',
  });
  return User_utm;
};
