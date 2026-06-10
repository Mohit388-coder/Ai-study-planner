# AI Study Planner

A full-stack application for managing study plans with AI-powered suggestions and optimizations.

## Project Structure

```
study-planner-app/
├── backend/            # Express.js & Prisma Backend
│   ├── src/            # Source code
│   ├── prisma/         # Database schema
│   └── .env            # Environment variables
└── frontend/           # HTML/CSS/JS Frontend
    ├── css/            # Styles
    ├── js/             # API integration
    ├── index.html      # Login/Register
    ├── dashboard.html  # Study Plans list & AI Generator
    ├── subjects.html   # Subject Management
    └── plan-details.html # Plan details & Task Management
```

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env`:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `JWT_SECRET`: A secret key for JWT tokens.
    *   `GEMINI_API_KEY`: Your Google Gemini AI API key.
4.  Initialize the database:
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

1.  The frontend is built with vanilla HTML/CSS/JS.
2.  Open `frontend/index.html` in your web browser.
3.  Ensure the backend is running so the frontend can communicate with the API.
4.  The `frontend/js/api.js` file is already configured to point to `http://localhost:5000/api`.

## Features

*   **User Authentication**: Register and login to manage your own study data.
*   **Subject Management**: Organize your study plans by subjects.
*   **Study Plans**: Create plans with specific goals.
*   **Task Management**: Add, edit, and track tasks within each plan.
*   **AI Generator**: Generate a complete study plan from a simple prompt.
*   **AI Task Suggester**: Get AI-suggested tasks for any existing study plan.
*   **AI Plan Optimizer**: Let AI analyze and optimize your study schedule.
