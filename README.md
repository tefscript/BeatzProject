# Beatz 

Beatz is a web music streaming application inspired by Spotify. This project is being developed as an academic work by **Stéfani Cruz** and **Rebeca Lara**.

---

## Project Objective

Beatz aims to provide a smooth and intuitive experience for users who want to listen to music online, create playlists, and explore new tracks.

---

## Tech Stack

### Frontend
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)  
[![React Router DOM](https://img.shields.io/badge/ReactRouterDOM-7.5.1-CA4245?logo=react-router)](https://reactrouter.com/)  
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)  
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.6-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)  
[![PostCSS](https://img.shields.io/badge/PostCSS-8.5.3-DD3A0A?logo=postcss)](https://postcss.org/)  
[![Autoprefixer](https://img.shields.io/badge/Autoprefixer-10.4.21-ff69b4?logo=autoprefixer)](https://github.com/postcss/autoprefixer)

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express.js-4.21.2-000000?logo=express)](https://expressjs.com/)  
[![JWT](https://img.shields.io/badge/JWT-9.0.2-blue?logo=jsonwebtokens)](https://jwt.io/)  
[![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0.2-orange)](https://www.npmjs.com/package/bcryptjs)  
[![CORS](https://img.shields.io/badge/cors-2.8.5-yellow)](https://www.npmjs.com/package/cors)  
[![Body Parser](https://img.shields.io/badge/body--parser-1.20.3-lightgrey)](https://www.npmjs.com/package/body-parser)  
[![Express Validator](https://img.shields.io/badge/express--validator-7.2.1-green)](https://express-validator.github.io/docs/)

### Database & Cloud
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational-blue?logo=postgresql)](https://www.postgresql.org/)  
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?logo=supabase)](https://supabase.com/)  
[![Supabase JS](https://img.shields.io/badge/SupabaseJS-2.49.4-3ECF8E)](https://supabase.com/docs/reference/javascript)

### Dev Tools & Testing
[![ESLint](https://img.shields.io/badge/ESLint-9.21.0-purple?logo=eslint)](https://eslint.org/)  
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?logo=jest)](https://jestjs.io/)  
[![Supertest](https://img.shields.io/badge/Supertest-7.1.1-6E6E6E)](https://www.npmjs.com/package/supertest)  
[![Nodemon](https://img.shields.io/badge/Nodemon-3.1.9-76D04B)](https://nodemon.io/)  
[![Babel](https://img.shields.io/badge/Babel-7.24.0-F9DC3E?logo=babel)](https://babeljs.io/)

### API Documentation
[![Swagger JSDoc](https://img.shields.io/badge/Swagger--JSDoc-6.2.8-brightgreen?logo=swagger)](https://www.npmjs.com/package/swagger-jsdoc)  
[![Swagger UI Express](https://img.shields.io/badge/Swagger--UI--Express-5.0.1-brightgreen?logo=swagger)](https://www.npmjs.com/package/swagger-ui-express)

### HTTP Client
[![Axios](https://img.shields.io/badge/Axios-1.8.4-5A29E4?logo=axios)](https://axios-http.com/)

### UI/UX
[![React Icons](https://img.shields.io/badge/React--Icons-5.5.0-blue)](https://react-icons.github.io/react-icons/)  
[![React Modal](https://img.shields.io/badge/React--Modal-3.16.3-lightgrey)](https://www.npmjs.com/package/react-modal)

### State Management
[![React Context](https://img.shields.io/badge/ContextAPI-Built--in-61DAFB?logo=react)](https://react.dev/learn/passing-data-deeply-with-context)  
[![Local Storage](https://img.shields.io/badge/Local%20Storage-Client--side-yellow)](#)

---

## Project Architecture

### Frontend
- Component-based structure with reusable components  
- Context API for global state (User, Player)  
- Custom hooks and utility functions  
- Responsive design with Tailwind  
- Route-based code splitting

### Backend
- MVC pattern (Controllers, Routes, Middleware)  
- RESTful API  
- JWT-based authentication  
- Centralized error handling  
- Input validation with `express-validator`  
- Supabase for database abstraction

---

## Key Features

- Secure JWT authentication  
- Music streaming with continuous playback  
- Playlist creation and management  
- Artist and song discovery  
- Responsive UI  
- Real-time player with context  
- Album cover caching system  
- Social login support

---

## Testing Strategy

- Unit tests for controllers with Jest  
- Mocking database operations  
- HTTP endpoint tests via Supertest  
- Code coverage reports

---

## Getting Started

### Prerequisites
- Node.js 18+  
- npm or yarn  
- Supabase account  
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BeatzProject
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # No Windows, use: copy .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Configure your environment variables
   npm run dev
   ```

---

## Environment Variables

**Backend (.env)**

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Frontend (.env)**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Available Scripts

### Backend

- `npm run dev` — Start development server with Nodemon  
- `npm start` — Start production server  
- `npm test` — Run tests  
- `npm run test:watch` — Watch mode  
- `npm run test:coverage` — Test with coverage

### Frontend

- `npm run dev` — Development server  
- `npm run build` — Build for production  
- `npm run preview` — Preview production build  
- `npm run lint` — Run ESLint

---

## API Documentation

When the backend server is running, access:

```
http://localhost:5000/api-docs
```

---

## Contributing

1. Fork the repository  
2. Create a new branch: `git checkout -b feature/your-feature`  
3. Commit your changes  
4. Push to your fork  
5. Open a Pull Request 

---

## Authors

Made with ❤️ by:

- **Stéfani Cruz** — [@tefscript](https://github.com/tefscript)  
- **Rebeca Lara** — [@rebecalara](https://github.com/rebecalara)

---

> This project is developed as academic work.
