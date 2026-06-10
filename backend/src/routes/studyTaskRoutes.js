const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Create a new study task for a specific study plan
// @route   POST /api/studyplans/:planId/tasks
// @access  Private
router.post('/:planId/tasks', protect, async (req, res) => {
  const { planId } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: planId, userId: req.user.id },
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study Plan not found or not authorized' });
    }

    const studyTask = await prisma.studyTask.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 1,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        planId,
      },
    });
    res.status(201).json(studyTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all study tasks for a specific study plan
// @route   GET /api/studyplans/:planId/tasks
// @access  Private
router.get('/:planId/tasks', protect, async (req, res) => {
  const { planId } = req.params;

  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: planId, userId: req.user.id },
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study Plan not found or not authorized' });
    }

    const studyTasks = await prisma.studyTask.findMany({
      where: { planId },
    });
    res.json(studyTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a single study task by ID
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const studyTask = await prisma.studyTask.findUnique({
      where: { id: req.params.id },
      include: { plan: { select: { userId: true } } },
    });

    if (studyTask && studyTask.plan.userId === req.user.id) {
      res.json(studyTask);
    } else {
      res.status(404).json({ message: 'Study Task not found or not authorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a study task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const existingTask = await prisma.studyTask.findUnique({
      where: { id: req.params.id },
      include: { plan: { select: { userId: true } } },
    });

    if (!existingTask || existingTask.plan.userId !== req.user.id) {
      return res.status(404).json({ message: 'Study Task not found or not authorized' });
    }

    const studyTask = await prisma.studyTask.update({
      where: { id: req.params.id },
      data: {
        title: title || undefined,
        description: description || undefined,
        status: status || undefined,
        priority: priority || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.json(studyTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a study task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const existingTask = await prisma.studyTask.findUnique({
      where: { id: req.params.id },
      include: { plan: { select: { userId: true } } },
    });

    if (!existingTask || existingTask.plan.userId !== req.user.id) {
      return res.status(404).json({ message: 'Study Task not found or not authorized' });
    }

    await prisma.studyTask.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Study Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
