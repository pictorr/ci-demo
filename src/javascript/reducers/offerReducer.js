import cloneDeep from 'lodash/cloneDeep';
import { sortArray } from '../utils/utils';

export default function offerReducer(state = cloneDeep(defaultState), action) {
	let newState = cloneDeep(state);
	switch(action.type) {
		case 'GET_OFFER': {
			newState.fetchingOffer = true;
			newState.fetchingOfferError = '';
			return newState;
		}
		case 'GET_OFFER_FROM_SESSION_FULFILLED': {
			newState.fetchingOffer = false;
			newState.offer = action.payload;
			return newState;
		}
		case 'GET_OFFER_SESSION_FULFILLED': {
			let findOffer = action.payload.userSavedOffers.filter(thisOffer => thisOffer._id === action.payload.offerId);
			newState.offer = findOffer[0];
			return newState;
		}
		case 'GET_OFFER_FULFILLED': {
			newState.fetchingOffer = false;
			newState.offer = action.payload.offer;
			return newState;
		}
		case 'GET_OFFER_REJECTED': {
			newState.fetchingOffer = false;
			newState.fetchingOfferError = action.payload.error;
			return newState;
		}
		case 'GET_SAVED_OFFERS': {
			newState.fetchingSavedOffer = true;
			newState.fetchingSavedOfferError = '';
			return newState;
		}
		case 'GET_SAVED_OFFERS_FULFILLED': {
			newState.fetchingSavedOffer = false;
			newState.userSavedOffers = sortArray(action.payload.userSavedOffers, 'createdAt', 'DESC');
			return newState;
		}
		case 'GET_SAVED_OFFERS_REJECTED': {
			newState.fetchingSavedOffer = false;
			newState.fetchingSavedOfferError = action.payload.error;
			return newState;
		}
		case 'UPDATE_SAVED_OFFERS': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'UPDATE_SAVED_OFFERS_FULFILLED': {
			newState.fetchingOffers = false;
			return newState;
		}
		case 'UPDATE_SAVED_OFFERS_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'UPDATE_OFFER': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'UPDATE_OFFER_FULFILLED': {
			newState.fetchingOffers = false;
			return newState;
		}
		case 'UPDATE_OFFER_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'GET_CURRENT_OFFER': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'GET_CURRENT_OFFER_FULFILLED': {
			newState.fetchingOffers = false;
			newState.savedOffer = action.payload.offerList.savedOffer;
			return newState;
		}
		case 'GET_CURRENT_OFFER_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'GET_OFFERS': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'GET_OFFERS_FULFILLED': {
			newState.fetchingOffers = false;
			newState.offers = action.payload.offers;

			return newState;
		}
		case 'GET_OFFERS_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'GET_SESSIONS': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'GET_SESSIONS_FULFILLED': {
			newState.fetchingOffers = false;
			newState.sessions = action.payload.sessions;
			return newState;
		}
		case 'GET_SESSIONS_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'SAVE_OFFER': {
			newState.savingOffer = true;
            newState.savingOfferError = '';
			return newState;
		}
		case 'SAVE_OFFER_FULFILLED': {
			newState.savingOffer = false;
			newState.savedOffer = true;
			return newState;
		}
		case 'SAVE_OFFER_REJECTED': {
			newState.savingOffer = false;
			newState.savingOfferError = action.payload.error;
			return newState;
		}
		case 'DELETE_OFFER': {
			newState.deletingOffer = true;
			newState.deletedOffer = false;
			return newState;
		}
		case 'DELETE_OFFER_FULFILLED': {
			newState.deletingOffer = false;
			newState.deletedOffer = true;
			newState.offer = newState.offer.filter(offer => offer.id !== action.payload.offerId);
			return newState;
		}
		case 'DELETE_OFFER_REJECTED': {
			newState.deletingOffer = false;
			newState.deletingOfferError = action.payload.error;
			return newState;
		}
		case 'DELETE_SAVED_OFFER': {
			newState.deletingOffer = true;
			newState.deletedOffer = false;
			return newState;
		}
		case 'DELETE_SESSION': {
			newState.deletingSession = true;
			newState.deletedSession = false;
			return newState;
		}
		case 'DELETE_SESSION_FULFILLED': {
			newState.deletingSession = false;
			newState.deletedSession = true;
			newState.sessions = newState.sessions.filter(session => session._id !== action.payload.sessionId);
			return newState;
		}
		case 'DELETE_SESSION_REJECTED': {
			newState.deletingSession = false;
			newState.deletingSessionError = action.payload.error;
			return newState;
		}
		case 'DELETE_SAVED_OFFER_FULFILLED': {
			newState.deletingOffer = false;
			newState.deletedOffer = true;
			newState.userSavedOffers = newState.userSavedOffers.filter(offer => offer._id !== action.payload.offerId);
			return newState;
		}
		case 'DELETE_SAVED_OFFER_REJECTED': {
			newState.deletingOffer = false;
			newState.deletingOfferError = action.payload.error;
			return newState;
		}
		case 'DOWNLOAD_OFFER': {
			newState.downloadingOffer = true;
			newState.downloadedOffer = false;
			newState.downloadingOfferError = '';
			return newState;
		}
		case 'DOWNLOAD_OFFER_FULFILLED': {
			newState.downloadingOffer = false;
			newState.downloadedOffer = true;
			newState.fileName = action.payload.fileName;
			return newState;
		}
		case 'DOWNLOAD_OFFER_REJECTED': {
			newState.downloadingOffer = false;
			newState.downloadingOfferError = action.payload.error;
			return newState;
		}
		case 'DOWNLOAD_SESSION': {
			newState.downloadingSession = true;
			newState.downloadedSession = false;
			newState.downloadingSessionError = '';
			return newState;
		}
		case 'DOWNLOAD_SESSION_FULFILLED': {
			newState.downloadingSession = false;
			newState.downloadedSession = true;
			newState.fileName = action.payload.fileName;
			return newState;
		}
		case 'DOWNLOAD_SESSION_REJECTED': {
			newState.downloadingSession = false;
			newState.downloadingSessionError = action.payload.error;
			return newState;
		}
		case 'SAVE_SESSION': {
			newState.fetchingOffers = true;
			newState.fetchingOffersError = '';
			return newState;
		}
		case 'SAVE_SESSION_FULFILLED': {
			newState.fetchingOffers = false;
			return newState;
		}
		case 'SAVE_SESSION_REJECTED': {
			newState.fetchingOffers = false;
			newState.fetchingOffersError = action.payload.error;
			return newState;
		}
		case 'RESET_DELETE_SESSION': {
			newState.deletingSession = false;
			newState.deletedSession = false;
			newState.deletingSessionError = '';
			return newState;
		}
		case 'RESET_DELETE_SAVED_OFFER': {
			newState.deletingOffer = false;
			newState.deletedOffer = false;
			newState.deletingOfferError = '';
			return newState;
		}
		case 'RESET_OFFER': {
			newState.savingOffer = false;
			newState.savedOffer = false;
			newState.savingOfferError = '';
			newState.fetchingOffer = '';
			newState.fetchingOfferError = '';
			newState.offer = cloneDeep(Offer);
			return newState;
		}
		case 'RESET_DELETE_OFFER': {
			newState.deletingOffer = false;
			newState.deletedOffer = false;
			newState.deletingOfferError = '';
			return newState;
		}
		case 'GET_SYSTEM_CODE': {
			newState.fetchingSystemCode = true;
			newState.fetchedSystemCode = false;
			newState.fetchingSystemCodeError = '';
			return newState;
		}
		case 'GET_SYSTEM_CODES_OFFER_FULFILLED': {
			newState.fetchingSystemCode = false;
			newState.fetchedSystemCode = true;
			if(action.payload) {
				action.payload.res.data.filter(system => system?.protectionSense?.toString() === action.payload.protectionSense?.toString() || action.payload.protectionSense === 'Oricare').forEach(system => {
					newState.systemCode = {...newState.systemCode, [system.systemCode]:{...system, used: false}};
				})
			}
			return newState;
		}
		case 'GET_SYSTEM_CODE_REJECTED': {
			newState.fetchingSystemCode = false;
			newState.fetchedSystemCode = false;
			newState.fetchingSystemCodeError = action.payload.error;
			return newState;
		}
		case 'RESET_SYSTEM_CODE': {
			newState.fetchingSystemCode = false;
			newState.fetchedSystemCode = false;
			newState.systemCode = {...defaultState.systemCode};
			return newState;
		}
		case 'RESET_EVERYTHING': {
			return {
				...defaultState
			};
		}
		default:
			return newState;
	}
}

const offer = {
    id: '',
    height: 0,
    fireResistance: 0,
    profileType: "",
    moistureResistance: "",
    soundInsulation: "",
	support: "",
	price: "",
	consumption: "",
    plate: {
		face1: {
			plate1: "",
			plate2: "",
			plate3: "",
		},
		face2: {
			plate1: "",
			plate2: "",
			plate3: "",
		},
	}
};

const defaultState = {
	fetchedSystemCode: false,
	fetchingOffers: true,
	fetchingOffersError: '',
	savingOffer: false,
	savingOfferError: '',
	fetchingOffer: false,
	fetchingOfferError: '',
	offer: cloneDeep(offer),
	offerList: {},
	savedOffer: {},
	offers: [],
	userSavedOffers: [],
	sessions: [],
	systemCode: {},
	deletingOffer: false,
	deletedOffer: false,
	deletingOfferError: '',
	downloadingOffer: false,
	downloadingOfferError: '',
	downloadedOffer: false,
	downloadingSession: false,
	downloadingSessionError: '',
	downloadedSession: false,
	deletingSession: false,
	deletingSessionError: '',
	fileName: ''
};