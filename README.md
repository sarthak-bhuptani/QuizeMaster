# 🧠 QuizMaster - Online Quiz Platform

> **A High-Performance AI-Powered Learning Assessment Platform**

QuizMaster is a modern, high-performance web application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a premium, responsive design, AI-driven quiz generation via Google Gemini, and a robust gamification system.

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square)

## ✨ Key Features

### 🎭 Role-Based Access Control
- **👨‍🎓 Student**: Take quizzes, track progress (XP, streaks, badges), view leaderboards, and manage personal profile.
- **👩‍🏫 Teacher**: Create manual or AI-generated quizzes, view class analytics, and manage students.
- **🛡️ Admin**: Full system oversight, user management, and advanced dashboards.

### 🔐 Advanced Authentication
- Flexible login supporting Email and Username/ID.
- Case‑insensitive matching for emails and usernames.
- Secure OTP‑based "Forgot Password" via automated SMTP email.

### 🤖 AI‑Powered Quiz Generation
- Integrated **Google Gemini Flash** API to generate quizzes on any topic and difficulty.
- Consistent JSON output for seamless frontend integration.

### 🎮 Gamification System
- **XP & Leveling**: Earn XP for correct answers and level up.
- **Badges**: Unlock achievements like "Speedster", "Scholar", and "Streak Master".
- **Leaderboards**: Global "Hall of Fame" for healthy competition.

### 🎨 Premium UI/UX
- Modern, compact layouts for authentication pages.
- Smooth animations powered by **Framer Motion** and icons from **Lucide React**.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with a custom Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios / Fetch

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Emailing**: Nodemailer (SMTP with Gmail)
- **AI Engine**: Google Generative AI SDK

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local instance
- Gmail account (for OTP functionality)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/onlinequiz-mern.git
cd onlinequiz-mern
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

# Email Config (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```
> **Note**: Use a 16‑character App Password from Google Account Security settings.

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🧹 Clean‑up Notes
- Removed the generated `frontend/dist` folder (re‑generated on production build).
- Deleted unused image assets (`auth-bg.png`, `auth-bg-photo.png`, hero images, analytics/dashboard visuals, etc.).
- Removed obsolete scripts `update_urls.js` and `verify_db.js`.
- The codebase now contains only the assets required for development and production builds.

## 📄 License
This project is open‑source and available under the [ISC License](LICENSE).
