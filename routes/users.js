const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(400).json({ error: 'username is required' });
    }

    const user = new User({ username });
    await user.save();
    res.json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add exercise to user
router.post('/:id/exercises', async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const userId = req.params.id;

    if (!description || !duration) {
      return res.status(400).json({ error: 'description and duration are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercise = new Exercise({
      userId,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date()
    });

    await exercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's exercise log
router.get('/:id/logs', async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = { userId };
    
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const exercises = await Exercise.find(query)
      .limit(parseInt(limit) || 0)
      .sort({ date: 1 });

    const log = exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 