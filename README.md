# 🧠 QuizMaster - Online Quiz Platform

> **A High-Performance AI-Powered Learning Assessment Platform**

QuizMaster is a modern, high-performance web application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a premium, responsive design, AI-driven quiz generation via Google Gemini, and a robust gamification system.

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square)

## ✨ Key Features

### 🎭 Role-Based Access Control
- **👨‍🎓 Student**: Take quizzes, track progress (XP, streaks, badges), view leaderboards, and manage their personal **User Profile**.
- **👩‍🏫 Teacher**: Create manual or AI-generated quizzes, view class analytics, and manage students.
- **🛡️ Admin**: Complete system oversight, user management, and advanced administrative dashboards.

### 🔐 Advanced Authentication
- **Flexible Login**: Support for both Email and Username/ID login.
- **Case-Insensitive Support**: Robust matching for emails and usernames to prevent common login failures.
- **Secure Password Recovery**: Integrated OTP-based "Forgot Password" system using automated SMTP email delivery.

### 🤖 AI-Powered Quiz Generation
- Integrated **Google Gemini Flash** API (`gemini-flash-latest`) to automatically generate quizzes based on ANY topic and difficulty level.
- Smart parsing ensures consistent JSON output for seamless frontend integration.

### 🎮 Gamification System
- **XP & Leveling**: Earn XP for every correct answer and level up your profile.
- **Badges**: Unlockable achievements like "Speedster", "Scholar", and "Streak Master".
- **Leaderboards**: Global "Hall of Fame" to foster healthy competition.

### 🎨 Premium UI/UX
- **Modern Layouts**: Compact and balanced designs for Login and Signup pages.
- **Navigation Flow**: Seamless "Back to Home" options from authentication screens and a personalized Navbar dropdown.
- **Interactive**: Smooth animations powered by **Framer Motion** and high-quality icons from **Lucide React**.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with a customized modern Design System.
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios/Fetch

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Emailing**: Nodemailer (SMTP with Gmail Support)
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
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

# Email Config (Example for Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```
> **Note**: For `EMAIL_PASS`, you MUST generate a 16-character **App Password** from your Google Account Security settings.

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
