const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const File = require('../models/imageTable');
require('dotenv').config();

// console.log("AWS Credentials:", process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
// console.log("Bucket Name:", process.env.S3_BUCKET_NAME);


const s3 = new S3Client({ 
    region: process.env.AWS_REGION,
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // } 
});
const bucketName = process.env.S3_BUCKET_NAME;

// Upload File to S3 and Store Metadata in RDS
const uploadFile = async (file) => {
    const fileId = uuidv4();
    // const s3Key = `${fileId}/${file.originalname}`;
    const s3Key = `${fileId}/${file.originalname}`;


    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype
    }));

    return await File.create({ id: fileId, file_name: file.originalname, url: s3Key });
};

// Get File Metadata from RDS
const getFile = async (fileId) => {
    return await File.findByPk(fileId);
};

// Delete File from S3 and Remove Metadata from RDS
const deleteFile = async (fileId) => {
    const file = await File.findByPk(fileId);
    if (!file) return null;

    await s3.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: file.url
    }));

    await file.destroy();
    return true;
};

module.exports = { uploadFile, getFile, deleteFile };
