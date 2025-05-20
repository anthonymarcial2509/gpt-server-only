const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Usa bodyParser para leer JSON
app.use(bodyParser.json());

// 🔁 Asegúrate de actualizar esta URL si usas ngrok o Render
const VENOM_ENDPOINT = 'https://2121-38-56-219-210.ngrok-free.app/preguntar';

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor GPT está activo');
});

// Ruta para redirigir preguntas
app.post('/preguntar', async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    const respuesta = await fetch(VENOM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta }),
    });

    const data = await respuesta.json();
    res.json(data);
  } catch (error) {
    console.error('Error al comunicar con Venom:', error);
    res.status(500).json({ error: 'Error interno al conectar con Venom' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor GPT corriendo en http://localhost:${PORT}`);
});

