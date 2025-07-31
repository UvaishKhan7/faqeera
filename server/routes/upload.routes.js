const express = require('express');
const router = express.Router();
const { generateUploadSignature } = require('../controllers/upload.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/signature', protect, admin, generateUploadSignature);

module.exports = router;