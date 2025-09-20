# InterpreBot

InterpreBot is a web-based application designed to provide real-time speech-to-text transcription and translation, with a special focus on medical terminology. It acts as an automated interpreter to assist in conversations where accurate medical language is crucial.

## Architecture

The project is a monorepo that consists of a React frontend and a backend composed of Node.js and Python services. The backend leverages Google Cloud AI services for its core transcription and translation capabilities.

### Frontend

The frontend is a single-page application built with **React** (using Create React App). It provides the user interface for capturing audio, displaying the transcribed text in real-time, and showing the corresponding translation. It communicates with the backend via HTTP requests (using `axios`) and likely WebSockets for real-time data streams. The frontend is configured for deployment on **Firebase Hosting**.

### Backend

The backend is not a set of traditional, independent microservices but rather a modular application with two main components:

1.  **Node.js (Express) Server**: This serves as the primary API gateway for the application. It handles standard HTTP requests from the frontend. Its responsibilities likely include user management, and it uses the transcription module to process audio data.

2.  **Python (Flask) Server**: This component manages the real-time communication for transcription and translation. It uses `Flask-SocketIO` to create a WebSocket connection with the frontend for streaming audio. It utilizes the **Google Cloud Speech-to-Text** service to transcribe the audio and the **Google Cloud Translation** service to translate the text.

### AI & Data

-   **Speech-to-Text**: Audio is transcribed using the **Google Cloud Speech-to-Text API**.
-   **Translation**: Text is translated using the **Google Cloud Translation API**.
-   **Medical Glossary**: To improve the accuracy of translating medical terms, the application uses a custom glossary configured in Google Cloud. This ensures that specialized terminology is translated correctly. The `data/medical_terms.json` file contains the source for this glossary.
-   **Jupyter Notebooks**: The `ai-models/` and `data/` directories contain Jupyter notebooks used for model training, experimentation, and interacting with Google's Vertex AI platform.

### Infrastructure

-   **Hosting**: The frontend is deployed on **Firebase Hosting**. The backend services are likely deployed as **Firebase Functions** or on another GCP service like Cloud Run or App Engine.
-   **CI/CD**: **Google Cloud Build** is used for continuous integration and deployment, as defined in `cloudbuild.yaml`.
-   **Infrastructure as Code**: **Terraform** is used to manage and provision the Google Cloud infrastructure (see `infrastructure/terraform/`).

## Technology Stack

-   **Frontend**: React, React Scripts, Axios
-   **Backend**:
    -   Node.js, Express.js
    -   Python, Flask, Flask-SocketIO
-   **AI/ML**:
    -   Google Cloud Speech-to-Text
    -   Google Cloud Translation
    -   Google Cloud AI Platform / Vertex AI
-   **Deployment & Infrastructure**:
    -   Firebase (Hosting, Admin SDK)
    -   Google Cloud Build
    -   Terraform
-   **Monorepo Management**: npm Workspaces, concurrently

## Directory Structure

```
/workspaces/interprebot/
├── backend/                # Backend services
│   ├── analytics-service/    # Analytics service module
│   ├── transcription-service/ # Node.js transcription module
│   ├── translation-service/  # Python translation module
│   ├── index.js              # Main Node.js server entrypoint
│   ├── main.py               # Main Python server entrypoint
│   ├── package.json          # Node.js dependencies
│   └── requirements.txt      # Python dependencies
├── data/                   # Data scripts and files
│   └── medical_terms.json  # Custom medical glossary data
├── frontend/               # React frontend application
│   ├── public/
│   └── src/
│       └── App.js
├── infrastructure/         # Infrastructure as Code
│   ├── cloudbuild.yaml     # CI/CD pipeline configuration
│   └── terraform/          # Terraform configuration
├── ai-models/              # Jupyter notebooks for AI model training
├── package.json            # Root package.json for monorepo setup
└── README.md               # This file
```

## Getting Started

### Prerequisites

-   Node.js and npm
-   Python
-   Google Cloud SDK
-   Firebase CLI

### Installation

1.  **Install root dependencies**:
    ```bash
    npm install
    ```
    This will also install the dependencies for the `frontend` and `backend` workspaces.

2.  **Install Python dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```

### Running the Application

You can run the frontend and backend servers in separate terminals.

-   **Start the Frontend**:
    ```bash
    npm run start:frontend
    ```
    This will start the React development server, usually on `http://localhost:3000`.

-   **Start the Backend**:
    The backend consists of a Node.js and a Python server. You will need to run both.
    ```bash
    # Start the Node.js server
    npm run start:backend

    # In a separate terminal, start the Python server
    python backend/main.py
    ```