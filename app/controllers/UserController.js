User = require('../models/User');

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