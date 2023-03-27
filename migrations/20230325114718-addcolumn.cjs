'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn('Utms', 'short_id', {
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        // return queryInterface.removeColumn('Utms', 'short_id');
    },
};
