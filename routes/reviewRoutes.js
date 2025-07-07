import express from 'express';
import { leaveReview, getReviewsByProduct } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, leaveReview);
router.get('/:productId', getReviewsByProduct);

export default router;
