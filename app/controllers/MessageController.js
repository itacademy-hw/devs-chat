Message = require('../models/Message');
Chat = require('../models/Chat');

exports.createChat = (req, res) => {
    if(!req.body.text) {
        res.status(400).send({
            message: 'Write something...'
        });
        return;
    }
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
        if(data === null) {
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