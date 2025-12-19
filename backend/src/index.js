const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Check for required environment variables
if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY || !process.env.AZURE_STORAGE_CONNECTION_STRING) {
    console.warn("Warning: Azure environment variables are not set. Please check your .env file or environment configuration.");
}


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Placeholder for API routes
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Use the files routes
app.use('/api/files', require('./routes/files'));

// Use search and filter routes
app.use('/api/search', require('./routes/search'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
