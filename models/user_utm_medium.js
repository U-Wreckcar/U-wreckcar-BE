import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User_utm_medium extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_utm_medium.init({
    user_utm_medium_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    utm_medium: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_utm_medium',
  });
  return User_utm_medium;
};
