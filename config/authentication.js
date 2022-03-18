const jwt = require('jsonwebtoken');
const moment = require('moment');
const dbFunction = require('./db.config');
const tokens = require('./tokens');
require('./mail.config');
require('./constants');

const adminAuth = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        res.redirect('/admin/error?error='+ error.message + '&errorStatus=401');
    }
}
const siteAuth = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.redirect('/admin/error?error='+ error.message + '&errorStatus=401');
    }
}

module.exports = {
    adminAuth,
    siteAuth
}