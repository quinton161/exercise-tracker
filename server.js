require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// In-memory storage
const users = [];
const exercises = [];

// Helper functions
const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.json({
            username: existingUser.username,
            _id: existingUser._id
        });
    }

    // Create new user
    const newUser = {
        username,
        _id: generateId()
    };

    users.push(newUser);

    return res.json({
        username: newUser.username,
        _id: newUser._id
    });
});

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
    res.json(users.map(user => ({
        username: user.username,
        _id: user._id
    })));
});

// POST /api/users/:_id/exercises - Add an exercise to a user
app.post('/api/users/:_id/exercises', (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req.params._id;

    if (!description || !duration) {
        return res.status(400).json({ error: 'Description and duration are required' });
    }

    const user = users.find(user => user._id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Parse duration as integer
    const durationNum = parseInt(duration);
    if (isNaN(durationNum)) {
        return res.status(400).json({ error: 'Duration must be a number' });
    }

    // Create exercise object
    const exercise = {
        _id: generateId(),
        userId: userId,
        description: description,
        duration: durationNum,
        date: date ? new Date(date) : new Date()
    };

    exercises.push(exercise);

    // Format response to match expected output
    return res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
    });
});

// GET /api/users/:_id/logs - Get exercise log for a user
app.get('/api/users/:_id/logs', (req, res) => {
    const { from, to, limit } = req.query;
    const userId = req.params._id;

    const user = users.find(user => user._id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Get exercises for this user
    let userExercises = exercises.filter(ex => ex.userId === userId);

    // Filter by date if provided
    if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate.getTime())) {
            userExercises = userExercises.filter(ex => ex.date >= fromDate);
        }
    }

    if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate.getTime())) {
            userExercises = userExercises.filter(ex => ex.date <= toDate);
        }
    }

    // Sort exercises by date
    userExercises.sort((a, b) => a.date - b.date);

    // Apply limit if provided
    if (limit) {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum)) {
            userExercises = userExercises.slice(0, limitNum);
        }
    }

    // Format exercises for response
    const formattedExercises = userExercises.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
    }));

    // Return user object with count and log array
    const response = {
        _id: user._id,
        username: user.username,
        count: formattedExercises.length,
        log: formattedExercises
    };

    return res.json(response);
});

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 