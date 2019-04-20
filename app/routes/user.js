module.exports = (app) => {
    let userController = require('../controllers/UserController');

    /**
     * User registration
     */
    app.post('/user/register', userController.register);

};
/**
     * Get interlocutor
     */
    app.get('/user/interlocutor', auth.checkToken, userController.interlocutor);
