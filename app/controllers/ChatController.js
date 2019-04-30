Chat = require('../models/Chat');

exports.showChats = (req, res) => {
    Chat.find({
        $or: [
            {
                first_member: req.userId
            },
            {
                second_member: req.userId
            }
        ]
    }).then(data => res.send(data))
    .catch(err => {
        res.status(400).send({
            message: "Your chat list is empty"
        })
    });
}