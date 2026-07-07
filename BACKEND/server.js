const dns = require('dns');

// Use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth system API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});