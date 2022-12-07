import { backend } from './config';

export const calls = {
	onRegister: data => ( {
		url: `${ backend }/register`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	saveProfile: (data, token) => ( {
		url: `${ backend }/user/profile`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	deleteUser: token => ( {
		url: `${ backend }/user/profile`,
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	getProfile: token => ( {
		url: `${ backend }/user/profile`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	onLogin: data => ( {
		url: `${ backend }/login`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	resendMailConfirmation: data => ( {
		url: `${ backend }/register/re-confirm`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	resetPasswordRequest: data => ( {
		url: `${ backend }/reset-password/request`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	resendConfirmationEmail: data => ( {
		url: `${ backend }/register/resend`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	resetPasswordSavePassword: data => ( {
		url: `${ backend }/reset-password/save-password`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
		data: data,
	} ),
	confirmAccount: data => ( {
		url: `${ backend }/confirm-account/${ data }`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
		},
	} ),
	validateToken: token => ( {
		url: `${ backend }/credentials`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getDinosaurs: token => ( {
		url: `${ backend }/dinosaurs`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getUser: (userId, token) => ( {
		url: `${ backend }/users/user-account?userId=${userId}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getUsers: token => ( {
		url: `${ backend }/users`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	saveDinosaur: (data, token) => ( {
		url: `${ backend }/dinosaurs/dinosaur`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	getDinosaur: (data, token) => ( {
		url: `${ backend }/dinosaurs/dinosaur/${ data }`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	updateDinosaur: (data, token) => ( {
		url: `${ backend }/dinosaurs/dinosaur`,
		method: 'PUT',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateUser: (data, token) => ( {
		url: `${ backend }/users/user`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateUserAccount: (data, token) => ( {
		url: `${ backend }/users/user`,
		method: 'PUT',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateUserPassword: (data, token) => ( {
		url: `${ backend }/users/change-password`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	deleteDinosaur: (data, token) => ( {
		url: `${ backend }/dinosaurs/dinosaur/${ data }`,
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	sendSystemsData: (data, token) => ( {
		url: `${ backend }/imports/sisteme`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	sendCeilingData: (data, token) => ( {
		url: `${ backend }/imports/ceiling`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	sendSpecialWalls: (data, token) => ( {
		url: `${ backend }/imports/special-walls`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	sendPlatingSystemsData: (data, token) => ( {
		url: `${ backend }/imports/plating-systems`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	sendDoubleStructuredSystemsData: (data, token) => ( {
		url: `${ backend }/imports/noisy-plating-systems`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),

	sendConsumptionsData: (data, token) => ( {
		url: `${ backend }/imports/consumuri`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	getImportedConsumptions: (systemName, token) => ( {
		url: `${ backend }/imports/consumuri?systemName=${systemName}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getAllowedPlates: token => ( {
		url: `${ backend }/imports/get-placi-permise`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	sendAllowedPlatesData: (data, token) => ( {
		url: `${ backend }/imports/placi-permise`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	importProducts: (data, token) => ( {
		url: `${ backend }/imports/add-products`,
		method: 'POST',
		headers: {
			'Content-type': 'multipart/form-data',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	getProducts: token => ( {
		url: `${ backend }/imports/products`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getUploads: token => ( {
		url: `${ backend }/imports/get-uploads`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	saveOffer: (data, token) => ( {
		url: `${ backend }/offers/offer`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	savePlatingOffer: (data, token) => ( {
		url: `${ backend }/offers/offer-plating`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateOffer: (offerId, data, token) => ( {
		url: `${ backend }/offers/offer?savedOfferId=${offerId}`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	saveCurrentOffer: (data, token) => ( {
		url: `${ backend }/offers/current-offer`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	getCurrentOffer: (offerId, token) => ( {
		url: `${ backend }/offers/saved-offer?savedOfferId=${offerId}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getOffer: (data, token) => ( {
		url: `${ backend }/offers/offer/${ data }`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getOffers: (offerId, token) => ( {
		url: `${ backend }/offers/getOffers?savedOfferId=${offerId}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	deleteOffers: (token) => ( {
		url: `${ backend }/offers/deleteOffers`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	deleteSavedOffer: (offerId, token) => ( {
		url: `${ backend }/offers/saved-offer?savedOfferId=${offerId}`,
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	deleteSavedOffers: (token) => ( {
		url: `${ backend }/offers/delete-saved-offers`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	deleteSessionOffer: (sessionId, offerId, token) => ( {
		url: `${ backend }/offers/delete-session-offer?sessionId=${sessionId}&offerId=${offerId}`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	deleteDraftOffers: (token) => ( {
		url: `${ backend }/offers/delete-draft-offers`,
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	getImportedSystems: (systemName, token) => ( {
		url: `${ backend }/imports/imported-systems?systemName=${systemName}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getImportedSpecialWalls: (systemName, structureLink, token) => ( {
		url: `${ backend }/imports/imported-special-walls?systemName=${systemName}&structureLink=${structureLink}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getAllThicknesses: ({systemName, height}, structureLink, token) => ( {
		url: `${ backend }/imports/thicknesses?systemName=${systemName}&structureLink=${structureLink}&height=${height}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getSoundInsulationValues: ({systemName, height}, structureLink, token) => ( {
		url: `${ backend }/imports/sound-insulation?systemName=${systemName}&structureLink=${structureLink}&height=${height}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getImportedPlatingSystems: (systemName, token) => ( {
		url: `${ backend }/imports/imported-systems-plating?systemName=${systemName}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getImportedNoisyPlatingSystems: (systemName, token) => ( {
		url: `${ backend }/imports/imported-systems-noisy-plating?systemName=${systemName}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	newOffer: token => ( {
		url: `${ backend }/offers/new-offer`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	getSavedOffers: token => ( {
		url: `${ backend }/offers/savedOffers`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	updateSavedOffer: (offerId, data, token) => ( {
		url: `${ backend }/offers/new-offer?savedOfferId=${offerId}`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateSavedPlatingOffer: (offerId, data, token) => ( {
		url: `${ backend }/offers/new-offer-plating?savedOfferId=${offerId}`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	downloadSavedOffer: (sessionId, offerId, token) => ( {
		url: `${ backend }/offers/download-offer/${sessionId}/${offerId}`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	downloadSession: (sessionId, token) => ( {
		url: `${ backend }/offers/download-session/${sessionId}`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	downloadReport: (data, token) => ( {
		url: `${ backend }/reports/download-report`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	downloadReport1: (data, token) => ( {
		url: `${ backend }/reports/download-report-1`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	downloadReport2: (data, token) => ( {
		url: `${ backend }/reports/download-report-2`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	downloadReport3: (data, token) => ( {
		url: `${ backend }/reports/download-report-3`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	downloadUsersReport: (token) => ( {
		url: `${ backend }/reports/download-users-report`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		}
	} ),
	saveSession: (token) => ( {
		url: `${ backend }/offers/save-session`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	saveDataSession: (data, token) => ( {
		url: `${ backend }/offers/save-data-session`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateDataSession: (data, token) => ( {
		url: `${ backend }/offers/update-data-session`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	updateOffersSession: (data, id, token) => ( {
		url: `${ backend }/offers/update-offers-session/?sessionId=${id}`,
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data,
	} ),
	getSessions: token => ( {
		url: `${ backend }/offers/sessions`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	getSession: (sessionId, token) => ( {
		url: `${ backend }/offers/get-session?sessionId=${sessionId}`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	getSystemCode: (data, token) => ( {
		url: `${ backend }/offers/system-code`,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
		data: data
	} ),
	deleteSavedSession: (sessionId, token) => ( {
		url: `${ backend }/offers/session?sessionId=${sessionId}`,
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
	getSystemsInfo: (token) => ( {
		url: `${ backend }/imports/get-info-systems`,
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${ token }`,
		},
	} ),
};