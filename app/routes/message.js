module.exports = (app) => {
    let MessageController = require('../controllers/MessageController');
    let auth = require('../middleware/auth');

    app.get('/message/:chat_id', auth.checkToken, MessageController.getAllMessages);
    app.post('/message/:chat_id', auth.checkToken, MessageController.createMessage);

};