const fileService = require('../services/fileService');
const logger = require('../utils/logger');

// Upload File
const uploadFile = async (req, res) => {
    if (!req.file) {
        logger.warn('No file received in the request');
        return res.status(400).send();
    }

    try {
        logger.info('Uploading file to S3');
        const file = await fileService.uploadFile(req.file);
        logger.info('File uploaded successfully', { fileId: file.id });
        res.status(201).json(file);
    } catch (error) {
        logger.error('Upload error', { error: error.message, stack: error.stack });
        res.status(500).send();
    }
};

// Get File Metadata
const getFile = async (req, res) => {
    try {
        logger.info(`Fetching file metadata for ID: ${req.params.id}`);
        const file = await fileService.getFile(req.params.id);
        if (!file) {
            logger.warn(`File not found: ${req.params.id}`);
            return res.status(404).send();
        }
        res.json(file);
    } catch (error) {
        logger.error('Error retrieving file', { error: error.message, stack: error.stack });
        res.status(500).send();
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        logger.info(`Deleting file with ID: ${req.params.id}`);
        const deleted = await fileService.deleteFile(req.params.id);
        if (!deleted) {
            logger.warn(`File not found for deletion: ${req.params.id}`);
            return res.status(404).send();
        }
        logger.info(`File deleted successfully: ${req.params.id}`);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting file', { error: error.message, stack: error.stack });
        res.status(500).send();
    }
};

module.exports = { uploadFile, getFile, deleteFile };
