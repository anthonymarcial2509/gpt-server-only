const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // asegúrate que esté instalado

const app = express();
const PORT = process.env.PORT || 3000;

// Usa el endpoint de NGROK (actualiza cada vez que se reinicie)
const VENOM_ENDPOINT = process.env.VENOM_ENDPOINT || https://12db-38-56-219-210.ngrok-free.app/preguntar;

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

    const data = await respuesta.json();
    res.json(data);

  } catch (error) {
    console.error('Error al contactar con Venom:', error);
    res.status(500).json({ error: 'Error al contactar con Venom' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor GPT en puerto ${PORT}`);
});
