const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// POST /api/users - Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({
                username: existingUser.username,
                _id: existingUser._id
            });
        }

        // Create new user
        const newUser = new User({ username });
        const savedUser = await newUser.save();

        return res.json({
            username: savedUser.username,
            _id: savedUser._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '_id username');
        // Return array of users with _id and username
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/users/:_id/exercises - Add an exercise to a user
router.post('/users/:_id/exercises', async (req, res) => {
    try {
        const { description, duration, date } = req.body;
        const userId = req.params._id;

        if (!description || !duration) {
            return res.status(400).json({ error: 'Description and duration are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Parse duration as integer
        const durationNum = parseInt(duration);
        if (isNaN(durationNum)) {
            return res.status(400).json({ error: 'Duration must be a number' });
        }

        // Create new exercise
        const newExercise = new Exercise({
            userId: userId,
            description: description,
            duration: durationNum,
            date: date ? new Date(date) : new Date()
        });

        // Save the exercise
        await newExercise.save();

        // Format response to match expected output
        return res.json({
            _id: user._id,
            username: user.username,
            description: newExercise.description,
            duration: newExercise.duration,
            date: newExercise.date.toDateString()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users/:_id/logs - Get exercise log for a user
router.get('/users/:_id/logs', async (req, res) => {
    try {
        const { from, to, limit } = req.query;
        const userId = req.params._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Build query to find exercises for this user
        let query = { userId: userId };

        // Add date filters if provided
        if (from || to) {
            query.date = {};
            if (from) {
                query.date.$gte = new Date(from);
            }
            if (to) {
                query.date.$lte = new Date(to);
            }
        }

        // Get exercises
        let exercises = await Exercise.find(query).sort({ date: 1 });

        // Apply limit if provided
        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                exercises = exercises.slice(0, limitNum);
            }
        }

        // Format exercises for the log
        const formattedExercises = exercises.map(ex => ({
            description: ex.description,
            duration: ex.duration,
            date: ex.date.toDateString()
        }));

        // Return the formatted response
        return res.json({
            _id: user._id,
            username: user.username,
            count: formattedExercises.length,
            log: formattedExercises
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;