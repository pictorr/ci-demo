import { axios, createError, getItemFromStorage } from '../utils/utils';
import { calls } from '../utils/calls';

export const saveDataSession = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'SAVE_DATA_SESSION' });
		axios(calls.saveDataSession(data, getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'SAVE_DATA_SESSION_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'SAVE_DATA_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}

export const updateDataSession = (data, callback) => {
	return dispatch => {
		dispatch({ type: 'SAVE_DATA_SESSION' });
		axios(calls.updateDataSession(data, getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'SAVE_DATA_SESSION_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'SAVE_DATA_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}

export const updateOffersSession = (data, id, callback) => {
	return dispatch => {
		dispatch({ type: 'SAVE_DATA_SESSION' });
		axios(calls.updateOffersSession(data, id, getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'SAVE_DATA_SESSION_FULFILLED' });
				if (callback) {
					callback();
				}
			})
			.catch(err => {
				dispatch({
					type: 'SAVE_DATA_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}

export const deleteSessionOffer = (sessionId, offerId,) => {
	return dispatch => {
		dispatch({ type: 'DELETE_SESSION_OFFER' });
		axios(calls.deleteSessionOffer(sessionId, offerId, getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'DELETE_SESSION_OFFER_FULFILLED' });
			})
			.catch(err => {
				dispatch({
					type: 'DELETE_SESSION_OFFER_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}

export const getSession = (id, isEdit, offerId, callback) => {
	return dispatch => {
		dispatch({ type: 'GET_DATA_SESSION' });
		dispatch({ type: 'GET_SAVED_OFFERS' });
		axios(calls.getSession(id, getItemFromStorage('token')))
			.then((res) => {
				if (isEdit) {
					dispatch({
						type: 'GET_SAVED_OFFERS_FULFILLED',
						payload: { userSavedOffers: res.data.session.session }
					});
					dispatch({
						type: 'GET_OFFER_SESSION_FULFILLED',
						payload: { 
							userSavedOffers: res.data.session.session,
							offerId: offerId,
						}
					});
				}
				else {
					dispatch({
						type: 'GET_SAVED_OFFERS_FULFILLED',
						payload: { userSavedOffers: res.data.session.session }
					});
				}

				dispatch({ type: 'GET_DATA_SESSION_FULFILLED', payload:res.data.session });
				
				if (callback) {
					callback({offer: res.data.session.session.filter(offer => offer._id === offerId)[0]});
				}
				
			})
			.catch(err => {
				dispatch({
					type: 'GET_DATA_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
				dispatch({type: 'GET_SAVED_OFFERS_REJECTED',payload: { error: createError(err) }});

			});
	};
}

export const getSessionAndOffer = (sessionId, offerId, callback) => {
	return dispatch => {
		dispatch({ type: 'GET_DATA_SESSION' });
		axios(calls.getSession(sessionId, getItemFromStorage('token')))
			.then((res) => {
				dispatch({ type: 'GET_DATA_SESSION_FULFILLED', payload:res.data.session });
				if (res?.data?.session?.session) {
					let offers = res?.data?.session?.session;
					if (offers?.length > 0) {
						let offer = offers.find(el => el._id === offerId);
						dispatch({ type: 'GET_OFFER_FROM_SESSION_FULFILLED', payload: offer });
					}
				}

				// update offer.offer
			})
			.catch(err => {
				dispatch({
					type: 'GET_DATA_SESSION_REJECTED',
					payload: { error: createError(err) }
				});
			});
	};
}
