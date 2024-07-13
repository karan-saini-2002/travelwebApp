const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add this to handle cookies

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); 
// CORS options
const corsOptions = {
  origin: 'http://127.0.0.1:8080', // Update with your client URL
  credentials: true 
};
app.use(cors(corsOptions));

// Connect to MongoDB
const mongoURI = process.env.MONGO_DB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' } 
});
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie with the JWT token
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: 'None', secure: true });
    res.status(200).json({ message: 'Logged in successfully', role: user.role });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authentication middleware
const auth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};




app.get('/protected', auth, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route' });
});


app.get('/logout', (req, res) => {
  res.clearCookie('jwt'); // Clear the JWT cookie
  res.status(200).json({ message: 'Logged out successfully' });
});


const flightSchema = new mongoose.Schema({
  details: String,
  flightNumber: String,
  departureDate: Date,
  returnDate: Date
});

const hotelSchema = new mongoose.Schema({
  details: String,
  name: String,
  address: String,
  checkIn: Date,
  checkOut: Date,
  bookingDetails: String
});

const policySchema = new mongoose.Schema({
  title: String,
  description: String
});

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  date: Date,
  hotel: String,
  hotelStars: String,
  car: String,
  sightseeing: String
});

const activitySchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String
});

const packageSchema = new mongoose.Schema({
  destination: String,
  name: String,
  duration: String,
  flights: flightSchema,
  hotels: hotelSchema,
  transfers: String,
  activities: [activitySchema],
  meals: String,
  price: String,
  img: String,
  imgUrls: [String],
  policies: [policySchema],
  itinerary: [itineraryDaySchema]
});
const Package = mongoose.model('Package', packageSchema);

// Routes for packages
app.get('/api/packages/:destination', async (req, res) => {
  const { destination } = req.params;
  try {
    const packages = await Package.find({ destination });
    res.json(packages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/package/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
