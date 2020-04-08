'use strict';

module.exports = (sequelize, DataTypes) => {

  const Poll = sequelize.define('Poll', {
    title: DataTypes.STRING,
    fancy_id: DataTypes.STRING(64),
    polltaker_account: DataTypes.STRING(42),
    description:DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    valid_event_ids: DataTypes.ARRAY(DataTypes.BIGINT),
  }, { });

  Poll.associate = (models) => {
    Poll.hasMany(models.PollOption, {as: 'poll_options', foreignKey: 'poll_id'});
  };

  return Poll;
};
