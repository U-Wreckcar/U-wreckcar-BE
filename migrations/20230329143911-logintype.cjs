'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'login_type', {
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'login_type');
  }
};
