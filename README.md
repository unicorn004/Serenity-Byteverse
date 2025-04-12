# Serenity: Mental Health Self-Assessment Platform

Serenity is a comprehensive mental wellness platform that helps users assess their mental health, connect with a supportive community, and access professional therapy services. The platform leverages AI/ML technologies to provide personalized assessments, insights, and solutions. It uses a modular backend built with Django, with separate apps for assessments, therapist services, and forums. JWT authentication secures API endpoints.

## Key Features

### AI/ML Features

- **AI-Powered Assessments**:
  - Dynamic, AI-powered mental health assessments with personalized questions and responses.
  - Each assessment generates a detailed score and analysis based on user input.
  - AI adapts the assessment based on responses to ensure accuracy and relevance.
  - Personalized remarks and actionable solutions are generated after each assessment to guide users through their mental wellness journey.
  - **Gamification**: The assessments are gamified to increase user engagement and make mental health evaluation more interactive and fun.

- **Emotion Detection**:
  - AI-based emotion detection analyzes user inputs such as diary entries, responses, and interactions to detect their mood and emotional state.
  - Provides real-time feedback and insights into the user's emotional condition, helping them stay aware of their mental well-being.

- **AI Bot**:
  - An AI-powered assistant that analyzes assessment responses, diary entries, and other user inputs to offer personalized support and guidance.
  - The bot helps users by providing instant responses to their questions, offering mental wellness tips, and suggesting resources based on their individual needs.

### Therapist Services

- **Book Therapy Sessions**:
  - Users can schedule therapy sessions with certified mental health professionals (paid service).
  - Access professional support in a secure, private setting.

### Support Groups

- **Join Anonymous Groups**:
  - Users can join anonymous chat groups and communicate with others facing similar mental health challenges.
  - Built using Node.js, Socket.IO, and MongoDB, these real-time group chats foster community and mutual support.

### Dashboard and Notifications

- **User Dashboard**:
  - A visually rich, user-friendly dashboard displaying comprehensive statistics about the user's mental health, progress, and emotions over time.
  - Real-time updates to track user improvement and engagement with assessments and sessions.

- **Notifications**:
  - Users receive notifications to stay motivated, remind them about assessments, and keep them informed about their progress.

### SOS Page

- **Emergency Support**:
  - An SOS page that provides resources and immediate support for users in urgent need of help.

---

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Django, Django REST Framework, Django REST Framework Simple JWT, Node.js
- **Database**: PostgreSQL, MongoDB
- **ML/GenAI**: Langchain, HuggingFace, Groq


## Video Walkthrough

For a visual guide to using Serenity, check out the video walkthrough in our Google Drive folder:

[Serenity Walkthrough Video](https://drive.google.com/drive/folders/1STPNVq4laALlCuMeDSrOCZU8tQkJk39M?usp=drive_link)
