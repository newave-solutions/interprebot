from flask import Flask, request, jsonify
from firebase_functions import https_fn
from firebase_admin import initialize_app
from transcription import transcribe_audio
from translation import highlight_medical_terms, translate_text

app = Flask(__name__)
initialize_app()

@app.route("/audio_chunk", methods=['POST'])
def handle_audio_chunk():
    """
    Process audio chunks received via HTTP POST.
    Note: This was refactored from a WebSocket handler to be compatible
    with Cloud Functions.
    """
    audio_chunk = request.data
    if not audio_chunk:
        return jsonify({"error": "No audio data received"}), 400
    try:
        # Step 1: Transcribe audio
        transcript = transcribe_audio(audio_chunk)

        # Step 2: Highlight medical terms
        highlighted_transcript = highlight_medical_terms(transcript)

        # Step 3: Return the response as JSON
        return jsonify({"transcript": highlighted_transcript})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/translate", methods=['POST'])
def handle_translation():
    """
    Translates a given text to a target language.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON provided."}), 400

    text = data.get('text')
    target_language = data.get('target_language')

    if not text or not target_language:
        return jsonify({"error": "Request must include 'text' and 'target_language'"}), 400

    try:
        translation = translate_text(text, target_language)
        return jsonify({"translatedText": translation.translated_text})
    except Exception as e:
        return jsonify({"error": f"Translation failed: {e}"}), 500

@https_fn.on_request()
def translator(req: https_fn.Request) -> https_fn.Response:
    """Wraps the Flask app for deployment as a Cloud Function."""
    with app.request_context(req.environ):
        return app.full_dispatch_request()
