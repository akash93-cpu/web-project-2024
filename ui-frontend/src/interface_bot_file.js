const { NlpManager } = require('node-nlp');
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Add this line to enable CORS

const port = 5001; // Choose a suitable port

// Initialize the NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Load the pre-trained model
manager.load();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive messages from frontend
app.post('/message', async (req, res) => {
    const { message } = req.body;
    const response = await manager.process('en', message.trim());
    res.json({ answer: response.answer || "I don't understand." });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
