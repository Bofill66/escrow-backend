const express = require('express');
const cors = require('cors'); // ⬅️ 1. Importar CORS
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors()); // ⬅️ 2. Habilitar CORS
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente');
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      capture_method: 'manual',
    });
    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/release-payment', async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const payment = await stripe.paymentIntents.capture(paymentIntentId);
    res.json({ payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
