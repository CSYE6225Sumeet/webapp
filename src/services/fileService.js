const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const File = require('../models/file');
const StatsD = require('hot-shots');
const winston = require('winston');
require('dotenv').config();
const statsd = require('../utils/metrics');
const logger = require('../utils/logger');

// // 📈 StatsD for CloudWatch metrics
// const statsd = new StatsD({
//     host: 'localhost', // Update if CloudWatch agent is remote
//     port: 8125,
//     prefix: 'myapp.',
//     errorHandler: (err) => console.error('StatsD Error:', err)
// });

// // 📋 Winston logger
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//     ),
//     transports: [new winston.transports.Console()]
// });

const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;

// ✅ Upload File
const uploadFile = async (file) => {
    const fileId = uuidv4();
    const s3Key = `${fileId}/${file.originalname}`;

    logger.info(`Uploading file to S3: ${file.originalname}`);

    const s3Start = Date.now();
    try {
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
        }));
        statsd.timing('s3.upload.latency', Date.now() - s3Start);
        statsd.increment('api.upload.count');

        const dbStart = Date.now();
        const savedFile = await File.create({ id: fileId, file_name: file.originalname, url: s3Key });
        statsd.timing('db.insert.latency', Date.now() - dbStart);

        logger.info(`File uploaded and metadata stored: ${fileId}`);
        return savedFile;
    } catch (error) {
        logger.error('Upload failed', { error: error.message, stack: error.stack });
        statsd.increment('api.upload.error');
        throw error;
    }
};

// ✅ Get File
const getFile = async (fileId) => {
    logger.info(`Retrieving file metadata for ID: ${fileId}`);
    const dbStart = Date.now();
    try {
        const file = await File.findByPk(fileId);
        statsd.timing('db.select.latency', Date.now() - dbStart);
        statsd.increment('api.get.count');
        return file;
    } catch (error) {
        logger.error('Get file failed', { error: error.message, stack: error.stack });
        statsd.increment('api.get.error');
        throw error;
    }
};

// ✅ Delete File
const deleteFile = async (fileId) => {
    logger.info(`Deleting file with ID: ${fileId}`);
    try {
        const dbStart = Date.now();
        const file = await File.findByPk(fileId);
        statsd.timing('db.select.latency', Date.now() - dbStart);

        if (!file) {
            logger.warn(`File not found: ${fileId}`);
            return null;
        }

        const s3Start = Date.now();
        await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: file.url }));
        statsd.timing('s3.delete.latency', Date.now() - s3Start);

        const dbDeleteStart = Date.now();
        await file.destroy();
        statsd.timing('db.delete.latency', Date.now() - dbDeleteStart);

        statsd.increment('api.delete.count');
        logger.info(`File deleted: ${fileId}`);
        return true;
    } catch (error) {
        logger.error('Delete file failed', { error: error.message, stack: error.stack });
        statsd.increment('api.delete.error');
        throw error;
    }
};

module.exports = { uploadFile, getFile, deleteFile };
