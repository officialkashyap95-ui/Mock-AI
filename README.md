# Mock-AI — AI-Powered Mock Interview Platform

> **Practice smarter. Interview better. Get real-time feedback.**

Mock-AI is an AI-powered mock interview platform designed to simulate realistic technical and HR interviews. It generates role-specific questions, conducts interviews through an interactive interview environment, captures spoken responses, and provides structured performance feedback.

The platform is built to help students and developers practice interviews in a realistic environment while tracking their interview history and performance over time.

---

## ✨ Features

### 🤖 AI-Powered Interview Generation

* Generates interview questions dynamically using the Gemini API.
* Supports different interview roles and difficulty levels.
* Supports technical and HR interview modes.
* Configurable interview duration and question count.

### 🎙️ Voice-Based Interview

* Real-time voice interaction during interviews.
* Speech transcription using Deepgram.
* Captures and stores candidate responses.
* Socket.IO-based real-time communication.

### 🧑‍💻 Technical Interview Practice

Question banks are available for technologies including:

* Java
* Python
* C++
* JavaScript
* React
* Angular
* Vue.js
* Node.js
* Express.js
* Spring Boot
* Django
* Flask
* MongoDB
* MySQL
* PostgreSQL
* Docker
* Kubernetes
* AWS
* TensorFlow
* PyTorch
* Next.js

### 📊 Interview Results & Evaluation

* Interview performance tracking.
* Score visualization.
* Structured result summaries.
* Review of previous interview attempts.
* Performance-oriented feedback.

### 📚 Interview History

* Stores completed interviews.
* Allows users to review previous attempts.
* Tracks interview performance over time.

### 🔐 Authentication

* User registration and login.
* Protected interview and dashboard routes.
* Token-based authentication between frontend and backend.

### 🎥 Interview Environment

* Camera and microphone permission checks.
* Live camera feed.
* Interview timer.
* Question progress tracking.
* Real-time transcript display.
* Exit-interview confirmation.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       React UI       │
                         │      Vite Client     │
                         └──────────┬───────────┘
                                    │
                       REST API     │
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │       Backend        │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └────────────┐
                    ▼                                 ▼
           ┌─────────────────┐               ┌─────────────────┐
           │    MongoDB      │               │  Gemini API     │
           │ Users/Interviews│               │ AI Questions &  │
           │    /Results     │               │   Evaluation    │
           └─────────────────┘               └─────────────────┘
                                  
                                 │
                                 ▼
                         ┌──────────────────────┐
                         │     Deepgram API     │
                         │ Speech Transcription │
                         └──────────────────────┘
                                  
                                 │
                                 ▼
                         ┌──────────────────────┐
                         │      Socket.IO       │
                         │ Real-time interview  │
                         │     communication    │
                         └──────────────────────┘
```

---

## 🧩 Tech Stack

### Frontend

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React        | User interface                  |
| Vite         | Frontend development/build tool |
| React Router | Client-side routing             |
| Axios        | API communication               |
| Lucide React | UI icons                        |
| Recharts     | Data visualization              |

### Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | JavaScript runtime      |
| Express.js | REST API server         |
| MongoDB    | Database                |
| Mongoose   | MongoDB object modeling |
| Socket.IO  | Real-time communication |
| JWT        | Authentication          |

### AI & Voice

| Technology        | Purpose                                       |
| ----------------- | --------------------------------------------- |
| Google Gemini API | AI-powered question generation and evaluation |
| Deepgram          | Speech-to-text transcription                  |

---

## 📁 Project Structure

```text
ai-mock-interview/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── api/
│       │   └── axios.js
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── common/
│       │   │   └── Button.jsx
│       │   │
│       │   ├── dashboard/
│       │   │   ├── InterviewForm.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── RecentInterviews.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── StatsCard.jsx
│       │   │
│       │   ├── interview/
│       │   │   ├── CameraFeed.jsx
│       │   │   ├── ExitInterviewModal.jsx
│       │   │   ├── PermissionCard.jsx
│       │   │   ├── ProgressBar.jsx
│       │   │   ├── QuestionCard.jsx
│       │   │   ├── Timer.jsx
│       │   │   └── Transcript.jsx
│       │   │
│       │   └── result/
│       │       ├── ResultCard.jsx
│       │       └── ScoreChart.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── InterviewContext.jsx
│       │
│       ├── hooks/
│       │   ├── useCamera.js
│       │   ├── useDeepgram.js
│       │   ├── useMicrophone.js
│       │   ├── usePreventBack.js
│       │   ├── usePreventExit.js
│       │   ├── useSpeechRecognition.js
│       │   └── useTimer.js
│       │
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       │
│       ├── pages/
│       │   ├── Analytics.jsx
│       │   ├── Dashboard.jsx
│       │   ├── DeviceCheck.jsx
│       │   ├── History.jsx
│       │   ├── Home.jsx
│       │   ├── Interview.jsx
│       │   ├── LiveInterview.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Result.jsx
│       │
│       ├── services/
│       │   ├── geminiService.js
│       │   └── socket.js
│       │
│       └── utils/
│           ├── calculateScore.js
│           └── formatTime.js
│
├── server/
│   ├── controllers/
│   │   └── interviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Interview.js
│   │   └── User.js
│   │
│   ├── questionBank/
│   │   └── *.json
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── evaluationRoutes.js
│   │   ├── geminiTestRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── services/
│   │   ├── evaluationService.js
│   │   ├── geminiService.js
│   │   └── questionService.js
│   │
│   ├── sockets/
│   │   └── deepgramSocket.js
│   │
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 🔄 Interview Workflow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Dashboard
 │
 ▼
