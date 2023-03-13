import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Utms extends Model {
        static associate(models) {
            Utms.belongsTo(models.UserUtmSource, { foreignKey: 'user_utm_source_id' });
            Utms.belongsTo(models.UserUtmMedium, { foreignKey: 'user_utm_medium_id' });
            Utms.belongsTo(models.Users, { foreignKey: 'user_id' });
        }
    }

    Utms.init(
        {
            utm_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            utm_campaign: {
                type: DataTypes.STRING,
            },
            utm_content: {
                type: DataTypes.STRING,
            },
            utm_term: {
                type: DataTypes.STRING,
            },
            utm_created_at: {
                type: DataTypes.DATE,
            },
            utm_memo: {
                type: DataTypes.STRING,
            },
            full_url: {
                type: DataTypes.STRING,
            },
            shorten_url: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'Utms',
        }
    );

    return Utms;
};
