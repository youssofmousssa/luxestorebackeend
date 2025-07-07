import express from 'express';
import {
  saveCart,
  createCheckoutIntent,
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/cart', verifyToken, saveCart);
router.post('/checkout', createCheckoutIntent);
router.post('/', verifyToken, createOrder);
router.get('/:id', verifyToken, getOrderById);
router.get('/user/:userId', verifyToken, getUserOrders);
router.get('/', verifyToken, isAdmin, getAllOrders);

export default router;
