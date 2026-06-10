const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  try {
    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        userId: req.user.id,
      },
    });
    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all subjects for a user
// @route   GET /api/subjects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { userId: req.user.id },
    });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const subject = await prisma.subject.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
    });

    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subject = await prisma.subject.delete({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (subject) {
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
