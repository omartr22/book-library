const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const Book = mongoose.model('Book', new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  cover: String // new field
}));

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});
const upload = multer({ storage });

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new book
app.post('/books', upload.single('cover'), async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : '';

    const book = new Book({ title, author, genre, cover });
    await book.save();

    res.json(book);
  } catch (err) {
    console.error("Error saving book:", err);
    res.status(500).json({ error: err.message });
  }
});


// Delete a book by id
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting book:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
