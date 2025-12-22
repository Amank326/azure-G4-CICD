#!/usr/bin/env node
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ api: 'ready', version: '1.0' }));
app.post('/api/files/upload', (req, res) => res.json({ id: 'file-' + Date.now(), status: 'uploaded' }));
app.get('/api/files', (req, res) => res.json({ files: [] }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`)).on('error', e => {
  console.error('Server error:', e);
  setTimeout(() => process.exit(1), 1000);
});
