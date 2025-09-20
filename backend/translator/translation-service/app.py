from google.cloud import translate_v3 as translate

client = translate.TranslationServiceClient()
parent = f"projects/{PROJECT_ID}/locations/global"

def translate_medical_term(text, target_lang='es'):
    response = client.translate_text(
        parent=parent,
        contents=[text],
        target_language_code=target_lang,
        glossary_config={
            'glossary': 'projects/project-id/locations/global/glossaries/medical-glossary'
        }
    )
    return response.glossary_translations[0].translated_text

# Custom medical glossary (pre-loaded in GCP)
# Format: ENTERPRISE_MT,en,es
# hypertension,hypertension,hipertensión