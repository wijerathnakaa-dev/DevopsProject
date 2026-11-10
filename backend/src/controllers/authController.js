const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: { message: 'Password must be at least 6 characters' } });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Customer').trim();

    // Check existing email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: { message: 'An account with this email already exists' } });
    }

    // Public sign-ups are always customers. Admins are created only via seed data / database.
    const role = 'customer';
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, passwordHash, role]
    );

    const newUser = {
      id: result.insertId,
      name: cleanName,
      email: cleanEmail,
      role: role
    };

    const token = signToken(newUser);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    res.status(500).json({ error: { message: 'Registration failed due to server error' } });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = signToken(authUser);

    res.json({
      message: 'Login successful',
      token,
      user: authUser
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    res.status(500).json({ error: { message: 'Login failed due to server error' } });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: { message: 'User profile not found' } });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('[GetMe Error]:', err);
    res.status(500).json({ error: { message: 'Failed to retrieve profile' } });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
