'use strict';

module.exports = (sequelize, DataTypes) => {

  const Poll = sequelize.define('Poll', {
    title: DataTypes.STRING,
    polltaker_account: DataTypes.STRING(42),
    description:DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    valid_event_ids: DataTypes.ARRAY(DataTypes.BIGINT),
    attestation: DataTypes.STRING(130),
  }, { });

  Poll.associate = (models) => {
    Poll.hasMany(models.PollOption, {as: 'poll_options', foreignKey: 'poll_id'});
  };

  return Poll;
};
