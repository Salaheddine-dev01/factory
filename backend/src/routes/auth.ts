// backend/src/routes/auth.ts
import express, { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const JWT_SECRET = "your-secret-key-change-this-in-production-2025";

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username }); // Don't log passwords!

    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: "Username and password required" });
    }

    // Find user
    const [users]: any = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    console.log('Users found:', users.length);

    if (users.length === 0) {
      console.log('No user found with username:', username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Check if password is bcrypt hash or plain text
    let isValidPassword = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // Bcrypt hash - use bcrypt.compare
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Using bcrypt comparison');
    } else {
      // Plain text - direct comparison
      isValidPassword = user.password === password;
      console.log('Using plain text comparison');
    }

    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password mismatch');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log('Login successful for user:', username);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Verify token endpoint
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    res.json({
      valid: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        full_name: decoded.full_name,
      },
    });
  } catch (err: any) {
    res.status(401).json({ error: "Invalid token", details: err.message });
  }
});

export default router;