const bridgeService = require('../../utils/bridgeService.js');
const utilityService = require('../../utils/utilityService.js');
const databaseService = require('../../utils/databaseService/databaseService.js');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const mailingTemplates = require('../../views/mailingTemplates.js');
const { desc } = require('../../utils/constants.js');

/**
 * Hash the password before insertion
 * @param password String
 * @returns {Promise}
 */
const hashPassword = password => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt((saltError, salt) => {
			if (saltError) {
				reject(new utilityService.createError(new Error(), saltError, global.HTTP_BAD_REQUEST, 'hashPassword'));
			}
			bcrypt.hash(password, salt, (hashError, hash) => {
				if (hashError) {
					reject(new utilityService.createError(new Error(), hashError, global.HTTP_BAD_REQUEST, 'hashPassword'));
				}
				resolve(hash);
			});
		});
	});
};

/**
 * Register a user
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const register = (req, data, language) => {
	return new Promise((resolve, reject) => {
		let savedUser = {};
		const activationId = uuid();
		return databaseService.getUserByField({ emailAddress: data.emailAddress }, language)
			.then(user => {
				if (user) {
					if (user.accountDisabled) {
						return reject(utilityService.parseCodeMessage('account_disabled', language))
					} else {
						return reject(utilityService.parseCodeMessage('already_registered', language))
					}
				} else {
					return utilityService.upload('dinosaurImage', req, ['original'], 'image')
						.then(uploadResults => {
							let promises = [];
							uploadResults.forEach(uploadedImage => {
								const imageData = {
									url: uploadedImage.file,
									variant: uploadedImage.variant,
								};
								promises.push(databaseService.saveImage(imageData, language));
							});
							return Promise.all(promises)
								.then(savedImages => {
									return hashPassword(data.password)
										.then(hash => {
											let lang = 'ro';
											if (data && data.language !== 'ro') {
												lang = data.language;
											}
											let country = 'ro';
											if (data && data.country !== 'ro') {
												country = data.country;
											}

											const userData = {
												emailAddress: data.emailAddress,
												company: data.company,
												job: data.job,
												address: data.address,
												locality: data.locality,
												state: data.state,
												password: hash,
												language: lang,
												country: country,
												firstName: data.firstName,
												lastName: data.lastName,
												phoneNumber: data.phoneNumber,
												activationId: activationId,
												image: {
													original: ( savedImages.find(image => image.variant === 'original') || {} )._id,
												}
											};
											return databaseService.saveUser(userData, language);
										})
										.then(userData => {
											savedUser = userData;
										})
										.then(() => {
											// admin email
											const { subjectAdmin, htmlAdmin } = mailingTemplates.confirmAccountAdmin(savedUser, language);
											// switch country
											switch (language) {
												case 'en':
													utilityService.mailTo(req, APP_ADMIN_EN_EMAIL, subjectAdmin, htmlAdmin);
													utilityService.mailTo(req, APP_ADMIN_EMAIL, subjectAdmin, htmlAdmin);
													utilityService.mailTo(req, APP_ADMIN2_EMAIL, subjectAdmin, htmlAdmin);
													break;
												case 'gr':
													utilityService.mailTo(req, APP_ADMIN_GR_EMAIL, subjectAdmin, htmlAdmin);
													utilityService.mailTo(req, APP_ADMIN_EMAIL, subjectAdmin, htmlAdmin);
													utilityService.mailTo(req, APP_ADMIN2_EMAIL, subjectAdmin, htmlAdmin);
													break;
												case 'pl':
													utilityService.mailTo(req, APP_ADMIN_PL_EMAIL, subjectAdmin, htmlAdmin);
													break;
												default:
													utilityService.mailTo(req, APP_ADMIN_EMAIL, subjectAdmin, htmlAdmin);
													utilityService.mailTo(req, APP_ADMIN2_EMAIL, subjectAdmin, htmlAdmin);
											}

											databaseService.getUsersByField({country: language}, { $sort: { lastLogin: desc } }, null, language).then(users => {
												users.forEach(user => {
													if (user.cities) {
														user.cities.forEach(city => {
															if (city.county === savedUser.state && city.selected === true && APP_ADMIN_EMAIL !== user.emailAddress && APP_ADMIN2_EMAIL !== user.emailAddress) {
																utilityService.mailTo(req, user.emailAddress, subjectAdmin, htmlAdmin);
															}
														})
													}
												})
											})
											.catch(err => {
												console.log(err);
											})

											if (language !== 'ro') {
												databaseService.getUsersByField({country: language}, { $sort: { lastLogin: desc } }, null, language).then(users => {
													users.forEach(user => {
														if (user.isAdmin === true) {
															utilityService.mailTo(req, user.emailAddress, subjectAdmin, htmlAdmin);
														}
													})
												})
												.catch(err => {
													console.log(err);
												})
											}

											// user email
											const { subject, html } = mailingTemplates.confirmAccount(savedUser, savedUser.language);
											utilityService.mailTo(req, savedUser.emailAddress, subject, html);

											resolve();
										})
								})
						})

				}
			})
			.catch(err => reject(err));
	})
};

/**
 * Resend the confirmation mail to a user
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const resendMailConfirmation = (req, data, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getUserByField({
			emailAddress: data.emailAddress,
			activated: false,
			accountDisabled: false
		}, language)
			.then(user => {
				if (!user) {
					return resolve();
				} else {
					const { subject, html } = mailingTemplates.confirmAccount(user, user.language);
					return utilityService.mailTo(req, user.emailAddress, subject, html);
				}
			})
			.then(() => resolve())
			.catch(err => reject(err));
	});
};

/**
 * Confirm a user's account
 * @param activationId {String}
 * @param language {String}
 * @returns {Promise}
 */
