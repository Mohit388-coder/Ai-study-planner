const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Create a new study plan
// @route   POST /api/studyplans
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, goal, startDate, endDate, subjectId } = req.body;

  if (!title || !goal) {
    return res.status(400).json({ message: 'Title and goal are required' });
  }

  try {
    const studyPlan = await prisma.studyPlan.create({
      data: {
        title,
        goal,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        userId: req.user.id,
        subjectId,
      },
    });
    res.status(201).json(studyPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all study plans for a user
// @route   GET /api/studyplans
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const studyPlans = await prisma.studyPlan.findMany({
      where: { userId: req.user.id },
      include: { subject: true, tasks: true },
    });
    res.json(studyPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a single study plan by ID
// @route   GET /api/studyplans/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: req.params.id, userId: req.user.id },
      include: { subject: true, tasks: true },
    });

    if (studyPlan) {
      res.json(studyPlan);
    } else {
      res.status(404).json({ message: 'Study Plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a study plan
// @route   PUT /api/studyplans/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, goal, startDate, endDate, subjectId } = req.body;

  try {
    const studyPlan = await prisma.studyPlan.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        title: title || undefined,
        goal: goal || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        subjectId: subjectId || undefined,
      },
    });

    if (studyPlan) {
      res.json(studyPlan);
    } else {
      res.status(404).json({ message: 'Study Plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a study plan
// @route   DELETE /api/studyplans/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const studyPlan = await prisma.studyPlan.delete({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (studyPlan) {
      res.json({ message: 'Study Plan removed' });
    } else {
      res.status(404).json({ message: 'Study Plan not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
