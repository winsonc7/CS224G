# Sprint 2 Progress & Team Contributions

## 🚀 General Sprint Progress
- Created a functional MVP, allowing users to message Talk2Me through a UI
- Added voice capabilities (user speech-to-text and model text-to-speech) to our terminal prototype
- Misc. tasks for product expansion and improvement
---

## 👥 Team Contributions

### Winson Cheng
- Continued Scrum Master roles (directed project, created and assigned issues)
- Transformed terminal demo into a fully functional full-stack application
  - Created basic React frontend
  - Converted chat logic to Flask APIs and integrated with UI
- Improved repo organization by adding Poetry dependency manager
- Compiled report on features, performance, and pricing of available speech solutions
- Created interview guide and contributed to conducting user interviews
- Main contributer to README files and sprint presentation slides

### Nahome Hagos
- Built features for detecting and responding to requests for symptom-diagnosis matching
  - Progress in `nahome-symptom-diagnosis` branch, yet to be combined with Sneha's work & merged
- Contributed to conducting user interviews

### Sneha Jayaganthan
- Built features for detecting and responding to requests for symptom-diagnosis matching
  - Progress in `sneha-symptom-diagnosis-match` branch, yet to be combined with Nahome's work & merged
- Reseached resources about legal compliance of AI therapy

### Amelia Kuang
- Implemented voice solutions into terminal demo
  - Integrated ElevenLabs speech-to-text and text-to-speech APIs
  - Created voice therapist with ElevenLabs conversational AI agent with engineered prompts (CBT-style response, guardrails against prompt injection and unhappy paths, and proper responses based on classification of user's intent into dire and common cases)
  - Updated README and refactored backend code to accommodate speech capabilities
- Contributed to sprint presentation slides
  - Recorded a demo video to showcase voice-enabled, low-latency AI thearpy interactions

### Max Meyberg
- Tried debugging React Native UI for therapy chat function
  - Abandoned - passed off to Winson to create React UI instead
- Conducted research on required steps and available solutions for adding animated avatars
