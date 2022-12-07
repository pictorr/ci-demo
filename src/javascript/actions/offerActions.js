import { axios, createError, getItemFromStorage } from '../utils/utils';
import { calls } from '../utils/calls';

/**
 * @param data {Object}
 * @returns {Function}
 */
export const deleteOffers = () => {
	return dispatch => {
        return axios(calls.deleteOffers(getItemFromStorage('token')))
				.then();
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
export const deleteSavedOffers = () => {
	return dispatch => {
        return axios(calls.deleteSavedOffers(getItemFromStorage('token')))
				.then();
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
 export const deleteDraftOffers = () => {
	return dispatch => {
        return axios(calls.deleteDraftOffers(getItemFromStorage('token')))
				.then();
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
export const deleteSavedOffer = (offerId) => {
	return dispatch => {
        return axios(calls.deleteSavedOffer(offerId, getItemFromStorage('token')))
				.then(() => {
					dispatch({
						type: 'DELETE_SAVED_OFFER_FULFILLED',
						payload: { offerId: offerId }
					});
				});
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
 export const deleteSavedSession = (sessionId) => {
	return dispatch => {
        return axios(calls.deleteSavedSession(sessionId, getItemFromStorage('token')))
				.then(() => {
					dispatch({
						type: 'DELETE_SESSION_FULFILLED',
						payload: { sessionId: sessionId }
					});
				});
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
export const saveOffer = (data) => {
	return dispatch => {
        dispatch({ 
            type: 'SAVE_OFFER',
            payload: {offer: data}
        });
        return axios(calls.saveOffer(data, getItemFromStorage('token')))
			.then(() => {
				dispatch({ type: 'SAVE_OFFER_FULFILLED' });
			})
			.catch((err) => {
				dispatch({
					type: 'SAVE_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
 export const savePlatingOffer = (data) => {
	return dispatch => {
        dispatch({ 
            type: 'SAVE_OFFER',
            payload: {offer: data}
        });
        return axios(calls.savePlatingOffer(data, getItemFromStorage('token')))
			.then(() => {
				dispatch({ type: 'SAVE_OFFER_FULFILLED' });
			})
			.catch((err) => {
				dispatch({
					type: 'SAVE_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	}
};

/**
 * @param data {Object}
 * @returns {Function}
 */
export const saveCurrentOffer = (data) => {
	return dispatch => {
        dispatch({ 
            type: 'SAVE_CURRENT_OFFER',
            payload: {offer: data}
        });
        return axios(calls.saveCurrentOffer(data, getItemFromStorage('token')))
			.then(() => {
				dispatch({ type: 'SAVE_CURRENT_OFFER_FULFILLED' });
			})
			.catch((err) => {
				dispatch({
					type: 'SAVE_CURRENT_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	}
};

/**
 * Get saved offer from the database based on offerId
 * @param offerId {String}
 * @returns {Function}
 */
export const getCurrentOffer = (offerId, callback) => {
	return dispatch => {
		dispatch({ type: 'GET_CURRENT_OFFER' });
		return axios(calls.getCurrentOffer(offerId, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_CURRENT_OFFER_FULFILLED',
					payload: { offerList: res.data }
				});
				if (callback) {
					callback(res.data);
				}
			})
			.catch((err) => {
				dispatch({
					type: 'GET_CURRENT_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Get a offer from the database
 * @param data {Object}
 * @returns {Function}
 */
export const getOffer = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'GET_OFFER' });
		return axios(calls.getOffer(data, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_OFFER_FULFILLED',
					payload: { offer: res.data.offer }
				});
				if (callback) {
					callback({ offer: res.data.offer });
				}
			})
			.catch((err) => {
				dispatch({
					type: 'GET_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Get a offer from the database
 * @param offerId {String}
 * @returns {Function}
 */
export const getOffers = offerId => {
	return dispatch => {
		dispatch({ type: 'GET_OFFERS' });
		return axios(calls.getOffers(offerId, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_OFFERS_FULFILLED',
					payload: { offers: res.data.offers }
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_OFFERS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Save a new offer in the database
 * @param callback {Function}
 * @returns {Function}
 */
export const newOffer = callback => {
	return dispatch => {
		dispatch({ type: 'NEW_OFFER' });
		return axios(calls.newOffer(getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'NEW_OFFER_FULFILLED',
				});
				if (callback) {
					callback(res.data.id);
				}
			})
			.catch((err) => {
				dispatch({
					type: 'NEW_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};


/**
 * Get all saved offers from the database for a user
 * @returns {Function}
 */
export const getSavedOffers = () => {
	return dispatch => {
		dispatch({ type: 'GET_SAVED_OFFERS' });
		return axios(calls.getSavedOffers(getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_SAVED_OFFERS_FULFILLED',
					payload: { userSavedOffers: res.data.savedOffers }
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_SAVED_OFFERS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Get all saved sessions from the database for a user
 * @returns {Function}
 */
export const getSessions = () => {
	return dispatch => {
		dispatch({ type: 'GET_SESSIONS' });
		return axios(calls.getSessions(getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'GET_SESSIONS_FULFILLED',
					payload: { sessions: res.data }
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_SESSIONS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Update saved offer from the database for a user
 * @param offerId {String}
 * @param offer {Object}
 * @param callback {Function}
 * @returns {Function}
 */
export const updateSavedOffer = (offerId, offer, callback) => {
	return dispatch => {
		dispatch({ type: 'UPDATE_SAVED_OFFERS' });
		return axios(calls.updateSavedOffer(offerId, offer, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'UPDATE_SAVED_OFFERS_FULFILLED',
				});
				if (callback) {
					callback();
				}
			})
			.catch((err) => {
				dispatch({
					type: 'UPDATE_SAVED_OFFERS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

/**
 * Update saved offer from the database for a user
 * @param offerId {String}
 * @returns {Function}
 */
 export const updateSavedPlatingOffer = (offerId, offer) => {
	return dispatch => {
		dispatch({ type: 'UPDATE_SAVED_OFFERS' });
		return axios(calls.updateSavedPlatingOffer(offerId, offer, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'UPDATE_SAVED_OFFERS_FULFILLED',
				});
			})
			.catch((err) => {
				dispatch({
					type: 'UPDATE_SAVED_OFFERS_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};



/**
 * Update offer from the database for a user
 * @param offerId {String}
 * @returns {Function}
 */
export const updateOffer = (offerId, offer, callback) => {
	return dispatch => {
		dispatch({ type: 'UPDATE_OFFER' });
		return axios(calls.updateOffer(offerId, offer, getItemFromStorage('token')))
			.then(res => {
				dispatch({
					type: 'UPDATE_OFFER_FULFILLED',
				});
				if (callback) {
					callback();
				}
			})
			.catch((err) => {
				dispatch({
					type: 'UPDATE_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

export const downloadSavedOffer = (sessionId, offerId) => {
	return dispatch => {
		dispatch({ type: 'DOWNLOAD_OFFER' });
		axios(calls.downloadSavedOffer(sessionId, offerId, getItemFromStorage('token')))
			.then((res) => {
				dispatch({
					type: 'DOWNLOAD_OFFER_FULFILLED',
					payload: { fileName: res.data }
				});
			})
			.catch((err) => {
				dispatch({
					type: 'DOWNLOAD_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

export const downloadSession = (sessionId) => {
	return dispatch => {
		dispatch({ type: 'DOWNLOAD_SESSION' });
		axios(calls.downloadSession(sessionId, getItemFromStorage('token')))
			.then((res) => {
				dispatch({
					type: 'DOWNLOAD_SESSION_FULFILLED',
					payload: { fileName: res.data }
				});
			})
			.catch((err) => {
				dispatch({
					type: 'DOWNLOAD_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};

export const saveSession = callback => {
	return dispatch => {
		dispatch({ type: 'SAVE_SESSION' });
		axios(calls.saveSession(getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'SAVE_SESSION_FULFILLED' });
				if (callback) {
					callback(res.data.id);
				}
			})
			.catch((err) => {
				dispatch({
					type: 'SAVE_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}

/**
 * Get all saved sessions from the database for a user
 * @returns {Function}
 */
export const getSystemCode = (data) => {
	return dispatch => {
		dispatch({ type: 'GET_SYSTEM_CODE' });
		return axios(calls.getSystemCode(data, getItemFromStorage('token')))
			.then(res => {
				if(res?.data) {
					dispatch({
						type: 'GET_SYSTEM_CODES_OFFER_FULFILLED',
						payload: { res: res, protectionSense: data.protectionSense }
					});
					dispatch({
						type: 'GET_SYSTEM_CODE_FULFILLED',
						payload: { res: res, protectionSense: data.protectionSense }
					});
				}
				else {
					dispatch({
						type: 'GET_SYSTEM_CODE_FULFILLED',
					});
					dispatch({
						type: 'GET_SYSTEM_CODES_OFFER_FULFILLED',
					});
				}
			})
			.catch((err) => {
				dispatch({
					type: 'GET_SYSTEM_CODE_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
};