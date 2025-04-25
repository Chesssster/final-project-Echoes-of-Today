// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({limit: '50mb'})); // Increased limit for image uploads
app.use(express.static(path.join(__dirname, './')));

// In-memory storage (temporary until database is implemented)
let journals = [];
let profile = {
  name: 'John Doe',
  username: 'johndoe',
  joined: 'April 2025',
  bio: 'Nature enthusiast and amateur photographer. I journal daily to capture life\'s moments both big and small.',
  profilePicUrl: 'https://via.placeholder.com/150'
};

// Journal API Routes

// Get all journals
app.get('/api/journals', (req, res) => {
  res.json(journals);
});

// Get a single journal by ID
app.get('/api/journals/:id', (req, res) => {
  const journal = journals.find(j => j.id == req.params.id);
  
  if (!journal) {
    return res.status(404).json({ message: 'Journal not found' });
  }
  
  res.json(journal);
});

// Create a new journal
app.post('/api/journals', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  const now = new Date();
  
  const newJournal = {
    id: Date.now(),
    title,
    content,
    date: now.toISOString(),
    createdAt: now.toISOString()
  };
  
  journals.push(newJournal);
  
  res.status(201).json(newJournal);
});

// Update a journal
app.put('/api/journals/:id', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  const index = journals.findIndex(j => j.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Journal not found' });
  }
  
  const updatedJournal = {
    ...journals[index],
    title,
    content,
    updatedAt: new Date().toISOString()
  };
  
  journals[index] = updatedJournal;
  
  res.json(updatedJournal);
});

// Delete a journal
app.delete('/api/journals/:id', (req, res) => {
  const index = journals.findIndex(j => j.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Journal not found' });
  }
  
  journals.splice(index, 1);
  
  res.status(204).end();
});

// Profile API Routes

// Get user profile
app.get('/api/profile', (req, res) => {
  res.json(profile);
});

// Update user profile
app.put('/api/profile', (req, res) => {
  const { name, username, bio, profilePicUrl } = req.body;
  
  // Validate required fields
  if (!name || !username) {
    return res.status(400).json({ message: 'Name and username are required' });
  }
  
  // Update profile
  profile = {
    ...profile,
    name,
    username,
    bio: bio || profile.bio,
    profilePicUrl: profilePicUrl || profile.profilePicUrl,
    updatedAt: new Date().toISOString()
  };
  
  res.json(profile);
});

// Upload profile picture
app.post('/api/profile/picture', (req, res) => {
  const { imageData } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ message: 'Image data is required' });
  }
  
  // In a real app, you would:
  // 1. Validate the image data
  // 2. Process/optimize the image
  // 3. Store it to a file system or cloud storage
  // 4. Store the URL in the database
  
  // For this demo, we'll just store the image data directly
  profile.profilePicUrl = imageData;
  profile.updatedAt = new Date().toISOString();
  
  res.json({ 
    success: true,
    profilePicUrl: profile.profilePicUrl
  });
});

// Serve the index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 