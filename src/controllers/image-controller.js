const fileService = require('../services/image-service');

// Upload File
const uploadFile = async (req, res) => {
    // console.log('******** Inside Upload File Controller ********');
    // console.log('Headers:', req.headers);
    // console.log('Body:', req.body);
    // console.log('Files:', req.files);
    // console.log('File:', req.file);

    if (!req.file) {
        console.log('****** No File Received ******');
        return res.status(400).send();
    }

    try {
        console.log('****** Uploading File to S3 ******');
        const file = await fileService.uploadFile(req.file);
        console.log('****** File Uploaded Successfully ******', file);
        res.status(201).json(file);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message });
    }
};




// Get File Metadata
const getFile = async (req, res) => {
    try {
        const file = await fileService.getFile(req.params.id);
        if (!file) return res.status(404).send();
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const deleted = await fileService.deleteFile(req.params.id);
        if (!deleted) return res.status(404).send();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadFile, getFile, deleteFile };


// -------------------------------------------------------------------------------------------------

// const { v4: uuidv4 } = require('uuid');
// const File = require('../models/imageTable');
// require('dotenv').config();
// const multer = require('multer');
// const { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

// const upload = multer({ storage: multer.memoryStorage() }).single("file");
// const s3Bucket = process.env.S3_BUCKET

// console.log('******************* Inside controller *********************')

// const s3Client = new S3Client({
//     region: 'us-east-1',
//   });

//   const uploadFiletoS3 = async (req, res) => {
//     console.log('------------------ Inside uploadFiletoS3 ----------------------------------')
//     try {
//       upload(req, res, async (err) => {
//         if (!req.file) {
//           return res.status(400).send('No file uploaded');
//         }
        
//         if (err) {
//           console.error('Error processing file:', err);
//           return res.status(500).send('Error processing file');
//         }
  
//         try {
//           // File upload and metadata retrieval
//           const key = uuidv4();
//           const s3Key = `${key}/${req.file.originalname}`;
          
//           await s3Client.send(new PutObjectCommand({
//             Bucket: s3Bucket,
//             Key: s3Key,
//             Body: req.file.buffer
//           }));
  
//           const headResponse = await s3Client.send(new HeadObjectCommand({
//             Bucket: s3Bucket,
//             Key: s3Key
//           }));
  
//           // Database operations
//           await sequelize.authenticate();
//           const fileRecord = await File.create({
//             file_name: req.file.originalname,
//             id: key,
//             url: `${s3Bucket}/${s3Key}`,
//             upload_date: headResponse.LastModified.toISOString().split("T0")[0]
//           });
  
//           // Single response point
//           res.status(200).json({
//             file_name: fileRecord.file_name,
//             id: fileRecord.id,
//             url: fileRecord.url,
//             upload_date: fileRecord.upload_date
//           });
//         } catch (uploadErr) {
//           if (!res.headersSent) {
//             res.status(400);
//           }
//           console.error('Error:', uploadErr);
//         }
//       });
//     } catch (err) {
//       if (!res.headersSent) {
//         res.status(400);
//       }
//       console.error('Unexpected error:', err);
//     }
//   };


// module.exports = {
// uploadFiletoS3,
// // deleteFile,
// // getFile
// };