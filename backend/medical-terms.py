import json
from google.cloud import translate_v2 as translate

# Initialize Translation API client
translate_client = translate.client()

def load_medical_terms(file_path="data/medical_terms.json"):
    """Load medical terms from a JSON file."""
    try:
        with open(file_path, "r") as f:
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
    medical_terms = load_medical_terms_from_source()

    words = text.split()
    for word in words:
        if word.lower() in medical_terms:
            highlighted_text += f"<span class='highlight'>{word}</span> "
        else:
            try:
                # Detect language
                detected_language = translate_client.detect_language(word)['language']
                if detected_language == 'en':
                    target_language = 'es'
                else:
                    target_language = 'en'

                translation = translate_client.translate(word, target_language=target_language)
                highlighted_text += f"<span class='translated'>{word} ({translation['translatedText']})</span> "
            except Exception as e:
                print(f"Translation error: {e}")
                highlighted_text += word + " "
    return highlighted_text