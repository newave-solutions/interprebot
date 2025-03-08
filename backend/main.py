from flask import Flask, render_template
from flask_socketio import SocketIO
from speech_to_text import transcribe_audio
from medical_terms import highlight_medical_terms
from translation import translate_text

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/")
def index():
    """Serve the main HTML template."""
    return render_template("index.html")

@socketio.on("audio_chunk")
def handle_audio_chunk(audio_chunk):
    """Process audio chunks in real-time."""
    try:
        # Step 1: Transcribe audio
        transcript = transcribe_audio(audio_chunk)
        
        # Step 2: Highlight medical terms
        highlighted_transcript = highlight_medical_terms(transcript)
        
        # Step 3: Emit the response back to the frontend
        socketio.emit("transcription", {"transcript": highlighted_transcript})
    except Exception as e:
        socketio.emit("error", {"message": str(e)})

if __name__ == "__main__":
    # Run the app
    socketio.run(app, debug=True)








