'use strict';

module.exports = (sequelize, DataTypes) => {

  const PollOption = sequelize.define('PollOption', {
    contents: DataTypes.STRING(1000),
  }, {});

  PollOption.associate = (models) => {
      PollOption.hasMany(models.Vote, {as: 'votes', foreignKey: 'poll_option_id'});
  };

  return PollOption;
};
