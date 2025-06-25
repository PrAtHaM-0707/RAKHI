const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const authRoutes = require('./routes/auth');
const { connectDB } = require('./config/db');

dotenv.config();
const app = express();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', upload.array('images', 3), productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));