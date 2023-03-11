import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Utm extends Model {
    static associate(models) {
      // define association here
    }
  }
  Utm.init(
      {
        utm_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        utm_url: DataTypes.STRING,
        utm_campaign_id: DataTypes.STRING,
        utm_campaign_name: DataTypes.STRING,
        utm_source: DataTypes.STRING,
        utm_medium: DataTypes.STRING,
        utm_term: DataTypes.STRING,
        utm_content: DataTypes.STRING,
        utm_memo: DataTypes.STRING,
        full_url: DataTypes.STRING,
        shorten_url: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Utm',
      }
  );
  return Utm;
};
