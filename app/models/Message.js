const mongoose = require('mongoose');

const MessSchema = mongoose.Schema ({
    user_id: String,
    reciever_id: String,
    text: String,
    chat_id: String
},
{
    timestamps: true
});

module.exports = mongoose.model('Message', MessSchema);