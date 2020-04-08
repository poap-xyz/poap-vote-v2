'use strict';

module.exports = (sequelize, DataTypes) => {

  const Vote = sequelize.define('Vote', {
    voter_account: DataTypes.STRING(42),
    token_ids: DataTypes.ARRAY(DataTypes.BIGINT),
    date_cast: DataTypes.DATE,
    poll_option_id: DataTypes.INTEGER,
  }, {});

  Vote.associate = (models) => {
    Vote.belongsTo(models.PollOption, {as: 'poll_option', foreignKey: 'poll_option_id'});
  };

  return Vote;
};
