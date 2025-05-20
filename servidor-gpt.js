// servidor-gpt.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/preguntar', async (req, res) => {
  const pregunta = req.body.pregunta;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    // Enviar la pregunta al bot Venom que corre localmente
    const respuestaBot = await axios.post('http://localhost:3001/mensaje', {
      mensaje: pregunta
    });

    // Confirmar que el bot lo procesó correctamente
    return res.json({ respuesta: respuestaBot.data.respuesta });
  } catch (error) {
    console.error('Error al reenviar al bot local:', error.message);
    return res.status(500).json({ error: 'Error al contactar al bot Venom local' });
  }
});

app.listen(PORT, () => {
  console.log(`🔌 Servidor GPT corriendo en puerto ${PORT}`);
});
