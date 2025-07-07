import { getDb } from '../services/sqliteClient.js';
import { v4 as uuidv4 } from 'uuid';
import stripe from '../services/stripeService.js';

// POST /api/cart
export async function saveCart(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid cart items' });

    const db = await getDb();

    // Upsert cart: INSERT OR REPLACE
    await db.run(
      `
      INSERT INTO carts (userId, items)
      VALUES (?, ?)
      ON CONFLICT(userId) DO UPDATE SET items = excluded.items
      `,
      req.user.id,
      JSON.stringify(items)
    );

    res.json({ message: 'Cart saved' });
  } catch (err) {
    next(err);
  }
}

// POST /api/checkout
export async function createCheckoutIntent(req, res, next) {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
}

// POST /api/orders
export async function createOrder(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { items, amount, status = 'pending', paymentIntentId } = req.body;

    if (!items || !Array.isArray(items) || amount == null)
      return res.status(400).json({ error: 'Invalid order data' });

    const db = await getDb();
    const nowISO = new Date().toISOString();

    const orderId = uuidv4();
    await db.run(
      `
      INSERT INTO orders (id, userId, items, amount, status, paymentIntentId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      orderId,
      req.user.id,
      JSON.stringify(items),
      amount,
      status,
      paymentIntentId || null,
      nowISO
    );

    const order = await db.get(`SELECT * FROM orders WHERE id = ?`, orderId);

    res.status(201).json({
      ...order,
      items: JSON.parse(order.items),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const order = await db.get(`SELECT * FROM orders WHERE id = ?`, id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Only admin or owner allowed
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ ...order, items: JSON.parse(order.items) });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/user/:userId
export async function getUserOrders(req, res, next) {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const db = await getDb();
    const orders = await db.all(`SELECT * FROM orders WHERE userId = ?`, userId);

    const parsedOrders = orders.map((o) => ({ ...o, items: JSON.parse(o.items) }));

    res.json(parsedOrders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (admin)
export async function getAllOrders(req, res, next) {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const db = await getDb();
    const orders = await db.all(`SELECT * FROM orders`);

    const parsedOrders = orders.map((o) => ({ ...o, items: JSON.parse(o.items) }));

    res.json(parsedOrders);
  } catch (err) {
    next(err);
  }
}
