Message = require('../models/Message');
Chat = require('../models/Chat');

exports.createChat = (req, res) => {
    Chat.find({
        $or:[
            {
                first_member: req.body.user_id
            },
            {
                second_member: req.body.user_id
            }
        ]
    }).then(data => {
        if(!data.length) {
            const chat = new Chat({
                first_member: req.body.user_id,
                second_member: req.body.reciever_id
            });
            chat.save().then(data => {
                res.send("Chat is successfully created");
            })
        }
    })
}