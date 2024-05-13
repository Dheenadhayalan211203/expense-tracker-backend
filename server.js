const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Expense schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
  imageData: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

// API to get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API to create a new expense
app.post("/api/expenses", async (req, res) => {
  // Your existing code to add expense
});

// API to update an expense
app.put("/api/expenses/:id", async (req, res) => {
  // Your existing code to update expense
});

// API to delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  // Your existing code to delete expense
});

// Route to add a product to the "user1" collection
app.post("/api/user1", async (req, res) => {
  const { title, amount } = req.body;

  // Create a new User1 document
  const product = new User1({
    title: title,
    amount: amount,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
