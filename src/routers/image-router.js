const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/image-controller');
const methodRestrictor = require('../middleware/method-restrictor');

const router = express.Router();
// const upload = multer();

// Ensure `multer` properly processes file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory before uploading to S3
    // limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (10MB)
});

// console.log('------------------Inside Router--------------------------------')
router.head('/', methodRestrictor.methodNotAllowed);
router.head('/:id', methodRestrictor.methodNotAllowed);

// POST /v1/file - Upload File
router.post('/', upload.single('file'), fileController.uploadFile);
router.get('/', methodRestrictor.badRequest);
router.delete('/', methodRestrictor.badRequest);

router.options('/', methodRestrictor.methodNotAllowed);
router.patch('/', methodRestrictor.methodNotAllowed);
router.put('/', methodRestrictor.methodNotAllowed);

// GET /v1/file/:id - Retrieve File Metadata
router.get('/:id', fileController.getFile);

// DELETE /v1/file/:id - Delete File
router.delete('/:id', fileController.deleteFile);

router.options('/:id', methodRestrictor.methodNotAllowed);
router.patch('/:id', methodRestrictor.methodNotAllowed);
router.put('/:id', methodRestrictor.methodNotAllowed);
router.post('/:id', methodRestrictor.methodNotAllowed);

module.exports = router;
