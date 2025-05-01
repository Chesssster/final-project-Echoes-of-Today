// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5500', // Adjust if using a different port or domain
  credentials: true
}));

// Increase JSON limit for handling images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const writeRoutes = require('./routes/writeRoutes');
const journalImageRoutes = require('./routes/journalImageRoutes');

app.use('/api/users', userRoutes);
app.use('/api/journals', writeRoutes);
app.use('/api/journal-images', journalImageRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for any unknown routes (for SPA or direct links)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
