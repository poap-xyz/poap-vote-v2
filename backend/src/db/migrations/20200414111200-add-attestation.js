'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Polls', 'attestation', {
      type: Sequelize.STRING(130),
      allowNull: false,
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Polls', 'attestation');
  }
};
