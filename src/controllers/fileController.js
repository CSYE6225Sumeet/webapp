const fileService = require('../services/fileService');

// Upload File
const uploadFile = async (req, res) => {

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
        res.status(500).send();
    }
};




// Get File Metadata
const getFile = async (req, res) => {
    try {
        const file = await fileService.getFile(req.params.id);
        if (!file) return res.status(404).send();
        res.json(file);
    } catch (error) {
        res.status(500).send();
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const deleted = await fileService.deleteFile(req.params.id);
        if (!deleted) return res.status(404).send();
        res.status(204).send();
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = { uploadFile, getFile, deleteFile };