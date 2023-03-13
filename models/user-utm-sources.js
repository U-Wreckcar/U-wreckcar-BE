import { Model } from 'sequelize';

export default class UserUtmSources extends Model {
    static associate(models) {
        this.belongsTo(models.Users, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
    }
}

UserUtmSources.init(
    {
        user_utm_source_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        source_name: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'User-utm-sources',
    }
);

export { UserUtmSources };
