const express = require('express');
const utilityService = require('../../utils/utilityService.js');
const router = express.Router();

router.get('/credentials', (req, res) => {
	res.status(global.HTTP_SUCCESS).jsonp({
		status: 'success',
		message: utilityService.parseCodeMessage('credentials_verified', req.decoded.language || 'ro', req.params.offerId || null).message,
	});
});

module.exports = router;