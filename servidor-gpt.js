const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/preguntar', (req, res) => {
  res.send('✅ El endpoint /preguntar está activo, pero solo acepta solicitudes POST.');
});

app.post('/preguntar', async (req, res) => {
  const pregunta = req.body.pregunta;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  // Aquí puedes conectar con tu GPT personalizado
  res.json({ respuesta: `Respuesta generada para: ${pregunta}` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor intermedio escuchando en http://0.0.0.0:${PORT}`);
});