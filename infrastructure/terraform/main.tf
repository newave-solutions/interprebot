resource "google_healthcare_dataset" "interprelab" {
  name     = "interpreter-dataset"
  location = "us-central1"
}

resource "google_storage_bucket" "hipaa_audio" {
  name          = "interprelab-hipaa-audio"
  storage_class = "REGIONAL"
  location      = "us-central1"
  encryption    = google_kms_crypto_key.enc_key.self_link
}