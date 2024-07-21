const { NlpManager } = require('node-nlp');
const express = require('express');
const path = require('path');
const cors = require('cors');
const Filter = require('bad-words');

const bodyParser = require('body-parser');

const modelDirectory = path.join(__dirname, 'model.nlp'); // added path spec to local model file

const app = express();
app.use(cors()); // Enables CORS

const port = 5001; 

// Initialize the NLP manager
const manager = new NlpManager({ languages: ['en'] });
const filter = new Filter();

// Load the pre-trained model
manager.load(modelDirectory);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive messages from frontend
app.post('/message', async (req, res) => {
    const { message } = req.body;
    if (filter.isProfane(message)) {
        res.json({ answer: "Please refrain from using profanity! This is a respectable environment." });
    } else {
        const response = await manager.process('en', message.trim());
        res.json({ answer: response.answer || "I don't understand. Please rephrase your question." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Interface server for chatbot running on http://localhost:${port}`);
});