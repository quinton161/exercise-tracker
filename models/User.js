const mongoose = require('mongoose');

// We'll use a simpler model structure to ensure the log format meets requirements
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // We won't store exercises as embedded documents anymore
    // Instead, we'll create a separate Exercise model
});

module.exports = mongoose.model('User', UserSchema); 