const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readOnly: true,
    },
    file_name: {
        type: DataTypes.STRING,
        readOnly: true,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        readOnly: true,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'files'
});

module.exports = File;
