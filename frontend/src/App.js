
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post(`${API_URL}/api/generate`, { prompt });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching from backend API:', error);
      setResponse('Error: Could not get a response from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Interprebot</h1>
      <h2>AI Coach powered by Gemini</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask interprecoach anything..."
          rows="5"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px 20px' }}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px', background: '#f9f9f9' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;