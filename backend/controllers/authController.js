const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d"
  });

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const validateRegisterPayload = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return "Please provide a valid email.";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const validationError = validateRegisterPayload({ name, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const safeEmail = normalizeEmail(email);
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [safeEmail]);
    if (existing.length) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name.trim(), safeEmail, phone || null, hashedPassword]
    );

    const token = signToken(result.insertId);
    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: result.insertId,
        name: name.trim(),
        email: safeEmail,
        phone: phone || null
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const safeEmail = normalizeEmail(email);
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [safeEmail]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user.id);
    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    return next(error);
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE || "false") === "true",
  auth: process.env.EMAIL_USER
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    : undefined
});

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const safeEmail = normalizeEmail(email);
    const [rows] = await db.query("SELECT id, name, email FROM users WHERE email = ?", [safeEmail]);
    const user = rows[0];

    // Return success to avoid exposing registered emails.
    if (!user) {
      return res.json({ message: "If this email is registered, reset instructions have been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.query("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?", [
      resetToken,
      resetTokenExpiry,
      user.id
    ]);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    if (process.env.EMAIL_USER) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your password",
        text: `Hi ${user.name}, reset your password using this link: ${resetLink}`,
        html: `<p>Hi ${user.name},</p><p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`
      });
    } else {
      console.log("Password reset link (EMAIL_USER not configured):", resetLink);
    }

    return res.json({ message: "If this email is registered, reset instructions have been sent." });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const [rows] = await db.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, created_at FROM users WHERE id = ?", [
      req.user.id
    ]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  me
};
