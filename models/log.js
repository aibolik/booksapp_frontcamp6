const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    status: Number,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);