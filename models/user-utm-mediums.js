'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class UserUtmMedium extends Model {
        static associate(models) {
            this.belongsTo(models.Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        }
    }
    UserUtmMedium.init(
        {
            user_utm_medium_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'user_id',
                },
            },
            medium_name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'User-utm-mediums',
        }
    );
    return UserUtmMedium;
};
