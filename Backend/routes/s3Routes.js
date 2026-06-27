 const express =require('express');
const authMiddleware=require('../middlewares/authMiddleware');

const {
    upload,
    uploadFile,
    getFileUrl,
    deleteFile,}=require('../controllers/s3controllers');

const router=express.Router();

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/url/:key', authMiddleware, getFileUrl);
router.delete('/:key', authMiddleware, deleteFile);

module.exports = router;