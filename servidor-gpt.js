// servidor-gpt.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Reemplaza esta URL con tu endpoint local o de ngrok
const VENOM_ENDPOINT = 'https://2121-38-56-219-210.ngrok-free.app/preguntar';

app.get('/', (req, res) => {
  res.send('Servidor GPT está activo');
});

app.post('/preguntar', async (req, res) => {
  // Lógica aquí
});
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    const respuesta = await fetch(VENOM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });

    const datos = await respuesta.json();
    res.json(datos);

  } catch (error) {
    console.error('Error consultando GPT:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor intermediario escuchando en http://localhost:${PORT}`);
});
