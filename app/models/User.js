const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = require('../../config/key.conf');

const UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_profile: String,
    gender: String
}, {
    timestamps: true
});

UserSchema.methods.getToken = function(user, next) {
    let token = jwt.sign({userId: user._id}, key.appKey);
    next({
        token: `Bearer ${token}`,
        email: user.email
    });
};

UserSchema.methods.compareHash = function() {
        let valid = bcrypt.compareSync(req.body.password, data.password);
        if(valid) {
            console.log('valid', valid);
            data.getToken(data, (userWithToken) => {
                res.send(userWithToken);
                return;
            });
        } else {
            res.status(400).send({
                message: "wrong email or password"
            });
            return;
        }
    }

UserSchema.pre('save', function (next) {
    let user = this;

    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);