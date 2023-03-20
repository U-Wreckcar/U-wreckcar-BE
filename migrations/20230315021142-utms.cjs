'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Utms', {
      utm_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      utm_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      utm_campaign_id: {
        type: Sequelize.STRING,
      },
      utm_campaign_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      utm_content: {
        type: Sequelize.STRING,
      },
      utm_term: {
        type: Sequelize.STRING,
      },
      utm_memo: {
        type: Sequelize.STRING,
      },
      full_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shorten_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_utm_source_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'User_utm_sources',
          key: 'user_utm_source_id',
        },
        onDelete: 'CASCADE',
      },
      user_utm_medium_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'User_utm_mediums',
          key: 'user_utm_medium_id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE(6),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE(6),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Utms');
  }
};
