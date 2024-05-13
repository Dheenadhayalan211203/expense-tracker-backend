const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

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

// Define the User1 schema
const user1Schema = new mongoose.Schema({
  title: String,
  amount: Number,
});

// Create the User1 model
const User1 = mongoose.model("user1", user1Schema);

// Create Expense schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
  imageData: String, 
});

const Expense = mongoose.model("Expense", expenseSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
app.post("/api/expenses", upload.single("image"), async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    imageData: req.file.path, 
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API to update an expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense == null) {
      return res.status(404).json({ message: "Expense not found" });
    }
    expense.title = req.body.title;
    expense.amount = req.body.amount;
    expense.date = req.body.date;
    expense.imageData = req.body.imageData; 
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API to delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
