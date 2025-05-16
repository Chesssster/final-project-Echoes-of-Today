// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const { initializeDefaultAdmin } = require('./models/AdminAccount');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize admin account
initializeDefaultAdmin();

// Middleware
// For production, we'll set CORS to allow requests from any origin
// This is because we're serving both backend and frontend from the same domain
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'echoes_of_today_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Increase JSON limit for handling images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const writeRoutes = require('./routes/writeRoutes');
const journalImageRoutes = require('./routes/journalImageRoutes');
const profilePictureRoutes = require('./routes/profilePictureRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/journals', writeRoutes);
app.use('/api/journal-images', journalImageRoutes);
app.use('/api/profile-pictures', profilePictureRoutes);
app.use('/api/admin', adminRoutes);

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
