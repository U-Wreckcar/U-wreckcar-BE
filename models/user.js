import { Model } from 'sequelize';
import User_utm_medium from './user_utm_medium.js';

export default (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.User_utm_medium, {
                foreignKey: 'user_id',
                sourceKey: 'user_id',
            });
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
            timestamps: true,
            paranoid: true
        }
    );
    return User;
};
