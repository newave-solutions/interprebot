
require('dotenv').config();
const express = require('express');
const functions = require('firebase-functions');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();

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

// Expose the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
