import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {}
    }

    Users.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            profile_img: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );

    return Users;
};
