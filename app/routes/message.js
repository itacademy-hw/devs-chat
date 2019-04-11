module.exports = (app) => {
    let messageController = require('../controllers/messageController');

    /**
     * Chat creating
     */
    app.post('/chat', messageController.createChat);

};