
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/aiplatform');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: process.env.GCP_PROJECT_ID, 
  location: process.env.GCP_LOCATION 
});

const generativeModel = vertex_ai.getGenerativeModel({
    model: 'gemini-1.0-pro',
});

// API endpoint to interact with Gemini
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Prompt is required' });
    }

    try {
        const request = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        };

        const result = await generativeModel.generateContent(request);
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;
        
        res.send({ response: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).send({ error: 'Failed to generate content from AI model.' });
    }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});