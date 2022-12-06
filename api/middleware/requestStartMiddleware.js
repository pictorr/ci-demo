/**
 * Start request time
 * @param req {Object}
 * @param res {Object}
 * @param next {Function}
 */
const setTime = (req, res, next) => {
	const now = new Date();
	req.startTime = now.getTime();
	return next();
};

module.exports = setTime;
