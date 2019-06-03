require('dotenv').config();
const User = require('../models/User');
const Chat = require('../models/Chat');
const async = require('async');
const crypto = require('crypto');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');


let email = process.env.MAILER_EMAIL_ID || '';
let pass = process.env.MAILER_PASSWORD || '';

let smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});


let handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./app/templates/'),
        layoutsDir: path.resolve('./app/templates/'),
        defaultLayout: 'forgot-password-email.html',
    },
    viewPath: path.resolve('./app/templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

exports.register = (req, res) => {

    if (!req.body.email) {
        res.status(400).send({
            message: 'Email is required'
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).send({
            message: 'Password is required'
        });
        return;
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });

    user.save().then(data => {
        user.getToken(data, (userWithToken) => {
            res.send(userWithToken);
        });
    }).catch(err => {
        if (err.code === 11000) {
            res.status(400).send({message: "Email is already exist"});

        }
        res.status(500).send({message: err});
    });
};

exports.login = (req, res) => {
    if (!req.body.email) {
        res.status(400).send({
            message: 'Email is required'
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).send({
            message: 'Password is required'
        });
        return;
    }

    User.findOne({email: req.body.email}).then(data => {
        data.compareHash(req.body.password, function (userWithToken) {
            res.send(userWithToken);
        }, function () {
            res.status(400).send({
                message: "wrong email or password"
            });
        });
    }).catch(err => {
        res.status(400).send({
            message: "wrong email or password"
        })
        return;
    });
};


exports.forgot_password = function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                email: req.body.email
            }).exec(function (err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function (user, done) {
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function (user, token, done) {
            User.findByIdAndUpdate({_id: user._id}, {
                reset_password_token: token,
                reset_password_expires: Date.now() + 86400000
            }, {upsert: true, new: true}).exec(function (err, new_user) {
                done(err, token, new_user);
            });
        },
        function (token, user, done) {
            let data = {
                to: user.email,
                from: email,
                template: 'forgot-password-email',
                subject: 'You forgot your password!',
                context: {
                    url: 'http://localhost:3000/reset_password?token=' + token + '&email' + user.email,
                    name: user.first_name
                }
            };

            smtpTransport.sendMail(data, function (err) {
                if (!err) {
                    return res.json({message: 'Kindly check your email for further instructions'});
                } else {
                    return done(err);
                }
            });
        }
    ], function (err) {
        return res.status(422).json({message: err});
    });
};

exports.me = (req, res) => {
    User.findById(req.userId).exec(function (err, user) {
        if (user) {
            res.send({
                me: {
                    id: user.id,
                    profile_image: user.profile_image || '',
                    gender: user.gender || '',
                    phone: user.phone || '',
                    dob: user.dob || '',
                    language: user.language || '',
                    city: user.city || '',
                    country: user.country || '',
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    email: user.email || ''
                }
            })
        } else {
            res.status(400).send({
                message: 'User not found'
            });
        }
    });
};

exports.get_user = (req, res) => {
    User.findById(req.params.id).exec(function (err, user) {
        if (user) {
            res.send({
                user: {
                    profile_image: user.profile_image || '',
                    city: user.city || '',
                    country: user.country || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    dob: user.dob || '',
                    gender: user.gender || '',
                    language: user.language || '',
                    first_name: user.first_name || '',
                    last_name: user.last_name || ''
                }
            })
        } else {
            res.status(400).send({
                message: 'User not found'
            });
        }
    });
};

exports.edit_profile = (req, res) => {
    User.findByIdAndUpdate(req.userId, req.body, {new: true}).then(data => {
        res.send(data)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            res.status(404).send({message: 'User was not found with provided id'});
            return;
        }
        res.status(500).send({message: err});
    })
};


exports.search = (req, res) => {
    if(!req.params.search || req.params.search === ' '){
        res.status(404).send({
            message: 'No such results'
        });
    }

    User.find({
        $or: [
            {first_name: {$regex: '.*' + req.params.search + '.*'}},
            {last_name: {$regex: '.*' + req.params.search + '.*'}},
            {email: {$regex: '.*' + req.params.search + '.*'}}
        ]
    }).then(users => {
        if (users.length) {
            users = users.map((user) => {
                return {
                    id: user.id,
                    profile_image: user.profile_image || '',
                    city: user.city || '',
                    country: user.country || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    dob: user.dob || '',
                    gender: user.gender || '',
                    language: user.language || '',
                    first_name: user.first_name || '',
                    last_name: user.last_name || ''
                }
            });
            res.send(users);
        } else {
            res.status(404).send({
                message: 'No such results'
            });
        }
    })
}

exports.get_companion = (req, res) => {
    Chat.findById(req.params.chat_id).then(data => {
        if(data) {
            let companion = null;
            if(data.first_member === req.userId) {
                companion = data.second_member;
            } else if(data.second_member === req.userId) {
                companion = data.first_member;
            }
            req.params.id = companion;
            this.get_user(req, res);
        } else {
            res.status(404).send({
                message: "Chat is not found"
            });
        }
    });
};
