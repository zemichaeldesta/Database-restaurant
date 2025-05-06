const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // ✅ Use Stripe secret from env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  person: String,
  date: String,
  time: String,
  message: String,
});

// Model
const Reservation = mongoose.model('Reservation', reservationSchema);

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Reservation route
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

// Stripe Checkout route
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'https://your-frontend-url.com/success',
      cancel_url: 'https://your-frontend-url.com/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session error:', err);
    res.status(500).send('Failed to create Stripe session');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running.');
});
