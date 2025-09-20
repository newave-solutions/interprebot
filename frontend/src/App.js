import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State for real-time transcription
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  // State for on-demand translation
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState('');

  // --- Real-time Transcription Logic ---

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          try {
            // The /translator/audio_chunk endpoint expects raw audio data
            const response = await axios.post('/translator/audio_chunk', event.data, {
              headers: { 'Content-Type': 'application/octet-stream' },
            });
            // The response contains HTML with highlighted/translated terms
            setTranscript(response.data.transcript);
          } catch (error) {
            console.error('Error sending audio chunk:', error);
          }
        }
      };

      mediaRecorder.start(3000); // Send data every 3 seconds
      setIsRecording(true);
    } catch (error) {
      console.error('Error getting user media:', error);
      alert('Could not access the microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- On-demand Translation Logic ---

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    setTranslationError('');
    setTranslatedText('');

    try {
      const response = await axios.post('/translator/translate', {
        text: textToTranslate,
        target_language: targetLanguage,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslationError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>InterpreBot</h1>
      </header>
      <main>
        <section className="transcription-section">
          <h2>Real-time Transcription</h2>
          <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <div className="transcript-output" dangerouslySetInnerHTML={{ __html: transcript || '...' }} />
        </section>

        <section className="translation-section">
          <h2>On-Demand Translation</h2>
          <textarea
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
            placeholder="Enter text to translate"
            rows="4"
          />
          <div className="controls">
            <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
              <option value="es">Spanish</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <button onClick={handleTranslate} disabled={isTranslating}>
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {translationError && <p className="error">{translationError}</p>}
          {translatedText && (
            <div className="translation-output">
              <h3>Translation:</h3>
              <p>{translatedText}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
