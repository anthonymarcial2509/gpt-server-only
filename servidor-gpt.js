const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Asegúrate de tener instalado node-fetch v2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ Servidor GPT está activo');
});

app.post('/preguntar', async (req, res) => {
  const { pregunta } = req.body;
  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    const respuestaGPT = await fetch(`${process.env.GPT_CHAT_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `__Secure-next-auth.session-token=${process.env.GPT_SESSION_TOKEN}`
      },
      body: JSON.stringify({ mensaje: pregunta })
    });

    const datos = await respuestaGPT.json();
    if (!datos || !datos.respuesta) {
      return res.status(500).json({ error: 'Respuesta vacía desde GPT' });
    }

    res.json({ respuesta: datos.respuesta });

  } catch (error) {
    console.error('❌ Error consultando GPT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
