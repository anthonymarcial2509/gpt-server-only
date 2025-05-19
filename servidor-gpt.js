const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ Servidor GPT está activo');
});

app.post('/preguntar', async (req, res) => {
  const pregunta = req.body.pregunta;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta el campo pregunta' });
  }

  try {
    const respuesta = await consultarChatGPT(pregunta);
    res.json({ respuesta });
  } catch (error) {
    console.error('❌ Error al obtener respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

async function consultarChatGPT(pregunta) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Usamos tu sesión activa de ChatGPT
  await page.setCookie({
    name: '__Secure-next-auth.session-token',
    value: process.env.GPT_SESSION_TOKEN,
    domain: '.chat.openai.com',
    path: '/',
    httpOnly: true,
    secure: true
  });

  await page.goto('https://chat.openai.com/', { waitUntil: 'networkidle2' });

  // Esperamos campo de entrada
  await page.waitForSelector('textarea');
  await page.type('textarea', pregunta);
  await page.keyboard.press('Enter');

  // Esperamos respuesta
  await page.waitForSelector('.markdown', { timeout: 30000 });
  const respuesta = await page.$eval('.markdown', el => el.innerText);

  await browser.close();
  return respuesta;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor intermedio activo en http://0.0.0.0:${PORT}`);
});
