# 🎵 Amplitude – A Last.fm Music Dashboard

Amplitude is a full stack music dashboard that connects to your Last.fm account and visualises your listening history in a modern way.

🔗 [Live Site](https://main.d3fs34q4866u1g.amplifyapp.com/)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Disclaimer](#-disclaimer)
- [Credits](#-credits)

---

## ✨ Features

- User registration and login with bcrypt password hashing and JWT token authentication
- Last.fm account connection — link your Last.fm username to your Amplitude account
- Personal music dashboard pulling live scrobble data from the Last.fm API
- Top artists grid using album art
- Top albums grid with cover art and playcount stats
- User profile stats — total scrobbles, artist count, track count and member since year
- Protected routes — dashboard and account pages require authentication
- Session management via sessionStorage with token-based auth

---

## 🖼 Showcase

### 🏠 Home Page

The landing page introduces Amplitude with a retro OS-inspired aesthetic.

### 🔐 Login / Register

Clean authentication forms with JWT token handling and bcrypt password verification.

### 🎛 Last.fm Dashboard

The core feature — a full visualisation of your Last.fm listening data including recent tracks, top artists and top albums.

---

## 🛠 Tech Stack

**Frontend:**

- **React** – Component-based UI with hooks for state and side effects
- **React Router DOM** – Client-side routing with public and private route protection
- **Axios** – HTTP requests to the API Gateway and Last.fm API
- **CSS3** – Custom styling with a retro Windows XP inspired aesthetic

**Backend:**

- **AWS Lambda** – Serverless Node.js functions handling all backend logic
- **AWS API Gateway** – REST API routing requests to Lambda functions
- **AWS DynamoDB** – NoSQL database storing user accounts and subscriptions
- **AWS Amplify** – Frontend hosting with GitHub CI/CD integration
- **AWS S3** – Storage for music artwork images
- **bcryptjs** – Password hashing for secure user registration
- **jsonwebtoken** – JWT token generation and verification for session auth

**External APIs:**

- **Last.fm API** – Scrobble data, user info, top artists, top albums and recent tracks

---

## 📁 Project Structure

```
Amplitude-Music/
│
├── aws-front-end/                  # React frontend hosted on AWS Amplify
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.svg             # Custom waveform favicon
│   ├── src/
│   │   ├── App.js                  # Root component with routing and navbar
│   │   ├── Home.js                 # Landing page
│   │   ├── Login.js                # Login form with JWT session handling
│   │   ├── Register.js             # Registration form
│   │   ├── LoggedIn.js             # Account page with Last.fm connect form
│   │   ├── LoginLastFm.js          # Last.fm username connection component
│   │   ├── LastFmDashboard.js      # Main dashboard — scrobble data visualisation
│   │   ├── css/                    # All component stylesheets
│   │   ├── components/
│   │   │   └── Modal.js            # Reusable modal popup component
│   │   ├── routes/
│   │   │   └── authRoutes.js       # Public and private route protection
│   │   └── service/
│   │       ├── auth.js             # Session storage helpers (get/set/reset)
│   │       └── popup.js            # Subscription success popup component
│
├── react-backend1/                 # Node.js Lambda backend
│   ├── index.js                    # Main Lambda handler — routes all HTTP requests
│   ├── services/
│   │   ├── registration.js         # User registration with bcrypt hashing
│   │   ├── login.js                # User login with token generation
│   │   ├── query.js                # Music search queries against DynamoDB
│   │   ├── subscribe.js            # Add a song subscription for a user
│   │   ├── getSubscription.js      # Fetch all subscriptions for a user
│   │   ├── deleteSubscription.js   # Remove a subscription
│   │   └── lastFmService.js        # Verify and save Last.fm username to DynamoDB
│   └── utils/
│       ├── auth.js                 # JWT token generation and verification
│       └── util.js                 # Response builder utility
│
└── README.md
```

---

## 🏗 Architecture

The system follows a serverless architecture on AWS:

```
React Frontend (Amplify)
        ↓
API Gateway (REST API)
        ↓
Lambda Function (Node.js router)
        ↓
DynamoDB (login + subscription tables)

Last.fm API ← called directly from React frontend
```

- The **React frontend** communicates with **API Gateway** using an API key for all authenticated operations
- **Lambda** acts as a single router function, dispatching requests to the appropriate service based on HTTP method and path
- **DynamoDB** stores two tables — `login` (users) and `subscription` (saved songs)
- The **Last.fm API** is called directly from the frontend to fetch scrobble data, avoiding unnecessary Lambda invocations for read-only public data

---

## ⚠️ Disclaimer

This project is a personal project created for learning purposes. Last.fm data belongs to Last.fm and their respective users. Amplitude is not affiliated with Last.fm — this is a non-commercial project built for educational purposes.

---

## 🌟 Credits

- **Design & Development:** William Wells