Configure Interview
 │
 ├── Role
 ├── Difficulty
 ├── Interview Type
 ├── Duration
 └── Question Count
 │
 ▼
Device Check
 │
 ├── Camera
 └── Microphone
 │
 ▼
Live Interview
 │
 ├── AI Questions
 ├── Voice Response
 ├── Speech Transcription
 ├── Timer
 └── Progress Tracking
 │
 ▼
Interview Completed
 │
 ▼
AI Evaluation
 │
 ▼
Result
 │
 ├── Score
 ├── Performance
 └── Feedback
 │
 ▼
Interview History
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB
* Git

You will also need API credentials for:

* Google Gemini
* Deepgram

---

### 1. Clone the Repository

```bash
git clone https://github.com/officialkashyap95-ui/Mock-AI.git
cd Mock-AI
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create:

```text
server/.env
```

**Never commit this file to Git.**

Example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

Use `.env.example` when sharing the required environment-variable structure publicly.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd server
npm start
```

The backend will run on:

```text
http://localhost:8000
```

### Start the Frontend

In another terminal:

```bash
cd client
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

---

## 🧪 Development

### Frontend Build

```bash
cd client
npm run build
```

### Lint

```bash
cd client
npm run lint
```

---

## 🔌 API Overview

The backend exposes APIs for major application operations including:

```text
/api/auth
/api/interviews
/api/evaluation
/api/gemini
```

The application uses Axios on the frontend to communicate with the Express backend.

Real-time voice transcription and interview communication use Socket.IO.

---

## 🗄️ Data Models

### User

Stores user authentication and account information.

### Interview

Stores interview configuration and session information, including:

* Interview type
* Role
* Difficulty
* Questions
* Candidate responses
* Transcript
* Interview status
* Performance information
* Evaluation results

---

## 🎯 Why Mock-AI?

Traditional interview preparation often relies on static question lists and self-practice.

Mock-AI aims to provide a more realistic practice environment by combining:

* **AI-generated questions**
* **Voice-based responses**
* **Speech transcription**
* **Timed interviews**
* **Performance evaluation**
* **Interview history**

This creates a practice workflow closer to an actual interview rather than simply reading interview questions.

---

## 🛣️ Future Roadmap

Planned improvements include:

* [ ] More advanced AI interview evaluation
* [ ] Detailed communication analysis
* [ ] Personalized interview recommendations
* [ ] Advanced performance analytics
* [ ] Interview difficulty adaptation
* [ ] More technical question banks
* [ ] Resume-based interview generation
* [ ] Improved AI follow-up questions
* [ ] Interview performance trends
* [ ] Production deployment

---

## 🔒 Security

Sensitive credentials should always be stored in environment variables.

The following files should **never** be committed:

```text
.env
.env.*
```

API keys and authentication secrets must not be exposed in the frontend or Git repository.

---

## 📌 Project Status

**Status:** Active Development 🚧

Mock-AI is currently being developed as a full-stack AI interview practice platform with AI question generation, voice transcription, interview tracking, and performance evaluation.

---

## 👨‍💻 Author

**Piyush Kashyap**

BCA Student | Full Stack Developer

* GitHub: https://github.com/officialkashyap95-ui
* LinkedIn: https://www.linkedin.com/in/piyush-kashyap17/

---

## ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

If you find the project useful:

```text
⭐ Star the repository
```

and feel free to open an issue or pull request.

---

## 📄 License

This project is currently intended for educational and development purposes.
