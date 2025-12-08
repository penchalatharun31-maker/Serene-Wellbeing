import express from 'express';
import { uploadFile, uploadMultipleFiles } from '../controllers/upload.controller';
import { protect } from '../middleware/auth';
import { uploadImage, uploadDocument } from '../utils/upload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Protected routes
router.use(protect);
router.use(uploadLimiter);

router.post('/image', uploadImage.single('file'), uploadFile);
router.post('/document', uploadDocument.single('file'), uploadFile);
router.post('/multiple', uploadImage.array('files', 5), uploadMultipleFiles);

export default router;
