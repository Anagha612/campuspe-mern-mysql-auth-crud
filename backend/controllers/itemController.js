const db = require("../config/db");

const isValidStatus = (status) => ["active", "pending", "completed"].includes(status);

const getItems = async (req, res, next) => {
  try {
    const [items] = await db.query(
      "SELECT id, user_id, title, description, status, created_at, updated_at FROM items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, user_id, title, description, status, created_at, updated_at FROM items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "Item not found." });
    }
    return res.json({ item: rows[0] });
  } catch (error) {
    return next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (status && !isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const [result] = await db.query(
      "INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [req.user.id, title.trim(), description || null, status || "active"]
    );

    const [rows] = await db.query(
      "SELECT id, user_id, title, description, status, created_at, updated_at FROM items WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({ message: "Item created successfully.", item: rows[0] });
  } catch (error) {
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (status && !isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const [rows] = await db.query("SELECT id FROM items WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Item not found." });
    }

    await db.query(
      "UPDATE items SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status) WHERE id = ? AND user_id = ?",
      [title?.trim() || null, description ?? null, status || null, req.params.id, req.user.id]
    );

    const [updatedRows] = await db.query(
      "SELECT id, user_id, title, description, status, created_at, updated_at FROM items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    return res.json({ message: "Item updated successfully.", item: updatedRows[0] });
  } catch (error) {
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Item not found." });
    }
    return res.json({ message: "Item deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total, SUM(status = 'active') AS active, SUM(status = 'pending') AS pending, SUM(status = 'completed') AS completed FROM items WHERE user_id = ?",
      [req.user.id]
    );

    const stats = rows[0] || {};
    return res.json({
      stats: {
        total: Number(stats.total || 0),
        active: Number(stats.active || 0),
        pending: Number(stats.pending || 0),
        completed: Number(stats.completed || 0)
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
};
