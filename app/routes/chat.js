module.exports = (app) => {
    let chatController = require('../controllers/chatController');

    /**
     * Chat creating
     */
    app.post('/chat', chatController.createChat);
    /**
     * Chat deleting
     */
    app.delete('/chat', chatController.removeChat);
};