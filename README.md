# AI-Enhanced Podcast Generator

This project is a prototype web application that converts audio uploads or text transcripts into enhanced, playable podcasts using modern web technologies and AI integration.

## Features
- Upload and process audio files (supports large files via chunking).
- Text-to-Audio conversion using Web Speech API or ElevenLabs API.
- AI-powered text transformation using Google Generative AI (or an alternative).
- Podcast player interface with start, stop, and play controls.
- Server-side audio processing with `fluent-ffmpeg` and `multer`.
- Monorepo structure with a single service using **Next.js** for both frontend and backend.

---

## Tech Stack
- **Frontend**: React, Material UI, Framer Motion, Multer
- **Backend**: Next.js API Routes (serverless)
- **AI**: Google Generative AI API
- **Audio Processing**: Multer, Fluent-FFmpeg
- **Deployment**: AWS Lambda (via Vercel for serverless hosting)
- **File Upload**: Chunked uploads for large audio files

## Flow Chart
‘’’mermaid
flowchart
  A[User] -->|Upload MP3| B[Next.js App]
  B --> |Validate MP3 with Multer| G{Valid MP3?}
  G --> |Yes| C[Gemini API Health Check]
  G --> |No| H[Error Message]
  H --> |Send Error Message| A
  C --> |Healthy| I[Dockerized AWS Lambda]
  C --> |Unhealthy| J[Health Check Failed]
  J --> |Send Error Message| A
  I --> |Lambda Function Runs| D[Process with FFmpeg]
  D --> L[Post FFmpeg Processing Gemini API Health Check]
  L --> |Healthy| M[Gemini API Call]
  L --> |Unhealthy| N[Health Check Failed]
  N --> |Retry| L
  N --> |Error Message| A
  M --> |Send Response| B
  B --> |Unpack Gemini Transcript| A
‘’’

---

## Setup

### Prerequisites
- Node.js (v18 or later)
- AWS account (for Lambda and S3 usage)
- Google Generative AI API credentials
- ElevenLabs API credentials (optional)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>