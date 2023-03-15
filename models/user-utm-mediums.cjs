'use strict';
const { Model, DataTypes } = require('sequelize');

const User_utm_mediums = (sequelize, DataTypes) => {
    const User_utm_mediums = sequelize.define(
        "User_utm_mediums",
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
            modelName: 'User_utm_mediums',
            tableName: 'User_utm_mediums',
            createdAt : "created_at",
            updatedAt : "updated_at",
            timestamps: true,
        }
    )
    User_utm_mediums.associate = (db) => {
        db.User_utm_mediums.belongsTo(db.Users, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            onDelete: 'CASCADE',
        });
        db.User_utm_mediums.hasMany(db.Utms, {
            foreignKey: 'user_utm_medium_id',
            sourceKey: 'user_utm_medium_id',
        });
    }
    // class User_utm_mediums extends Model {
    //     static associate(models) {
    //         this.belongsTo(models.Users, {
    //             foreignKey: 'user_id',
    //             targetKey: 'user_id',
    //             onDelete: 'CASCADE',
    //         });
    //         this.hasMany(models.Utms, {
    //             foreignKey: 'user_utm_medium_id',
    //             sourceKey: 'user_utm_medium_id',
    //         });
    //     }
    // }
    // User_utm_mediums.init(
    //     {
    //         user_utm_medium_id: {
    //             allowNull: false,
    //             autoIncrement: true,
    //             primaryKey: true,
    //             type: DataTypes.INTEGER,
    //         },
    //         user_id: {
    //             allowNull: false,
    //             type: DataTypes.INTEGER,
    //             references: {
    //                 model: 'Users',
    //                 key: 'user_id',
    //             },
    //         },
    //         medium_name: {
    //             allowNull: false,
    //             type: DataTypes.STRING,
    //         },
    //     },
    //     {
    //         sequelize,
    //         modelName: 'User_utm_mediums',
    //         tableName: 'User_utm_mediums',
    //     }
    // );
    return User_utm_mediums;
};

module.exports = User_utm_mediums;