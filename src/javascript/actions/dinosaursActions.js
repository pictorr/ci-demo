import { axios, createError, generateFormData, getItemFromStorage } from '../utils/utils';
import { calls } from '../utils/calls';

/**
 * Get all dinosaurs from the database
 * @returns {Function}
 */
export const getDinosaurs = () => {
	return dispatch => {
		dispatch({ type: 'GET_DINOSAURS' });
		axios(calls.getDinosaurs(getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_DINOSAURS_FULFILLED',
					payload: { dinosaurs: res.data.dinosaurs }
				});
			})
			.catch(err => {
				dispatch({
					type: 'GET_DINOSAURS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Saves a dinosaur in the database
 * @param data {Object}
 * @returns {Function}
 */
export const saveDinosaur = data => {
	return dispatch => {
		dispatch({ type: 'SAVE_DINOSAUR' });
		const formData = generateFormData('image', data, 'image', {
			ignoredKeys: ['image']
		});
		axios(calls.saveDinosaur(formData, getItemFromStorage('token')))
			.then(() => {
				dispatch({ type: 'SAVE_DINOSAUR_FULFILLED' });
			})
			.catch(err => {
				dispatch({
					type: 'SAVE_DINOSAUR_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Get a dinosaur from the database
 * @param data {Object}
 * @returns {Function}
 */
export const getDinosaur = data => {
	return dispatch => {
		dispatch({ type: 'GET_DINOSAUR' });
		axios(calls.getDinosaur(data, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_DINOSAUR_FULFILLED',
					payload: { dinosaur: res.data.dinosaur }
				});
			})
			.catch(err => {
				dispatch({
					type: 'GET_DINOSAUR_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Updates a dinosaur in the database
 * @param data {Object}
 * @returns {Function}
 */
export const updateDinosaur = data => {
	return dispatch => {
		dispatch({ type: 'UPDATE_DINOSAUR' });
		const formData = generateFormData('image', data, 'image', {
			ignoredKeys: ['image']
		});
		axios(calls.updateDinosaur(formData, getItemFromStorage('token')))
			.then(() => {
				dispatch({ type: 'UPDATE_DINOSAUR_FULFILLED' });
			})
			.catch(err => {
				dispatch({
					type: 'UPDATE_DINOSAUR_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Delete a dinosaur from the database
 * @param data {Object}
 * @returns {Function}
 */
export const deleteDinosaur = data => {
	return dispatch => {
		dispatch({ type: 'DELETE_DINOSAUR' });
		axios(calls.deleteDinosaur(data, getItemFromStorage('token')))
			.then(() => {
				dispatch({
					type: 'DELETE_DINOSAUR_FULFILLED',
					payload: {
						dinosaurId: data
					}
				});
			})
			.catch(err => {
				dispatch({
					type: 'DELETE_DINOSAUR_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};