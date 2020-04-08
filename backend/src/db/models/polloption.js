'use strict';

module.exports = (sequelize, DataTypes) => {

  const PollOption = sequelize.define('PollOption', {
    contents: DataTypes.STRING(1000),
  }, {});

  PollOption.associate = (models) => { };

  return PollOption;
};
