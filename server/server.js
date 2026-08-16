const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import our Route Files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const teamRoutes = require('./routes/teams');

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Bind our Pipelines to specific global routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);

app.get('/', (req, res) => {
  res.send('EdBook Project Management Server Engine is Running smoothly!');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🎉 MongoDB Connected Successfully to edbook_db');
    app.listen(PORT, () => {
      const PORT = process.env.PORT || 5000;
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Failure Error:', err.message);
  });
