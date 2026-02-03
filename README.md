# 🧠 QuantumQuiz - Online Quiz Platform

> **A Next-Gen AI-Powered Learning Assessment Platform**

QuantumQuiz is a modern, high-performance web application designed to revolutionize online assessments. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), it features a "Quantum Obsidian" aesthetic, AI-driven quiz generation via Google Gemini, and a robust gamification system to engage students.

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blueviolet?style=flat-square)

## ✨ Key Features

### 🎭 Role-Based Access Control
- **👨‍🎓 Student**: Take quizzes, track progress (XP, streaks, badges), view leaderboards.
- **👩‍🏫 Teacher**: Create manual quizzes, view class analytics, manage students.
- **🛡️ Admin**: System-wide oversight, user management, advanced analytics.

### 🤖 AI-Powered Quiz Generation
- Integrated **Google Gemini Flash** API (`gemini-flash-latest`) to automatically generate quizzes based on ANY topic and difficulty level.
- Smart parsing ensures consistent JSON output for seamless frontend integration.

### 🎮 Gamification System
- **XP & Leveling**: Earn "Quantum Energy" (XP) for every correct answer.
- **Badges**: Unlockable achievements like "Speedster", "Obsidian Scholar", and "Streak Master".
- **Leaderboards**: Global "Hall of Fame" to foster healthy competition.
- **Streaks**: Daily engagement tracking.

### 🎨 Premium UI/UX ("Quantum Obsidian")
- **Dark Mode First**: Sleek "Midnight Indigo" and "Deep Obsidian" color palette.
- **Glassmorphism**: Modern translucent cards with subtle glows.
- **Interactive**: Smooth animations powered by **Framer Motion**.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.

### 📊 Academic Tools
- **Performance Analytics**: Visual charts (Recharts) for student progress.
- **PDF Reports**: Export detailed result certificates using `jspdf`.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid) with "Quantum Obsidian" Design System.
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **HTTP Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **AI Engine**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/quantum-quiz-mern.git
cd quantum-quiz-mern
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
