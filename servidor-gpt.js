// servidor-gpt.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const VENOM_ENDPOINT = process.env.VENOM_ENDPOINT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Servidor GPT está activo');
});

app.post('/preguntar', async (req, res) => {
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

    if (!respuesta.ok) {
      throw new Error(`Error al contactar con Venom: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    res.json({ respuesta: datos.respuesta || datos });
  } catch (error) {
    console.error('Error en /preguntar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor GPT escuchando en el puerto ${PORT}`);
});
