const Message = require('../models/Message');

exports.getAllMessages = (req, res) => {
  Message.find({
      $and: [
          {
            $or: [
                {
                    user_id: req.userId
                },
                {
                    reciever_id: req.userId
                }
            ]
          },
          {
            chat_id: req.params.chat_id
          }
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

exports.createMessage = (req, res) => {
        if(!req.body.text) {
            res.status(400).send({
                message: 'Book author is required'
            });
            return;
        }
        if(!req.body.title) {
            res.status(400).send({
                message: 'Book title is required'
            });
            return;
    }
    const message = new Message({
        user_id: req.userId,
        reciever_id: req.body.recieverid,
        chat_id: req.body.chat_id,
        text: req.body.text
    });

    message.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err});
    });
}