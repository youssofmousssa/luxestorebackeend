import { getDb } from '../services/sqliteClient.js';
import { v4 as uuidv4 } from 'uuid';

// POST /api/reviews
export async function leaveReview(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, rating, comment } = req.body;

    if (!productId || !rating) return res.status(400).json({ error: 'Missing required fields' });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    const db = await getDb();
    const nowISO = new Date().toISOString();

    const reviewId = uuidv4();
    await db.run(
      `
      INSERT INTO reviews (id, productId, userId, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      reviewId,
      productId,
      req.user.id,
      rating,
      comment || '',
      nowISO
    );

    const review = await db.get(`SELECT * FROM reviews WHERE id = ?`, reviewId);

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:productId
export async function getReviewsByProduct(req, res, next) {
  try {
    const { productId } = req.params;

    const db = await getDb();

    const reviews = await db.all(`SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC`, productId);

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}
