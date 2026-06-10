const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');


dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 minutes per IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Basic route
app.get('/', (req, res) => {
  res.send('Study Plan Backend API is running!');
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/studyplans", require("./routes/studyPlanRoutes"));
app.use("/api/tasks", require("./routes/studyTaskRoutes")); // Note: StudyTask routes are nested under studyplans, but also have direct access for update/delete
app.use("/api/aihistory", require("./routes/aiHistoryRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Error handling middleware (will be implemented later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
