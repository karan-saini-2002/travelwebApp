const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json());

// CORS options
const corsOptions = {
  origin: 'http://127.0.0.1:8080', 
  credentials: true 
};

app.use(cors(corsOptions));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URI,
    ttl: 7 * 24 * 60 * 60 
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' 
  }
}));

// Connect to MongoDB
const mongoURI = process.env.MONGO_DB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    next(err); 
  }
});

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    req.session.user = user;
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err); 
  }
});

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  } else {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  }
});

// Middleware to check if the user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.get('/protected', checkAuth, (req, res) => {
  res.status(200).send('You are authenticated');
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
