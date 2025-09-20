// audio-processing/transcription-service/transcribe.js
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

async function transcribeAudio(audioBuffer) {
  const audio = { content: audioBuffer.toString('base64') };
  const config = {
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
  };

  const [response] = await client.recognize({ audio, config });
  return response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
}

module.exports = transcribeAudio;