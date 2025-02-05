const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthCheck = sequelize.define('HealthCheck', {
  checkId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'HealthCheck',
  timestamps: false,
});

module.exports = HealthCheck;