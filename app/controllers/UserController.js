require('dotenv').config();
const User = require('../models/User');
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

    console.log(req.body);
    if(!req.body.email) {
        res.status(400).send({
            message: 'Email is required'
        });
        return;
    }
    if(!req.body.password) {
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
        if(err.code === 11000) {
            res.status(400).send({message: "Email is already exists"});
        }
        res.status(500).send({message: err});
    });
};


exports.forgot_password = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function(user, done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
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

            smtpTransport.sendMail(data, function(err) {
                if (!err) {
                    return res.json({ message: 'Kindly check your email for further instructions' });
                } else {
                    return done(err);
                }
            });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
};