const confirmAccount = (req, activationId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getUserByField({ activationId: activationId, activated: false }, language)
			.then(user => {
				if (!user) {
					return reject(utilityService.parseCodeMessage('not_registered_or_confirmed', language))
				} else {
					return databaseService.updateUser({ activationId: activationId, activated: false }, {
						$set: {
							activationId: null,
							activated: true,
						}
					}, language)
						.then(() => {
							const { subject, html } = mailingTemplates.enableAccount(user, user.language);
                       		utilityService.mailTo(req, user.emailAddress, subject, html);
							resolve();
						})
				}
			})
			.catch(err => reject(err));
	});
};

/**
 * Request to reset a user's password
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const resetPasswordRequest = (req, data, language) => {
	return new Promise((resolve, reject) => {
		let resetPasswordId;
		return databaseService.getUserByField({ emailAddress: data.emailAddress }, language)
			.then(user => {
				if (!user) {
					return resolve()
				} else {
					resetPasswordId = uuid() + '-' + uuid();
					return databaseService.updateUser({ emailAddress: data.emailAddress }, {
						$set: {
							resetPasswordId: resetPasswordId,
						}
					}, language)
						.then(() => {
							const { subject, html } = mailingTemplates.resetPassword({
								...user._doc,
								resetPasswordId: resetPasswordId
							});
							return utilityService.mailTo(req, user.emailAddress, subject, html);
						})
				}
			})
			.then(() => resolve())
			.catch(err => reject(err))
	});
};

/**
 * Save the new password for a user
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const resetPasswordSavePassword = (data, language) => {
	return new Promise((resolve, reject) => {
		let user;
		return databaseService.getUserByField({ resetPasswordId: data.resetPasswordId }, language)
			.then(res => {
				user = res;
				if (!user) {
					return reject(utilityService.parseCodeMessage('invalid_reset_password', language))
				} else {
					return hashPassword(data.password)
						.then(hash => {
							return databaseService.updateUser({ _id: user._id }, {
								$set: {
									password: hash,
									resetPasswordId: null,
								}
							}, language)
						})
				}
			})
			.then(() => resolve())
			.catch(err => reject(err));
	});
};

/**
 * Login a user
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const login = (data, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getUserByField({ emailAddress: data.emailAddress }, language)
			.then(user => {
				if (!user) {
					return reject(utilityService.parseCodeMessage('not_registered_or_confirmed', language))
				} else {
					bcrypt.compare(data.password, user.password, (err, result) => {
						if (err || !result) {
							return reject(utilityService.parseCodeMessage('incorrect_credentials', language))
						} else if (!user.activated) {
							return reject(utilityService.parseCodeMessage('not_confirmed_login', language))
						} else if (user.accountDisabled) {
							return reject(utilityService.parseCodeMessage('account_disabled', language))
						} else {
							return utilityService.generateToken(user, { expiresIn: '12h' })
								.then(token => {
									user.lastLogin = Date.now();
									if (user.logins) {
										user.logins.push(Date.now());
									}
									return databaseService.updateUser({ _id: user._id }, user, language)
										.then(() => {
											resolve({
												token: token,
												user: {
													id: user._id,
													emailAddress: user.emailAddress,
													firstName: user.firstName,
													lastName: user.lastName,
													isAdmin: user.isAdmin,
													isMasterAdmin: user.isMasterAdmin,
													functionalitiesAccess: user.functionalitiesAccess,
													language: user.language,
													country: user.country
												}
											});
										})
								})
						}
					})
				}
			})
	})
};

module.exports = {
	register,
	login,
	resendMailConfirmation,
	confirmAccount,
	resetPasswordRequest,
	resetPasswordSavePassword,
};
