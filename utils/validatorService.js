let Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const utilityService = require('./utilityService.js');
const { accountFields, dinosaurFields, offerFields, allowedPlates, currentOfferFields } = require('./constants.js');

const schemas = {
	register: Joi.object().keys({
		...accountFields,
		emailAddress: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		password: Joi.string().min(7).max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.empty': {
						err.message = 'password_required';
						break;
					}
					case 'string.min': {
						err.message = 'password_min';
						break;
					}
					case 'string.max': {
						err.message = 'password_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
	saveProfile: Joi.object().keys({
		...accountFields,
	}),
	resendMailConfirmation: Joi.object().keys({
		emailAddress: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
	login: Joi.object().keys({
		emailAddress: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		password: Joi.string().min(7).max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.empty': {
						err.message = 'password_required';
						break;
					}
					case 'string.min': {
						err.message = 'password_min';
						break;
					}
					case 'string.max': {
						err.message = 'password_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		rememberMe: Joi.boolean().required().error(new Error('failed_to_login')),
	}),
	resetPasswordRequest: Joi.object().keys({
		emailAddress: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
	resetPasswordCheckCode: Joi.object().keys({
		email: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid_must_be_mail';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		code: Joi.string().min(4).max(4).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'new_password_verification_code_required';
						break;
					}
					case 'string.max':
					case 'string.min': {
						err.message = 'new_password_verification_code_min_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
	resetPasswordSavePassword: Joi.object().keys({
		resetPasswordId: Joi.string().max(73).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.empty': {
						err.message = 'reset_password_id_required';
						break;
					}
					case 'string.max': {
						err.message = 'reset_password_id_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		password: Joi.string().min(7).max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.empty': {
						err.message = 'password_required';
						break;
					}
					case 'string.min': {
						err.message = 'password_min';
						break;
					}
					case 'string.max': {
						err.message = 'password_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
	sendAllowedPlatesData:Joi.object().keys({
		...allowedPlates,
	}),
	saveDinosaur: Joi.object().keys({
		...dinosaurFields,
	}),
	updateDinosaur: Joi.object().keys({
		id: Joi.objectId().required().error(new Error('invalid_dinosaur_id')),
		...dinosaurFields,
	}),
	saveOffer: Joi.object().keys({
		...offerFields,
	}),
	savePlatingOffer: Joi.object().keys({
		...offerFields,
	}),
	saveCurrentOffer: Joi.object().keys({
		...currentOfferFields,
	}),
	updateOffer: Joi.object().keys({
		...offerFields,
	}),
	updateSavedOffer: Joi.object().keys({
		...offerFields,
	}),
	updateSavedPlatingOffer: Joi.object().keys({
		...offerFields,
	}),
	saveSession: Joi.array().items(Joi.object().keys({
		...offerFields
	})),
	updateSession: Joi.array().items(Joi.object().keys({
		...offerFields
	})),
	downloadOffer: Joi.object().keys({
		...offerFields,
	}),
	saveDataSession:Joi.object().keys({
		id: Joi.string().max(128).optional().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'id_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		email: Joi.string().email().min(7).max(256).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'any.required':
					case 'string.empty': {
						err.message = 'email_not_valid';
						break;
					}
					case 'string.min': {
						err.message = 'email_min';
						break;
					}
					case 'string.max': {
						err.message = 'email_max';
						break;
					}
					case 'string.email': {
						err.message = 'email_not_valid_must_be_mail';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		company: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'company_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		contactPerson: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'contactPerson_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		phoneNumber: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'phoneNumber_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		objective: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'objective_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		typeObjective: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'typeObjective_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		location: Joi.string().max(128).required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'location_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		description: Joi.string().required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'description_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		code: Joi.string().required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'code_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
		validationDate: Joi.string().required().error(errors => {
			errors.forEach(err => {
				switch(err.code) {
					case 'string.max': {
						err.message = 'validationDate_max';
						break;
					}
					default: {
						break;
					}
				}
			});
			return new Error(errors);
		}),
	}),
};

const validateInput = {
	/**
	 * Validate if the request has a body
	 * @param req
	 * @returns {Promise}
	 */
	hasBody: req => {
		return new Promise((resolve, reject) => {
			if (!req.body) {
				reject(new utilityService.createError(new Error(), 'The request has no body', global.HTTP_INTERNAL_SERVER_ERROR, 'validator-service'));
			}
			return resolve(req.body);
		});
	},
};

/**
 * Validates an object and returns another object based on the selected options sent as parameters
 * @param parameter {Object} to evaluate
 * @param schema {Object} Joi schema
 * @param options {Object} the type of return the function will have
 * @param customErrorMessage {String} with a special error message
 * @param language {String}
 * @returns {Promise}
 */
const validateSchema = (parameter, schema, options = {
	allowUnknown: true,
	stripUnknown: true,
	abortEarly: false,
}, language = 'en', customErrorMessage = null) => {
	return new Promise((resolve, reject) => {
		if (schema === undefined || schema === null || typeof schema !== 'object') {
			return reject(new utilityService.createError(new Error(), 'The schema passed to validation is invalid', global.HTTP_INTERNAL_SERVER_ERROR, 'validator-service'));
		}
		if (options === undefined || typeof options !== 'object') {
			return reject(new utilityService.createError(new Error(), 'The options passed to validation are invalid', global.HTTP_INTERNAL_SERVER_ERROR, 'validator-service'));
		}

		schema.validateAsync(parameter, options)
			.then(value => resolve(value))
			.catch(err => {
				console.log(err);
				err.message = customErrorMessage || utilityService.parseCodeMessage(err.message, language).message;
				return reject(new utilityService.createError(new Error(customErrorMessage || err.message), customErrorMessage || err.message, global.HTTP_BAD_REQUEST, 'validator-service'));
			});
	});
};

module.exports = {
	schemas,
	validateInput,
	validateSchema,
};