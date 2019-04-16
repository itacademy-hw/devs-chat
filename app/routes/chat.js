module.exports = (app) => {
    let ChatController = require('../controllers/ChatController');

    /**
     * Chat creating
     */
    app.post('/chat', ChatController.createChat);
    /**
     * Chat deleting
     */
    app.delete('/chat/:id', ChatController.removeChat);
};