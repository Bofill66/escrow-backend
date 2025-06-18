const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// Permitir CORS desde cualquier origen (solo para pruebas, en producción deberías restringirlo)
app.use(cors());

// Permite recibir JSON en las peticiones
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

// Escucha en Railway con su propio puerto o en local en 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
