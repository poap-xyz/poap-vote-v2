'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    title: DataTypes.STRING
  }, {});
  Poll.associate = function(models) {
    // associations can be defined here
  };
  return Poll;
};