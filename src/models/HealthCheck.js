const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configure Sequelize to connect to MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Define the HealthCheck model
const HealthCheck = sequelize.define('HealthCheck', {
  checkId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
},
{
  timestamps: false,
}
);

// Export the sequelize instance and models
module.exports = { sequelize, HealthCheck };
