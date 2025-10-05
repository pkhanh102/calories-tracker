# 🥗 Calorie Tracker App

A fullstack web app to help users track their daily calorie and macronutrient intake.  
Users can log food, manage saved foods, and set personalized nutrition goals.

Live demo: https://calories-tracker-brown.vercel.app/
Backend API: https://calories-tracker-be.onrender.com/api

---

## ✅ Features (MVP)

- 🔐 JWT-based Authentication (Register, Login, Logout)
- 📦 Saved Food Management (Create, Edit, Delete)
- 🍽️ Log Daily Food Intake by Meal (Breakfast, Lunch, Dinner, Snack)
- 🎯 Set & Update Nutrition Goals (Calories, Protein, Carbs, Fats)
- 📊 Daily Summary View with Totals vs. Goals
- 📅 View and manage past food logs by date
- 🚫 Route protection for authenticated pages

---

## 💻 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Auth

### Frontend
- React.js
- Context API (Auth State)
- React Router
- Basic Inline Styling (Tailwind planned for future)

---

## 🔧 Development Setup Local

### 1. Backend (`/server`)
- Install dependencies  
  `npm install`

- Create `.env` file (example):
DATABASE_URL=postgres://youruser:yourpass@localhost:5432/calories_tracker_dev
JWT_SECRET=your_jwt_secret
NODE_ENV=development

- Start server  
`npm run dev`

---

### 2. Frontend (`/client`)
- Install dependencies  
`npm install`

- Create `.env` file:
VITE_API_URL=http://localhost:4000/api

- Start dev server  
`npm start` or `npm run dev`

---

## 🛣 Roadmap (Planned MMP)

- 📱 Responsive layout (mobile-friendly)
- 📊 Visual charts (macros, trends)
- 🌐 Food database integration (e.g., public APIs)
- 📝 Notes or tagging for meals
- 🧾 Export or print food logs
- 🧠 AI-based suggestions (future experiment)

---

## 📦 License

MIT — feel free to fork, build, and improve!