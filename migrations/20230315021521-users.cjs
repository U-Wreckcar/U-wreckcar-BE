'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Users',
            {
                user_id: {
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER,
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                profile_img: {
                    type: Sequelize.STRING,
                },
                password: {
                    type: Sequelize.STRING,
                },
                salt: {
                    type: Sequelize.STRING,
                },
                company_name: {
                    type: Sequelize.STRING,
                },
                marketing_accept: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                login_type: {
                    type: Sequelize.STRING,
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE(6),
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE(6),
                },
            },
            {
                initialAutoIncrement: 1,
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },
};
