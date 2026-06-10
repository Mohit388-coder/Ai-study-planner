const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Create a new AI history entry
// @route   POST /api/aihistory
// @access  Private
router.post('/', protect, async (req, res) => {
  const { type, input, output } = req.body;

  if (!type || !input) {
    return res.status(400).json({ message: 'AI action type and input are required' });
  }

  try {
    const aiHistory = await prisma.aiHistory.create({
      data: {
        type,
        input,
        output,
        userId: req.user.id,
      },
    });
    res.status(201).json(aiHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all AI history entries for a user
// @route   GET /api/aihistory
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const aiHistory = await prisma.aiHistory.findMany({
      where: { userId: req.user.id },
    });
    res.json(aiHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a single AI history entry by ID
// @route   GET /api/aihistory/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const aiHistory = await prisma.aiHistory.findUnique({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (aiHistory) {
      res.json(aiHistory);
    } else {
      res.status(404).json({ message: 'AI History entry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update an AI history entry
// @route   PUT /api/aihistory/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { type, input, output } = req.body;

  try {
    const aiHistory = await prisma.aiHistory.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        type: type || undefined,
        input: input || undefined,
        output: output || undefined,
      },
    });

    if (aiHistory) {
      res.json(aiHistory);
    } else {
      res.status(404).json({ message: 'AI History entry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete an AI history entry
// @route   DELETE /api/aihistory/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const aiHistory = await prisma.aiHistory.delete({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (aiHistory) {
      res.json({ message: 'AI History entry removed' });
    } else {
      res.status(404).json({ message: 'AI History entry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
