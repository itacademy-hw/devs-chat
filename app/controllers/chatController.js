Message = require('../models/Message');
Chat = require('../models/Chat');

exports.createChat = (req, res) => {
    Chat.find({
        $or: [
            {
                $and: [
                    { first_member: req.body.first_member },
                    { second_member: req.body.second_member },
                ]
            },
            {
                $and: [
                    { first_member: req.body.second_member },
                    { second_member: req.body.first_member },
                ]
            }
        ]
    }).then(data => {
        if(!data.length) {
            const chat = new Chat({
                first_member: req.body.first_member,
                second_member: req.body.second_member
            });
            chat.save().then(data => {
                res.send("Chat is successfully created");
            })
        } else {
            res.send("Chat is already exist");
        }
    });
};
