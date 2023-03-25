'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return [
            queryInterface.addColumn('Users', 'phone_no', {
                type: Sequelize.STRING,
            }),
            queryInterface.addColumn('Users', 'password', {
                type: Sequelize.STRING,
            }),
            queryInterface.addColumn('Users', 'company_name', {
                type: Sequelize.STRING,
            }),
            queryInterface.addColumn('Users', 'marketing_accept', {
                type: Sequelize.BOOLEAN,
            }),
        ];
    },

    async down(queryInterface, Sequelize) {
        return [
            queryInterface.removeColumn('Users', 'phone_no'),
            queryInterface.removeColumn('Users', 'password'),
            queryInterface.removeColumn('Users', 'company_name'),
            queryInterface.removeColumn('Users', 'marketing_accept'),
        ];
    },
};
