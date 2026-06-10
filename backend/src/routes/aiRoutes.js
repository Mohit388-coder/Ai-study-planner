const express = require("express");
const Groq = require("groq-sdk");
const { PrismaClient } = require("@prisma/client");
const { protect } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Groq with your API Key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to get AI response from Groq
async function getGroqResponse(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI study assistant. Provide clear, structured, and actionable study advice.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant", // You can also use "llama3-70b-8192" for higher quality
    temperature: 0.7,
  });
  return chatCompletion.choices[0].message.content;
}

// @desc    Generate a study plan using AI
router.post("/generate-plan", protect, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    const text = await getGroqResponse(prompt);

    await prisma.aIHistory.create({
      data: {
        type: "PLAN_GENERATION",
        input: prompt,
        output: text,
        userId: req.user.id,
      },
    });

    res.json({ generatedPlan: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: "Error generating plan with Groq" });
  }
});

// @desc    Suggest tasks for a study plan
router.post("/suggest-tasks", protect, async (req, res) => {
  const { planId, prompt } = req.body;
  if (!planId || !prompt)
    return res.status(400).json({ message: "Plan ID and prompt are required" });

  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: planId, userId: req.user.id },
    });

    if (!studyPlan) return res.status(404).json({ message: "Plan not found" });

    const fullPrompt = `Based on the study plan "${studyPlan.title}" with goal "${studyPlan.goal}", suggest 5 detailed study tasks. Context: ${prompt}`;
    const text = await getGroqResponse(fullPrompt);

    await prisma.aIHistory.create({
      data: {
        type: "TASK_SUGGESTION",
        input: { planId, prompt },
        output: text,
        userId: req.user.id,
      },
    });

    res.json({ suggestedTasks: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: "Error suggesting tasks" });
  }
});

// @desc    Optimize a study plan
router.post("/optimize-plan", protect, async (req, res) => {
  const { planId, prompt } = req.body;
  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: planId, userId: req.user.id },
      include: { tasks: true },
    });

    const tasksList = studyPlan.tasks.map((t) => t.title).join(", ");
    const fullPrompt = `Optimize this study plan: "${studyPlan.title}". Goal: "${studyPlan.goal}". Current tasks: ${tasksList}. Context: ${prompt}`;

    const text = await getGroqResponse(fullPrompt);

    await prisma.aIHistory.create({
      data: {
        type: "PLAN_OPTIMIZATION",
        input: { planId, prompt },
        output: text,
        userId: req.user.id,
      },
    });

    res.json({ optimizedPlan: text });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: "Error optimizing plan" });
  }
});

module.exports = router;
