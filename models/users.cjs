const { Model, DataTypes } = require('sequelize');

const Users = (sequelize, DataType) => {
    const Users = sequelize.define(
        'Users',
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profile_img: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Users',
            tableName: 'Users',
            createdAt : "created_at",
            updatedAt : "updated_at",
            timestamps: true,
        }
    );
    Users.associate = (db) => {
        db.Users.hasMany(db.User_utm_mediums, {
            foreignKey: 'user_id',
            sourceKey: 'user_id',
        });
        db.Users.hasMany(db.User_utm_sources, {
            foreignKey: 'user_id',
            sourceKey: 'user_id',
        });
        db.Users.hasMany(db.Utms, {
            foreignKey: 'user_id',
            sourceKey: 'user_id',
        });
    };
    // class Users extends Model {
    //     static associate(models) {
    //         this.hasMany(models.User_utm_mediums, {
    //             foreignKey: 'user_id',
    //             sourceKey: 'user_id',
    //         });
    //         this.hasMany(models.User_utm_sources, {
    //             foreignKey: 'user_id',
    //             sourceKey: 'user_id',
    //         });
    //         this.hasMany(models.Utms, {
    //             foreignKey: 'user_id',
    //             sourceKey: 'user_id',
    //         });
    //     }
    // }
    //
    // Users.init(
    //     {
    //         user_id: {
    //             type: DataTypes.INTEGER,
    //             primaryKey: true,
    //             autoIncrement: true,
    //         },
    //         username: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //         },
    //         email: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //         },
    //         profile_img: {
    //             type: DataTypes.STRING,
    //             allowNull: false,
    //         },
    //     },
    //     {
    //         sequelize,
    //         modelName: 'Users',
    //         tableName: 'Users',
    //     }
    // );

    return Users;
};

module.exports = Users;
