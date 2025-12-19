const express = require('express');
const cors = require('cors');
const filesRouter = require('./routes/files-local');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/files', filesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`\n✅ Backend running on http://localhost:${PORT}`);
    console.log(`📁 Upload files at: http://localhost:3000\n`);
});
