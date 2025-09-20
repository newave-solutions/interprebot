import json
import os
from google.cloud import translate_v3 as translate

# Initialize Translation API client
# It's recommended to use the v3 client.
# Ensure your service account has the "Cloud Translation API User" role.
project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
translate_client = translate.TranslationServiceClient()

def load_medical_terms(file_path="../../data/medical_terms.json"):
    """Load medical terms from a JSON file."""
    try:
        # Construct path relative to this script's location
        # This makes it work in both local dev and deployed environments
        script_dir = os.path.dirname(__file__)
        full_path = os.path.join(script_dir, file_path)
        with open(full_path, "r") as f:
            medical_terms = json.load(f)
        return set(medical_terms)  # Return as a set for faster lookups
    except Exception as e:
        print(f"Error loading medical terms: {e}")
        return set()  # Return an empty set in case of failure

def highlight_medical_terms(text):
    """Identifies and highlights medical terms.
       Uses Google Translate API as a fallback.
    """
    highlighted_text = ""
    medical_terms = load_medical_terms()
    parent = f"projects/{project_id}"

    words = text.split()
    for word in words:
        if word.lower() in medical_terms:
            highlighted_text += f"<span class='highlight'>{word}</span> "
        else:
            try:
                # Detect language using v3 client
                response = translate_client.detect_language(parent=parent, content=word)
                detected_language = response.languages[0].language_code

                if detected_language == 'en':
                    target_language = 'es'
                else:
                    target_language = 'en'

                # Translate text using v3 client
                response = translate_client.translate_text(
                    parent=parent,
                    contents=[word],
                    target_language_code=target_language,
                )
                translation = response.translations[0]
                highlighted_text += f"<span class='translated'>{word} ({translation.translated_text})</span> "
            except Exception as e:
                print(f"Translation error: {e}")
                highlighted_text += word + " "
    return highlighted_text
