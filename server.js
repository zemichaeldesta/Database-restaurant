const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Reservation Schema (✅ define globally here)
const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  person: String,
  date: String,
  time: String,
  message: String,
});

// ✅ Create the Reservation model globally
const Reservation = mongoose.model('Reservation', reservationSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://zemichael:zemichael@flavorsofitaly.krgvudl.mongodb.net/restaurantDB?retryWrites=true&w=majority&appName=FlavorsOfItaly')
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // Insert Sample Data (optional testing)
  const sampleReservation = new Reservation({
    name: 'John Doe',
    phone: '+1234567890',
    person: '2 Person',
    date: '2025-05-01',
    time: '07:00pm',
    message: 'Window seat please!'
  });

  try {
    await sampleReservation.save();
    console.log('✅ Sample Reservation Saved Successfully');
  } catch (error) {
    console.error('❌ Failed to Save Sample Reservation:', error);
  }

  // Start server AFTER MongoDB connects
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

})
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Route (can now use Reservation freely)
app.post('/reserve', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).send('Reservation saved successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save reservation.');
  }
});
