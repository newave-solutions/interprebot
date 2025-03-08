from google.cloud import speech

# Initialize Speech-to-Text client
speech_client = speech.SpeechClient()

def transcribe_audio(audio_data):
    """Transcribes audio data using Google Cloud Speech-to-Text API.
       Handles both English and Spanish.
    """
    try:
        audio = speech.RecognitionAudio(content=audio_data)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,  # Adjust as needed
            language_code="en-US",  # Start with English
            alternative_language_codes=["es-ES"] # Add Spanish as an alternative
        )
        response = speech_client.recognize(config=config, audio=audio)
        return response.results.alternatives.transcript
    except Exception as e:
        print(f"Speech-to-Text error: {e}")
        return ""