const express = require("express");
const auth = require("../middleware/auth");
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
} = require("../controllers/itemController");

const router = express.Router();

router.use(auth);

router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.post("/items", createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);
router.get("/stats", getStats);

module.exports = router;
