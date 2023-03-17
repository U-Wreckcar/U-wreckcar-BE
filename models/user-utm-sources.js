import { Model, DataTypes } from 'sequelize';

const User_utm_sources = (sequelize, DataTypes) => {
    const User_utm_sources = sequelize.define(
        'User_utm_sources',
        {
            user_utm_source_id: {
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
            source_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User_utm_sources',
            tableName: 'User_utm_sources',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        }
    );
    User_utm_sources.associate = (db) => {
        db.User_utm_sources.belongsTo(db.Users, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            onDelete: 'CASCADE',
        });
        db.User_utm_sources.hasMany(db.Utms, {
            foreignKey: 'user_utm_source_id',
            sourceKey: 'user_utm_source_id',
            onDelete: 'CASCADE',
        });
    };

    return User_utm_sources;
};

export default User_utm_sources;
