const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Reservation Schema (Global)
const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  person: String,
  date: String,
  time: String,
  message: String,
});

// Reservation Model (Global)
const Reservation = mongoose.model('Reservation', reservationSchema);

// MongoDB Connection (dynamic for Render)
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://zemichael:zemichael@flavorsofitaly.krgvudl.mongodb.net/restaurantDB?retryWrites=true&w=majority&appName=FlavorsOfItaly';

mongoose.connect(mongoURI, {})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // Start server after successful database connection
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });

})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Handle reservation form submissions
app.post('/reserve', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).send('Reservation saved successfully!');
  } catch (err) {
    console.error('❌ Error saving reservation:', err);
    res.status(500).send('Failed to save reservation.');
  }
});

// Root route to confirm backend is alive (Optional)
app.get('/', (req, res) => {
  res.send('✅ Reservation backend is running.');
});
