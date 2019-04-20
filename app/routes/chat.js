module.exports = (app) => {
    let ChatController = require('../controllers/ChatController');


    let auth = require('../middleware/auth');

    /**
     * Chat creating
     */

    app.post('/chat', ChatController.createChat);
    /**
     * Chat deleting
     */
    app.delete('/chat/:id', ChatController.removeChat);
    app.post('/chat', auth.checkToken, ChatController.createChat);
    /**
     * Chat deleting
     */
    app.delete('/chat/:id', auth.checkToken, ChatController.removeChat);
};