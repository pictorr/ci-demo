const getRequestLanguage = (req, res, next) => {
	const availableLanguages = ['bg', 'cr', 'en', 'gr', 'pl', 'ro', 'sb'];
	req.requestLanguage = availableLanguages.indexOf(req.headers['content-language']) !== -1 ? req.requestLanguage : 'ro';
	return next();
};

module.exports = getRequestLanguage;