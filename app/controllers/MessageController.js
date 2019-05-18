const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.getAllMessages = (req, res) => {
  Message.find({
      $and: [
          {
            $or: [
                {user_id: req.userId},
                {reciever_id: req.userId}
            ]
          },
          {chat_id: req.params.chat_id}
      ]
  }).then(data => {
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          res.status(404).send({message: 'Chat was not found with provided id'});
          return;
      }
      res.status(500).send({message: err});
  });
};

exports.createMessage = async (req, res) => {
    if(!req.body.text) {
        res.status(400).send({
            message: 'Message is required'
        });
        return;
    }
    let reciever_id = '';

    let response = await Chat.findById(req.params.chat_id);

    if(!response) {
        res.status(404).send({message: 'Chat was not found with provided id'});
        return;
    }

    if(response.first_member === req.userId) {
        reciever_id = response.second_member;
    } else if(response.second_member === req.userId){
        reciever_id = response.first_member;
    }

    if(!reciever_id) {
        res.status(422).send({message: "You can't send a message into char where you're not in"});
        return;
    }
    const message = new Message({
        user_id: req.userId,
        reciever_id: reciever_id,
        chat_id: req.params.chat_id,
        text: req.body.text
    });

    message.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err});
    });

}