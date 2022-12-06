const jwt = require('jsonwebtoken');
const utilityService = require('../../utils/utilityService.js');

const publicOrigins = [
	'/register',
	'/reset-password/request',
	'/reset-password/validate-code',
	'/reset-password/save-password',
	'/login',
	'/confirm-account'
];

const decodeToken = (req, res, next) => {
	if (req.originalUrl.indexOf('hooks') !== -1) {
		if (req.headers['internal_api_key'] === global.INTERNAL_API_KEY) {
			return next();
		} else {
			return res.status(global.HTTP_UNAUTHORIZED).jsonp({
				error: utilityService.parseCodeMessage('permission_denied', req.requestLanguage).message,
			});
		}
	} else if (publicOrigins.find(o => req.originalUrl.indexOf(o) !== -1)) {
		return next();
	} else {
		const token = req.headers && req.headers.authorization ? req.headers.authorization.replace('bearer ', '').replace('Bearer', '') : null;
		if (!token) {
			return res.status(global.HTTP_UNAUTHORIZED).jsonp({
				error: utilityService.parseCodeMessage('permission_denied', req.requestLanguage).message
			})
		} else {
			jwt.verify(token, global.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(global.HTTP_UNAUTHORIZED).jsonp({
						error: utilityService.parseCodeMessage('permission_denied', req.requestLanguage).message,
					});
				}
				req.decoded = decoded;
				req.decoded.token = token;
				return next();
			})
		}
	}
};

module.exports = decodeToken;