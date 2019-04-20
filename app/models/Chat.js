const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema ({
    first_member: String,
    second_member: String
},
{
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);