const axios = require('axios');

/**
 * Call an external service
 * @returns {Promise}
 */
const getSomething = () => {
	return new Promise((resolve, reject) =>
		axios({
			method: 'GET',
			url: `some external service`,
			headers: {
				'Content-type': 'application/json',
			}
		})
			.then(res => resolve(res))
			.catch(err => reject(err))
	);
};

module.exports = {
	getSomething
};