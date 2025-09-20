,# Gemini Instructions for the InterpreLab Project

This guide provides instructions for the AI coding assistant to effectively contribute to the InterpreLab codebase.

## 🏛️ Architecture Overview

InterpreLab consists of three main components: a **`core-server`** (FastAPI backend), a **`web-ui`** (React frontend), and an **`audio-engine`** (client-side processing). The system provides real-time and post-session feedback to medical interpreters.

**Key Feature: Quality Assurance Analysis**
A core feature is the analysis of interpretation quality. This goes beyond simple translation and includes professional standards.
-   The `web-ui` sends the source text and the interpreted text to the `core-server` via a WebSocket.
-   The `MedicalAI` class (`gemini_client.py`) uses a specialized prompt in its `analyze_grammar` method to instruct the Gemini model.
-   The analysis must evaluate two key areas:
    1.  **Grammatical Equivalence**: Is the interpretation grammatically correct?
    2.  **Conservation of Register**: Does the interpretation match the source speaker's tone, formality, and vocabulary level (e.g., jargon vs. layman's terms)?
-   The feedback provided by the AI **must cite the NCIHC (National Council on Interpreting in Health Care) standard of Accuracy** as the basis for its register analysis.

## 📝 Project Conventions & Key Files

* **AI Integration & Prompts**: All AI analysis is centralized in `core-server/gemini_client.py`. Prompts must be highly detailed and explicitly instruct the model to perform analysis based on professional interpreting standards.
* **Citing Ethical Standards**: Prompts that evaluate interpreter performance must instruct the AI to reference specific tenets from industry codes of ethics, such as the NCIHC's principle of Accuracy regarding register.
* **WebSocket Data Contracts**: The `/ws/audio` endpoint expects a JSON object with `source` and `target` keys. The response contains a `grammar_feedback` key, which includes the score and detailed analysis.
