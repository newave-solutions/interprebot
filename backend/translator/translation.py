from google.cloud import translate_v2 as translate

# Initialize Translation client
translate_client = translate.Client()

def translate_text(text, target_language):
    """Translates text using Google Cloud Translation API."""
    try:
        response = translate_client.translate(text, target_language=target_language)
        return response["translatedText"]
    except Exception as e:
        print(f"Translation error: {e}")
        return ""