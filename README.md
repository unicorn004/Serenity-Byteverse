# Serenity: Mental Health Self-Assessment Platform

Serenity is a comprehensive mental wellness platform that helps users assess their mental health, connect with a supportive community, and access professional therapy services. This platform is built with a modular backend using Django, with separate apps for users, assessments, doctor (therapist) services, and forums. The platform uses JWT authentication (via Django REST Framework Simple JWT with token blacklisting) to secure API endpoints.

## Features

- **User Management & Profiles**: 
  - Users can register, log in, and manage their profiles.
  - Profiles include personal details, a diary for self-reflection, and a goal planner.
  - Additional attributes like role, streak, and progress are maintained within the user profile.
  
- **Assessments**: 
  - AI-powered mental health assessments with dynamic questions, responses, and detailed scoring.
  - These assessments provide insights into a user's mental state and are gamified to encourage engagement.

- **Therapist Services**: 
  - Users can book therapy sessions with certified professionals (a paid service).
  
- **Support Groups**:
  - Anonymous group chats where users can join groups and communicate with others facing similar challenges. 
  - Built using Node.js, Socket.IO, and MongoDB for real-time communication.

- **Notifications**: 
  - Users receive notifications to keep them motivated and informed about their progress.

- **Emotion Detection**: 
  - A system that detects users' emotions and provides valuable insights into their current mood.

- **AI Bot**: 
  - An AI-powered bot that analyzes users' assessment answers, diary entries, and profile information to provide support, guidance, and responses to all types of user queries.

- **Dashboard**: 
  - A visually rich dashboard displaying comprehensive statistics about the user’s mental health and progress.

- **SOS Page**: 
  - An emergency page offering resources and immediate assistance for users in need of urgent support.

---

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Django, Django REST Framework, Django REST Framework Simple JWT, Node.js
- **Database**: PostgreSQL, MongoDB
- **Authentication**: JWT-based authentication

---

## Installation

To set up and run the Serenity project locally, follow the steps below:

### Prerequisites

- Python 3.8 or above
- Node.js (for frontend)
- PostgreSQL
- MongoDB

## Video Walkthrough

For a visual guide to using Serenity, check out the video walkthrough in our Google Drive folder:

[Serenity Walkthrough Video](https://drive.google.com/drive/folders/1STPNVq4laALlCuMeDSrOCZU8tQkJk39M?usp=drive_link)
