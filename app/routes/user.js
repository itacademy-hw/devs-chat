module.exports = (app) => {
    let userController = require('../controllers/UserController');

    /**
     * User registration
     */
    app.post('/user/register', userController.register);

    /**
     * User authorization
     */
    app.post('/user/login', userController.login);

    /**
     * User forgot password
     */
    app.post('/user/forgot-password', userController.forgot_password);

};