const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/preguntar', (req, res) => {
  res.send('✅ El endpoint /preguntar está activo, pero solo acepta POST.');
});

app.post('/preguntar', async (req, res) => {
  const { pregunta } = req.body;
  if (!pregunta) return res.status(400).json({ error: 'Falta el campo pregunta' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setCookie({
      name: '__Secure-next-auth.session-token',
      value: process.env.GPT_SESSION_TOKEN,
      domain: '.chatgpt.com',
      path: '/',
      httpOnly: true,
      secure: true
    });

    await page.goto(process.env.GPT_CHAT_URL, { waitUntil: 'networkidle2' });
    await page.waitForSelector('textarea');
    await page.type('textarea', pregunta);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-message-author-role="assistant"]', { timeout: 30000 });

    const respuesta = await page.evaluate(() => {
      const mensajes = document.querySelectorAll('[data-message-author-role="assistant"]');
      return mensajes[mensajes.length - 1]?.innerText || 'Sin respuesta';
    });

    await browser.close();
    res.json({ respuesta });
  } catch (err) {
    console.error('❌ Error al usar el GPT personalizado:', err);
    res.status(500).json({ error: 'Error al obtener respuesta del GPT' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
});
