# Study Plan Backend API

This is a Node.js Express backend using Prisma ORM with a PostgreSQL database. It includes authentication, full CRUD operations for study management, and an AI integration layer using Google Gemini.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing.
- **Prisma ORM**: Type-safe database access and migrations.
- **AI Integration**: Integration with Google Gemini for plan generation, task suggestions, and plan optimization.
- **Security**: Helmet for HTTP headers, CORS, and Express Rate Limit for brute-force protection.
- **CRUD APIs**: Complete endpoints for Users, Subjects, Study Plans, Study Tasks, and AI History.

## Project Structure

```
src/
├── index.js          # Entry point and app configuration
├── middleware/       # Custom middleware (auth, etc.)
├── routes/           # API route definitions
└── utils/            # Utility functions (JWT, bcrypt)
prisma/
└── schema.prisma     # Prisma database schema
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   JWT_SECRET="your_jwt_secret"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Authenticate user and get token

### Subjects
- `GET /api/subjects`: Get all subjects for the user
- `POST /api/subjects`: Create a new subject
- `GET /api/subjects/:id`: Get a single subject
- `PUT /api/subjects/:id`: Update a subject
- `DELETE /api/subjects/:id`: Delete a subject

### Study Plans
- `GET /api/studyplans`: Get all study plans
- `POST /api/studyplans`: Create a new study plan
- `GET /api/studyplans/:id`: Get a single study plan
- `PUT /api/studyplans/:id`: Update a study plan
- `DELETE /api/studyplans/:id`: Delete a study plan

### Study Tasks
- `GET /api/studyplans/:planId/tasks`: Get all tasks for a plan
- `POST /api/studyplans/:planId/tasks`: Create a task for a plan
- `GET /api/tasks/:id`: Get a single task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

### AI Integration
- `POST /api/ai/generate-plan`: Generate a plan using AI
- `POST /api/ai/suggest-tasks`: Get task suggestions for a plan
- `POST /api/ai/optimize-plan`: Optimize an existing plan

### AI History
- `GET /api/aihistory`: Get all AI interaction history
