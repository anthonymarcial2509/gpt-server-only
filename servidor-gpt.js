// servidor-gpt.js en Render
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LOCAL_BOT_URL = 'http://localhost:3001/preguntar'; // Cambia esto si usas ngrok

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor GPT Render activo.');
});

app.post('/preguntar', async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    const respuesta = await fetch(LOCAL_BOT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });

    const data = await respuesta.json();
    res.json(data);
  } catch (error) {
    console.error('Error reenviando a local:', error);
    res.status(500).json({ error: 'Error reenviando a bot local' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en Render corriendo en puerto ${PORT}`);
});
