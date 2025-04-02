const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;
const PYTHON_API = 'http://localhost:5000/predict';

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Prediction endpoint
app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post(PYTHON_API, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Python API:', error.message);
        res.status(500).json({ 
            status: 'error',
            message: 'Error processing prediction',
            details: error.message
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 'error',
        message: 'Something broke!'
    });
});

app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});