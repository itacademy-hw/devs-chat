module.exports = (app) => {
    let chatController = require('../controllers/ChatController');

    /**
     * Show chats
     */
    app.get('/chat', auth.checkToken, chatController.showChats);

};