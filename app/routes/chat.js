module.exports = (app) => {
    let ChatController = require('../controllers/ChatController');
    let MessageController = require('../controllers/MessageController');
    let auth = require('../middleware/auth');

    /**
     * Chat creating
     */
    app.post('/chat', auth.checkToken, ChatController.createChat);
    /**
     * Chat deleting
     */
    app.delete('/chat/:id', auth.checkToken, ChatController.removeChat);

};