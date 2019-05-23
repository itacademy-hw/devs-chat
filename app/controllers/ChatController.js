Message = require('../models/Message');
Chat = require('../models/Chat');
User = require('../models/User');

exports.createChat = (req, res) => {
    Chat.find({
        $or: [
            {
                $and: [
                    { first_member: req.userId },
                    { second_member: req.body.second_member },
                ]
            },
            {
                $and: [
                    { first_member: req.body.second_member },
                    { second_member: req.userId },
                ]
            }
        ]
    }).then(data => {
        if(!data.length) {
            const chat = new Chat({
                first_member: req.userId,
                second_member: req.body.second_member
            });
            chat.save().then(data => {
                res.send({
                    message: "Chat is successfully created",
                    id: data.id
                });
            })
        } else {
            res.send({
                message: "Chat is already exist",
                id: data.id
            });
        }
    });
};

exports.removeChat = (req, res) => {
    Chat.findByIdAndDelete(req.params.id).then(data => {
        res.send({
            message: 'Chat was successfully deleted'
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            res.status(404).send({message: 'Chat was not found with provided id'});
            return;
        }
        res.status(500).send({message: err});
    })
}

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
    }).then(async (data) => {
        data = await Promise.all(
            data.map(async (chat) => {
                let companionId = '';
                if(chat.first_member === req.userId) {
                    companionId = chat.second_member;
                } else if(chat.second_member === req.userId){
                    companionId = chat.first_member;
                }
                let companion = await User.findById(companionId);
                let last_message = await Message.findOne({
                    chat_id: chat.id
                }).sort([['createdAt', -1]]);
                console.log(last_message);
                if(companion) {
                    return {
                        id: chat.id,
                        first_member: chat.first_member,
                        second_member: chat.second_member,
                        last_message: {
                            text: last_message.text,
                            createdAt: last_message.createdAt
                        },
                        companion: companion
                    }
                } else {
                    return {
                        id: chat.id,
                        first_member: chat.first_member,
                        second_member: chat.second_member,
                        last_message: {
                            text: last_message.text,
                            createdAt: last_message.createdAt
                        }
                    }
                }
            })
        );
        res.send(data)
    }).catch(err => {
        console.log(err);
            res.status(400).send({
                message: "Your chat list is empty"
            })
        });
}