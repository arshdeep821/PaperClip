# PaperClip

A modern web-based trading platform inspired by Kyle MacDonald's viral story of trading a red paperclip for a house. PaperClip revolutionizes the concept of bartering by providing users with an intuitive, gamified trading experience that eliminates the need for monetary transactions.

## What is PaperClip?

PaperClip transforms traditional bartering into a modern, engaging, and secure trading experience. Users can upload items from their inventory, browse other users' collections, and make trade offers through a sophisticated recommendation system powered by machine learning. The platform encourages continuous trading by gamifying the process with achievements, user reputation systems, and comprehensive item history tracking.

### The Story Behind PaperClip

In 2005, Kyle MacDonald achieved the seemingly impossible: he started with a single red paperclip and traded his way up to a house through a series of 14 trades, each one slightly more valuable than the last. PaperClip brings this concept into the digital age, providing users with the tools, community, and intelligent matching system to embark on their own trading journeys.

### Why PaperClip?

- **No Money Required**: Pure item-for-item trading eliminates financial barriers
- **Community-Driven**: Connect with like-minded traders in your area
- **Intelligent Matching**: AI-powered recommendations help you find your next perfect trade
- **Gamified Experience**: Earn achievements and build reputation through successful trades
- **Secure & Trusted**: Built-in verification systems and user ratings ensure safe trading

## Core Features

- **ML-Powered Recommendations**: KNN-based system that suggests optimal trading opportunities based on user preferences
- **Real-Time Messaging**: WebSocket-powered chat system for instant communication between traders
- **Smart Search**: Find items and users with advanced filtering and geolocation-based matching
- **Trade Management**: Create, accept, reject, and renegotiate trade offers with full lifecycle tracking
- **Gamified Experience**: Achievement system, item history tracking, and user reputation building
- **Location-Based Trading**: Set trading radius and discover local trading opportunities

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Material-UI
- **Backend**: Node.js, Express.js, MongoDB
- **ML Service**: Python, FastAPI, Scikit-learn
- **Real-time**: Socket.io
- **Infrastructure**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
```bash
docker-compose up --build
```

4. Open your browser and go to: http://localhost:5173

### Demo Accounts
- **Admin**: username: `Admin`, password: `password`
- **Exec**: username: `Exec`, password: `password`

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend API
- `recommender/` - Python ML recommendation service
- `docker-compose.yml` - Multi-service orchestration

## Contributing

This project was developed by Team 28 for CPSC 455 at UBC.

Team Members:
- Arshdeep Jaggo
- Gagenvir Gill
- Matthew Fan
- Preston Lai
