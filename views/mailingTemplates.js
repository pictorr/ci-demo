const confirmAccount = require('./confirmAccount.js');
const confirmAccountAdmin = require('./confirmAccountAdmin.js');
const resetPassword = require('./resetPassword.js');
const enableAccount = require('./enableAccount.js');
const disableAccount = require('./disableAccount.js');
const adminChangedPass = require('./adminChangedPass.js');
const adminAddCounty = require('./adminAddCounty.js');

module.exports = {
	confirmAccount,
	confirmAccountAdmin,
	resetPassword,
	enableAccount,
	disableAccount,
	adminChangedPass,
	adminAddCounty,
};
