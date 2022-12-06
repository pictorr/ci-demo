const express = require('express');
const utilityService = require('../../utils/utilityService.js');
const userFunctions = require('../functions/users.function.js');
const router = express.Router();

const fileUpload = utilityService.uploader.fields([
	{ name: 'image', maxCount: 1 },
]);

//Controller for GET /users
router.get('/', (req, res) => {
    return userFunctions.getUsers(req.decoded.country || 'ro')
        .then(users => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('users_fetched', req.requestLanguage).message,
                data: users,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /users/user-account
router.get('/user-account', (req, res) => {
    return userFunctions.getUser(req.query.userId, req.requestLanguage)
        .then(user => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('users_fetched', req.requestLanguage).message,
                data: user,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /users/user-account
router.put('/user-account', fileUpload, (req, res) => {
    let data = req.body;
    return userFunctions.updateUserAccount(req, data, req.requestLanguage)
        .then((user) => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('user_updated', req.requestLanguage).message,
                data: user,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

//Controller for PUT /users/user
router.put('/user', fileUpload, (req, res) => {
    let data = req.body;
    return userFunctions.updateUser(req, data, req.requestLanguage)
        .then((user) => {
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('user_updated', req.requestLanguage).message,
                data: user,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

// Controller for PUT /users/change-password
router.put('/change-password', (req, res) => {
    return userFunctions.updateUserPassword(req.body, req.requestLanguage)
        .then((user) => {
            // Remove password from response
            const responseUser = Object.assign({}, user._doc, {password: undefined, savedOffers: undefined});
            res.status(global.HTTP_SUCCESS).jsonp({
                status: 'success',
                message: utilityService.parseCodeMessage('user_updated', req.requestLanguage).message,
                data: responseUser,
            });
        })
        .catch(err => utilityService.logResponse(req, res, err));
});

module.exports = router;