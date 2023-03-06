import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
      {
        user_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        nickname: DataTypes.STRING,
        profile_img: DataTypes.STRING,
        email: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'User',
      }
  );
  return User;
};
