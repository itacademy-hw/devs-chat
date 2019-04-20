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
        required: true,
        select: false
    },
    profile_image: String,
    gender: String,
    phone: String,
    dob: Date,
    language: String,
    city: String,
    country: String,
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

UserSchema.pre('save', function (next) {
    let user = this;

    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);