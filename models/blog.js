const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    views: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);