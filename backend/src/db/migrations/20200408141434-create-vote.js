'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voter_account: {
        type: Sequelize.STRING(42),
        allowNull: false,
      },
      token_ids: {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: false,
      },
      date_cast: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      poll_option_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PollOptions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Votes');
  }
};
