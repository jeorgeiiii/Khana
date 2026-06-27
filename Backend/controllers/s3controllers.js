const {PutObjectCommand,GetObjectCommand,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const s3Client = require('../config/s3');

const BUCKET = process.env.S3_BUCKET;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        // Decide which bucket: public for images, private by default
        const isPublic = req.body.isPublic === 'true' || req.query.public === 'true';
        const bucket = isPublic ? process.env.S3_PUBLIC_BUCKET : process.env.S3_BUCKET;

        const timestamp = Date.now();
        const safeName = req.file.originalname.replace(/\s+/g, '-').toLowerCase();
        const folder = isPublic ? 'images' : 'uploads';
        const key = `${folder}/${timestamp}-${safeName}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        });

        await s3Client.send(command);

        // Build the URL the frontend should use
        let url;
        if (isPublic) {
            // Serve through CloudFront for speed
            url = `${process.env.CLOUDFRONT_URL}/${key}`;
        } else {
            // Private files need a presigned URL each time
            const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
            url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded',
            bucket,
            key,
            url,
            isPublic,
        });
    } catch (error) {
        console.error('S3 upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message,
        });
    }
};
exports.getFileUrl = async (req, res) => {
    try {
        const { key } = req.params;
        const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: decodeURIComponent(key),
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        res.status(200).json({ success: true, url });
    } catch (error) {
        console.error('Presigned URL error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate URL',
            error: error.message,
        });
    }
};

// Delete a file
exports.deleteFile = async (req, res) => {
    try {
        const { key } = req.params;

        const command = new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: decodeURIComponent(key),
        });
        await s3Client.send(command);

        res.status(200).json({ success: true, message: 'File deleted Successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message,
        });
    }
};

exports.upload=upload;