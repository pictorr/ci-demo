const express = require('express');
const validatorService = require('../../utils/validatorService.js');
const utilityService = require('../../utils/utilityService.js');
const authenticationFunctions = require('../functions/authentication.js');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const saveUserUpload = utilityService.uploader.fields([
	{ name: 'image', maxCount: 1 },
]);

//Controller for POST /register
router.post('/register', saveUserUpload, (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.register, null, req.requestLanguage))
		.then(data => authenticationFunctions.register(req, data, data.country || 'ro'))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('user_created', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

const resendMailConfirmationLimiter = rateLimit({
	windowMs: 55 * 1000, // 55s window
	max: 1, // start blocking after 1 request
	message: {
		error: 'Try again in 60 seconds.'
	},
	statusCode: global.HTTP_BAD_REQUEST,
	skipFailedRequests: false,
});

//Controller for POST /register/re-confirm
router.post('/register/re-confirm', resendMailConfirmationLimiter, (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.resendMailConfirmation, null, req.requestLanguage))
		.then(data => authenticationFunctions.resendMailConfirmation(req, data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('confirmation_resent', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for GET /confirm-account/:activationId
router.get('/confirm-account/:activationId', (req, res) => {
	return authenticationFunctions.confirmAccount(req, req.params.activationId, req.requestLanguage)
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('account_activated', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

const resetPasswordLimiter = rateLimit({
	windowMs: 55 * 1000, // 55s window
	max: 1, // start blocking after 1 request
	message: {
		error: 'Try again in 60 seconds.'
	},
	statusCode: global.HTTP_BAD_REQUEST,
	skipFailedRequests: false,
});

// Controller for POST /reset-password/request
router.post('/reset-password/request', resetPasswordLimiter, (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.resetPasswordRequest))
		.then(data => authenticationFunctions.resetPasswordRequest(req, data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('request_reset_password_sent', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

// Controller for POST /reset-password/save-password
router.post('/reset-password/save-password', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.resetPasswordSavePassword))
		.then(data => authenticationFunctions.resetPasswordSavePassword(data, req.requestLanguage))
		.then(() => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('password_reset', req.requestLanguage).message,
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

//Controller for POST /login
router.post('/login', (req, res) => {
	return validatorService.validateInput.hasBody(req)
		.then(body => validatorService.validateSchema(body, validatorService.schemas.login))
		.then(data => authenticationFunctions.login(data, req.requestLanguage))
		.then(data => {
			res.status(global.HTTP_SUCCESS).jsonp({
				status: 'success',
				message: utilityService.parseCodeMessage('user_logged_in', req.requestLanguage).message,
				data: data
			});
		})
		.catch(err => utilityService.logResponse(req, res, err));
});

module.exports = router;