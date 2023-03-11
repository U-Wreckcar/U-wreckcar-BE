'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Utms', {
      utm_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      utm_url: {
        type: Sequelize.STRING
      },
      utm_campaign_id: {
        type: Sequelize.STRING
      },
      utm_campaign_name: {
        type: Sequelize.STRING
      },
      utm_source: {
        type: Sequelize.STRING
      },
      utm_medium: {
        type: Sequelize.STRING
      },
      utm_term: {
        type: Sequelize.STRING
      },
      utm_content: {
        type: Sequelize.STRING
      },
      utm_memo: {
        type: Sequelize.STRING
      },
      full_url: {
        type: Sequelize.STRING
      },
      shorten_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Utms');
  }
};