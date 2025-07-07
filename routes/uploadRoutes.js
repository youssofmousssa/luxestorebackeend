import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/imgbb', verifyToken, uploadImage);

export default router;
