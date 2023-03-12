'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Utms', {
            utm_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'user_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            user_utm_source_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'User-utm-sources',
                    key: 'user_utm_source_id'
                },
                onUpdate: 'CASCADE',
            },
            user_utm_medium_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'User-utm-mediums',
                    key: 'user_utm_medium_id'
                },
                onUpdate: 'CASCADE',
            },
            utm_campaign: {
                allowNull: false,
                type: Sequelize.STRING
            },
            utm_content: {
                allowNull: false,
                type: Sequelize.STRING
            },
            utm_term: {
                allowNull: false,
                type: Sequelize.STRING
            },
            utm_created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            utm_memo: {
                allowNull: true,
                type: Sequelize.STRING
            },
            full_url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            shorten_url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Utms');
    }
};
