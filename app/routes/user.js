module.exports = (app) => {
    let userController = require('../controllers/UserController');
    let auth = require('../middleware/auth');

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

    /**
     * Get me
     */
    app.get('/user/me', auth.checkToken, userController.me);

    /**
     * Update me
     */
    app.put('/user/edit-profile', auth.checkToken, userController.edit_profile);

};