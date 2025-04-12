# Serenity: Mental Health Self-Assessment Platform

Serenity is a comprehensive mental wellness platform that enables users to self-assess their mental health, interact with a supportive community, and access professional therapy services. The backend is built using Django with a modular structure consisting of separate apps for Users, Assessments, Doctor (Therapist) services, and Forums. JWT authentication (via Django REST Framework Simple JWT with token blacklisting) secures the API endpoints.

## Features
- **User Management & Profiles**: Users can register, log in, and manage their profiles. The profiles include personal details, a diary for self-reflection, and a goal planner. Additional attributes like role and streak are maintained within the user profile.
- **Assessments**: AI-powered mental health assessments with questions, responses, and detailed scoring that help provide insights into a user's mental state.
- **Therapist Services**: Users can book therapy sessions with certified professionals (a paid service).
- **Community Forum**: A space for users to post, comment, and engage in discussions as well as share blog posts.
- **Notifications**: Users receive notifications to keep them motivated and informed about their progress.

## Tech Stack
- **Frontend**: Next.js,Tailwind CSS
- **Backend**: Django, Django REST Framework, Django REST Framework Simple JWT
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
