import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../services/sqliteClient.js';

const SALT_ROUNDS = 12;

function createJwtToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
} // user.id is now a UUID string

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: 'Missing fields' });

    const db = await getDb();

    // Check if email exists
    const existingUser = await db.get(`SELECT id FROM users WHERE email = ?`, email);
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userId = uuidv4();
    await db.run(
      `INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, 'user')`,
      userId,
      email,
      name,
      hashedPassword
    );

    const user = {
      id: userId,
      email,
      name,
      role: 'user',
    };

    const token = createJwtToken(user);

    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const db = await getDb();

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createJwtToken(user);

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
export async function logout(req, res, next) {
  try {
    // JWT invalidation not implemented (stateless): frontend discard token
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}
