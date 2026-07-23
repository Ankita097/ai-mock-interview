# AI Mock Interview Platform

An AI-powered mock interview platform built with React, Node.js, Express, MongoDB, and OpenAI/Gemini API integrations.

## Project Structure

```
ai-mock-interview/
├── frontend/       # React + Vite + Tailwind CSS Frontend
├── backend/        # Node.js + Express + MongoDB Backend
└── public/         # Public static assets
```

## Features

- **User Authentication**: JWT-based login & registration
- **Resume Upload & Parsing**: PDF/Word resume processing for custom interview questions
- **AI-Powered Mock Interviews**: Dynamic question generation tailored to role, domain, and experience
- **Interactive Practice Room**: Voice & text answer recording with real-time feedback
- **Analytics & History**: Detailed interview performance analytics, score breakdown, strengths & weaknesses

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your MONGODB_URI and API keys in .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
