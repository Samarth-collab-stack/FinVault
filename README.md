# FinVault

### AI-Powered Credit Score Estimation & Financial Health Platform

FinVault is a full-stack web application that estimates a user's credit score and provides personalized, AI-powered recommendations for improving their financial health.

Users can upload bank statements in **PDF/CSV format** or enter their bank details manually. FinVault processes the financial data, extracts relevant transaction information, calculates a score using a rule-based scoring engine, and presents the results through an interactive dashboard.

The platform goes beyond simply displaying a score by explaining **why the score was calculated** and providing actionable recommendations for improvement.

---

## 🚀 Features

### 🔐 Authentication & User Management

* User registration and login
* JWT-based authentication
* Access and refresh token flow
* Password hashing with bcrypt
* Protected routes
* Per-user data isolation

### 📄 Bank Statement Processing

* Upload bank statements in PDF/CSV format
* Manual bank/account detail entry
* Transaction extraction and normalization
* Structured transaction storage
* Multipart file handling with Multer

### 📊 Credit Score Engine

FinVault uses a deterministic, rule-based scoring engine to evaluate financial behavior.

Factors can include:

* Repayment consistency
* Balance trends
* Credit utilization
* Account age
* Overdraft behavior
* Transaction patterns
* Other financial indicators

The scoring engine produces both a score and a breakdown explaining the factors contributing to it.

### 🤖 AI-Powered Insights

The AI layer converts the score breakdown into easy-to-understand financial insights.

It can provide:

* Explanation of the user's score
* Identification of weaker financial factors
* Personalized improvement suggestions
* Actionable financial habits

Only aggregated scoring information is intended to be sent to the AI service rather than raw bank statements.

### 📈 Financial Dashboard

The dashboard provides:

* Credit score gauge
* Score factor breakdown
* Score history/trends
* Financial insights
* Improvement recommendations

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* TanStack Query
* Tailwind CSS
* Recharts / Chart.js
* React Hook Form
* Zod
* react-dropzone

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcrypt
* Multer
* pdf-parse
* csv-parse / PapaParse
* Zod / express-validator

### AI

* LLM API integration
* Server-side AI insight generation

## The planned architecture uses React/Vite on the frontend and Node.js/Express with MongoDB Atlas on the backend.

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      FinVault       │
                    │      Frontend       │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐   ┌──────────────┐  ┌─────────────┐
        │ MongoDB   │   │   Scoring    │  │ AI Insights │
        │   Atlas   │   │    Engine    │  │    Layer    │
        └───────────┘   └──────────────┘  └─────────────┘
              ▲                ▲                ▲
              │                │                │
              └──── Transactions / Score / Insights
```

The frontend communicates with the backend exclusively through the REST API; it does not directly access MongoDB or third-party AI APIs.

---

## 🔄 Application Flow

```text
User
 │
 ▼
Login / Signup
 │
 ▼
Upload Bank Statement
 │
 ▼
PDF / CSV Parsing
 │
 ▼
Transaction Normalization
 │
 ▼
Credit Score Engine
 │
 ▼
Score + Factor Breakdown
 │
 ▼
AI Insight Generation
 │
 ▼
Dashboard
 │
 ├── Credit Score
 ├── Score Factors
 ├── Score History
 └── Improvement Recommendations
```

The intended processing flow is statement upload → transaction extraction → scoring → AI insight generation → dashboard visualization.

---

## 📁 Project Structure

```text
finvault/
│
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── axiosClient.js
│       │   ├── authApi.js
│       │   ├── uploadApi.js
│       │   └── scoreApi.js
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── common/
│       │   ├── upload/
│       │   └── dashboard/
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── UploadStatement.jsx
│       │   ├── Dashboard.jsx
│       │   └── Insights.jsx
│       │
│       ├── hooks/
│       ├── routes/
│       ├── store/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── models/
│       │   ├── User.js
│       │   ├── Statement.js
│       │   ├── Transaction.js
│       │   ├── CreditScore.js
│       │   └── Insight.js
│       │
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       │   ├── parsing/
│       │   ├── scoringEngine.js
│       │   └── aiInsightService.js
│       │
│       ├── middlewares/
│       ├── utils/
│       ├── validators/
│       ├── app.js
│       └── server.js
│
├── docs/
├── .gitignore
└── README.md
```

## This follows the planned separation between the React client and Express server, with dedicated models, controllers, routes, services, and middleware on the backend.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB Atlas account
* Git
* An API key for the selected AI provider

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>

cd finvault
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

### Client

Create:

```text
client/.env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server

Create:

```text
server/.env
```

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

AI_API_KEY=your_ai_api_key

CLIENT_ORIGIN=http://localhost:5173
```

Never commit `.env` files or API keys to GitHub.

The project design specifies separate frontend and backend environment configuration for the API base URL, MongoDB connection, JWT secrets, AI API key, and allowed client origin.

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/auth/signup`  | Create a new account |
| POST   | `/api/auth/login`   | Authenticate user    |
| POST   | `/api/auth/refresh` | Refresh access token |

### Statement Processing

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/api/upload/statement`      | Upload PDF/CSV statement |
| POST   | `/api/upload/manual-details` | Submit bank details      |
| GET    | `/api/upload/:id/status`     | Check processing status  |

### Credit Score

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/api/score/:userId`         | Get latest score  |
| GET    | `/api/score/:userId/history` | Get score history |

### AI Insights

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/insights/:userId` | Get AI-generated insights |

These endpoints correspond to the project's defined API contract.

---

## 🔐 Security

FinVault is designed with security and privacy in mind.

* Passwords are hashed using bcrypt.
* Authentication uses short-lived JWT access tokens.
* Refresh tokens are intended to use secure, HTTP-only cookies.
* Uploaded files are validated before processing.
* User data is isolated at the query level.
* Sensitive account information should be redacted before AI processing.
* Raw bank credentials are never stored.
* Secrets are stored through environment variables.
* Production traffic should use HTTPS.

---

## 📌 Project Status

**Current Status:** 🚧 In Development

FinVault is being developed as a full-stack financial technology project with the following major milestones:

* [x] Project architecture
* [x] Technical design
* [x] Authentication
* [ ] Statement upload
* [ ] Transaction parsing
* [ ] Credit scoring engine
* [ ] AI insights
* [ ] Dashboard
* [ ] Testing
* [ ] Production deployment

---

## 🔮 Future Improvements

Potential future improvements include:

* Background processing for large statement files
* BullMQ + Redis job queues
* Advanced financial analytics
* More scoring factors
* Improved AI recommendations
* Automated score monitoring
* Expanded bank statement compatibility
* API documentation using Swagger/OpenAPI
* Automated testing and CI/CD
* Production-grade file storage

Background processing with BullMQ/Redis is specifically planned as a later optimization if parsing or AI processing becomes a bottleneck.

---

## 🎯 Goal

FinVault aims to make credit health easier to understand by combining:

**Financial Data → Credit Score → Explanation → Action**

Instead of giving users a number and leaving them wondering what it means, FinVault attempts to explain the underlying financial behavior and provide practical steps toward improvement.

---

## 👨‍💻 Author

**Samarth Srivastava**

Built as a full-stack software engineering project.

---

## 📄 License

This project is currently intended for educational and development purposes.
