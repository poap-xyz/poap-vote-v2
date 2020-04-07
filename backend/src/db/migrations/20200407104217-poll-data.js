'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Polls', 'fancy_id', {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      }),
      queryInterface.addColumn('Polls', 'polltaker_account', {
        type: Sequelize.STRING(42),
        allowNull: false,
      }),
      queryInterface.addColumn('Polls', 'description', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.addColumn('Polls', 'start_date', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.addColumn('Polls', 'end_date', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.addColumn('Polls', 'valid_event_ids', {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Polls', 'fancy_id'),
      queryInterface.removeColumn('Polls', 'polltaker_account'),
      queryInterface.removeColumn('Polls', 'description'),
      queryInterface.removeColumn('Polls', 'start_date'),
      queryInterface.removeColumn('Polls', 'end_date'),
      queryInterface.removeColumn('Polls', 'valid_event_ids'),
    ]);
  }
};
