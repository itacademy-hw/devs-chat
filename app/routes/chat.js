module.exports = (app) => {
    let chatController = require('../controllers/chatController');

    /**
     * Chat creating
     */
    app.post('/chat', chatController.createChat);

};