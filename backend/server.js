const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_DB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Package Schema
const packageSchema = new mongoose.Schema({
  destination: String,
  name: String,
  duration: String,
  flights: String,
  hotels: String,
  transfers: String,
  activities: String,
  meals: String,
  price: String,
  img: String,
});

const Package = mongoose.model('Package', packageSchema);

// Routes
app.get('/api/packages/:destination', async (req, res) => {
  const { destination } = req.params;
  try {
    const packages = await Package.find({ destination });
    res.json(packages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
