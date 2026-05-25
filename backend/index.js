const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (we'll add these next)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});