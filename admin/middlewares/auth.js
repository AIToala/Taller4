var express = require('express');
var router = express.Router();

var auth = (req, res, next) => {
    
    if (req.session && req.session.user !== undefined ) {
        return next();
    } else {
        return res.sendStatus(401);
    }
    
};

module.exports = auth;