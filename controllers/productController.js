import { getDb } from '../services/sqliteClient.js';
import { v4 as uuidv4 } from 'uuid';

// Helper: parse JSON arrays stored as TEXT
function parseArrayField(field) {
  try {
    if (!field) return [];
    return JSON.parse(field);
  } catch {
    return [];
  }
}

// GET /api/products
export async function getAllProducts(req, res, next) {
  try {
    const db = await getDb();
    const products = await db.all(`SELECT * FROM products`);

    // Parse JSON fields
    const parsedProducts = products.map((p) => ({
      ...p,
      sizes: parseArrayField(p.sizes),
      colors: parseArrayField(p.colors),
    }));

    res.json(parsedProducts);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
export async function getProductById(req, res, next) {
  try {
    // 'id' is a UUID string
    const { id } = req.params;
    const db = await getDb();
    const product = await db.get(`SELECT * FROM products WHERE id = ?`, id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      ...product,
      sizes: parseArrayField(product.sizes),
      colors: parseArrayField(product.colors),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/products (admin only)
export async function createProduct(req, res, next) {
  try {
    const { name, description, price, sizes, colors, imageURL, stockQty, category } = req.body;

    if (!name || price == null) return res.status(400).json({ error: 'Name and price required' });

    const db = await getDb();

    const productId = uuidv4();
    await db.run(
      `
      INSERT INTO products
      (id, name, description, price, sizes, colors, imageURL, stockQty, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      productId,
      name,
      description || '',
      price,
      JSON.stringify(sizes || []),
      JSON.stringify(colors || []),
      imageURL || '',
      stockQty ?? 0,
      category || ''
    );

    const product = await db.get(`SELECT * FROM products WHERE id = ?`, productId);

    res.status(201).json({
      ...product,
      sizes: parseArrayField(product.sizes),
      colors: parseArrayField(product.colors),
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin only)
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    let { name, description, price, sizes, colors, imageURL, stockQty, category } = req.body;

    const db = await getDb();

    // Fetch existing product
    const product = await db.get(`SELECT * FROM products WHERE id = ?`, id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Use existing if not provided
    name = name ?? product.name;
    description = description ?? product.description;
    price = price ?? product.price;
    sizes = sizes !== undefined ? JSON.stringify(sizes) : product.sizes;
    colors = colors !== undefined ? JSON.stringify(colors) : product.colors;
    imageURL = imageURL ?? product.imageURL;
    stockQty = stockQty ?? product.stockQty;
    category = category ?? product.category;

    await db.run(
      `
      UPDATE products SET
        name = ?,
        description = ?,
        price = ?,
        sizes = ?,
        colors = ?,
        imageURL = ?,
        stockQty = ?,
        category = ?
      WHERE id = ?
      `,
      name,
      description,
      price,
      sizes,
      colors,
      imageURL,
      stockQty,
      category,
      id
    );

    const updated = await db.get(`SELECT * FROM products WHERE id = ?`, id);

    res.json({
      ...updated,
      sizes: parseArrayField(updated.sizes),
      colors: parseArrayField(updated.colors),
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id (admin only)
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();

    // 'id' is a UUID string
    const result = await db.run(`DELETE FROM products WHERE id = ?`, id);

    if (result.changes === 0)
      return res.status(404).json({ error: 'Product not found or delete failed' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
