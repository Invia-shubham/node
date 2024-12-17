const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes'); // Assuming you have userRoutes defined
const categoryRoutes = require('./routes/categoryRoute');
const uri = "mongodb+srv://new-user-31:BVjbKBhcu8puOKC3@cluster19986.4ktj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster19986";

// Create Express ap 
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api',categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});