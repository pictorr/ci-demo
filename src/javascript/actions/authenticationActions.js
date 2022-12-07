import {axios, createError, generateFormData} from '../utils/utils';
import { calls } from '../utils/calls';

/**
 * Login a user
 * @param data {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const onLogin = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'ON_LOGIN' });
		axios(calls.onLogin(data))
			.then(res => {
				dispatch({
					type: 'ON_LOGIN_FULFILLED',
					payload: {
						id: res.data.user.id,
						token: res.data.token,
						isAdmin: res.data.user.isAdmin,
						isMasterAdmin: res.data.user.isMasterAdmin,
						functionalitiesAccess: res.data.user.functionalitiesAccess,
						language: res.data.user.language,
						country: res.data.user.country,
					}
				});
				if (callback) {
					callback(res.data.token);
				}
			})
			.catch(err => {
				dispatch({
					type: 'ON_LOGIN_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};


/**
 * Register a user
 * @param data {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const onRegister = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'ON_REGISTER' });
		const formData = generateFormData('image', data, 'image', {
			ignoredKeys: ['image']
		});
		axios(calls.onRegister(formData))
			.then(() => {
				dispatch({ type: 'ON_REGISTER_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'ON_REGISTER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Request to reset password
 * @param data {Object}
 * @returns {Function}
 */
export const resetPasswordRequest = data => {
	return dispatch => {
		dispatch({ type: 'RESET_PASSWORD' });
		axios(calls.resetPasswordRequest(data))
			.then(() => {
				dispatch({ type: 'RESET_PASSWORD_FULFILLED' });
			})
			.catch(err => {
				dispatch({
					type: 'RESET_PASSWORD_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Request to reset password
 * @param data {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const resetPasswordSavePassword = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'SAVE_PASSWORD' });
		axios(calls.resetPasswordSavePassword(data))
			.then(() => {
				dispatch({ type: 'SAVE_PASSWORD_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'SAVE_PASSWORD_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Resend the confirmation mail for a user
 * @param data {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const resendMailConfirmation = (data, callback = null) => {
	return dispatch => {
		dispatch({ type: 'RESEND_MAIL_CONFIRMATION' });
		axios(calls.resendMailConfirmation(data))
			.then(() => {
				dispatch({ type: 'RESEND_MAIL_CONFIRMATION_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'RESEND_MAIL_CONFIRMATION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Confirm a user's account
 * @param data {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const confirmAccount = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'CONFIRM_ACCOUNT' });
		axios(calls.confirmAccount(data))
			.then(() => {
				dispatch({ type: 'CONFIRM_ACCOUNT_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'CONFIRM_ACCOUNT_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Validate a token
 * @param token {String}
 * @param dispatch {Function}
 * @returns {Promise}
 */
export const validateToken = (token, dispatch) => {
	return new Promise(resolve => {
		axios(calls.validateToken(token))
			.then(() => resolve(true))
			.catch(() => resolve(false))
			.finally(() => {
				dispatch({
					type: 'SET_TOKEN',
					payload: {
						token: token
					}
				});
				dispatch({ type: 'CHECKED_CREDENTIALS' });
			});
	});
};