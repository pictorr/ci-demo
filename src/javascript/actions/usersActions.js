import { axios, createError, generateFormData, getItemFromStorage } from '../utils/utils';
import { calls } from '../utils/calls';

/**
 * Get all users from the database
 */
 export const getUser = (userId, callback) => {
    return dispatch => {
        dispatch({ type: 'GET_USER' });
        axios(calls.getUser(userId, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_USER_FULFILLED',
                    payload: { user: res.data.user }
                });
                if (callback) {
                    callback();
                }
            })
            .catch(err => {
                callback();
                dispatch({
                    type: 'GET_USER_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Get all users from the database
 */
export const getUsers = () => {
    
    return dispatch => {
        dispatch({ type: 'GET_USERS' });
        axios(calls.getUsers(getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_USERS_FULFILLED',
                    payload: { users: res.data.users }
                });
            })
            .catch(err => {
                dispatch({
                    type: 'GET_USERS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Updates an user in the database
 * @param data {Object}
 * @returns {Function}
 */
export const updateUser = (data, callback) => {
    return dispatch => {
        dispatch({ type: 'UPDATE_USER' });
        axios(calls.updateUser(data, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'UPDATE_USER_FULFILLED',
                    payload: { user: res.data }
                });
                if (callback) {
                    callback();
                }
            })
            .catch(err => {
                dispatch({
                    type: 'UPDATE_USER_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Updates an user account details in the database
 * @param data {Object}
 * @returns {Function}
 */
 export const updateUserAccount = (data, callback) => {
    return dispatch => {
        dispatch({ type: 'UPDATE_USER' });
        const formData = generateFormData('image', data, 'image', {
			ignoredKeys: ['image']
		});
        axios(calls.updateUserAccount(formData, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'UPDATE_USER_FULFILLED',
                    payload: { user: res.data }
                });
                if (callback) {
                    callback();
                }
            })
            .catch(err => {
                dispatch({
                    type: 'UPDATE_USER_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

export const updateUserPassword = data => {
    return dispatch => {
        dispatch({ type: 'UPDATE_USER' });
        axios(calls.updateUserPassword(data, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'UPDATE_USER_FULFILLED',
                    payload: { user: res.data }
                });
            })
            .catch(err => {
                dispatch({
                    type: 'UPDATE_USER_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};