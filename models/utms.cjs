const { Model, DataTypes } = require('sequelize');

const Utms = (sequelize, DataTypes) => {
    const Utms = sequelize.define(
        'Utms',
        {
            utm_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            utm_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            utm_campaign_id: {
                type: DataTypes.STRING,
            },
            utm_campaign_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            utm_content: {
                type: DataTypes.STRING,
            },
            utm_term: {
                type: DataTypes.STRING,
            },
            utm_memo: {
                type: DataTypes.STRING,
            },
            full_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shorten_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Utms',
            tableName: 'Utms',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        }
    );
    Utms.associate = (db) => {
        db.Utms.belongsTo(db.User_utm_sources, { foreignKey: 'user_utm_source_id' });
        db.Utms.belongsTo(db.User_utm_mediums, { foreignKey: 'user_utm_medium_id' });
        db.Utms.belongsTo(db.Users, { foreignKey: 'user_id' });
    };
    return Utms;
};

// const Utms = (sequelize, DataTypes) => {
//     class Utms extends Model {
//         static associate(models) {
//             this.belongsTo(models.UserUtmSource, { foreignKey: 'user_utm_source_id' });
//             this.belongsTo(models.UserUtmMedium, { foreignKey: 'user_utm_medium_id' });
//             this.belongsTo(models.Users, { foreignKey: 'user_id' });
//         }
//     }
//
//     Utms.init(
//         {
//             utm_id: {
//                 type: DataTypes.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true,
//             },
//             utm_url: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             utm_campaign_id: {
//                 type: DataTypes.STRING,
//             },
//             utm_campaign_name: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             utm_content: {
//                 type: DataTypes.STRING,
//             },
//             utm_term: {
//                 type: DataTypes.STRING,
//             },
//             utm_memo: {
//                 type: DataTypes.STRING,
//             },
//             full_url: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             shorten_url: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//         },
//         {
//             sequelize,
//             modelName: 'Utms',
//             tableName: 'Utms',
//         }
//     );
//
//     return Utms;
// };

module.exports = Utms;
