module.exports = (app) => {
    let userController = require('../controllers/UserController');

    /**
     * User registration
     */
    app.post('/user/register', userController.register);
    /**
     * User loginization
     */
    app.post('/user/login', userController.login);
};