import cloneDeep from 'lodash/cloneDeep';

export default function sessionReducer(state = cloneDeep(defaultState), action) {
	let newState = cloneDeep(state);
	switch(action.type) { 
		case 'GET_DATA_SESSION': {
			newState.fetchingSessions = true;
			newState.fetchingSessionsError = '';
			return newState;
		}
		case 'GET_DATA_SESSION_FULFILLED': {
			newState.fetchingSessions = false;
			newState.session = action.payload;
			return newState;
		}
		case 'GET_DATA_SESSION_REJECTED': {
			newState.fetchingSessions = false;
			newState.fetchingSessionsError = action.payload.error;
			return newState;
		}
		case 'GET_SESSIONS': {
			newState.fetchingSessions = true;
			newState.fetchingSessionsError = '';
			return newState;
		}
		case 'GET_SESSIONS_FULFILLED': {
			newState.fetchingSessions = false;
			newState.sessions = action.payload.sessions;
			return newState;
		}
		case 'GET_SESSIONS_REJECTED': {
			newState.fetchingSessions = false;
			newState.fetchingSessionsError = action.payload.error;
			return newState;
		}
		case 'SAVE_SESSION': {
			newState.fetchingSessions = true;
			newState.fetchingSessionsError = '';
			return newState;
		}
		case 'SAVE_SESSION_FULFILLED': {
			newState.fetchingSessions = false;
			return newState;
		}
		case 'SAVE_SESSION_REJECTED': {
			newState.fetchingSessions = false;
			newState.fetchingSessionsError = action.payload.error;
			return newState;
		}
		case 'DELETE_SESSION_OFFER': {
			newState.deletingSessionOffer = true;
			newState.deletedSessionOffer = false;
			return newState;
		}
		case 'DELETE_SESSION_OFFER_FULFILLED': {
			newState.deletingSessionOffer = false;
			newState.deletedSessionOffer = true;
			return newState;
		}
		case 'DELETE_SESSION_OFFER_REJECTED': {
			newState.deletingSessionOffer = false;
			newState.deletingSessionOfferError = action.payload.error;
			return newState;
		}
		case 'RESET_DELETE_SESSION_OFFER': {
			newState.deletingSessionOffer = false;
			newState.deletedSessionOffer = false;
			newState.deletingSessionOfferError = '';
			return newState;
		}
		case 'RESET_DELETE_SESSION': {
			newState.deletingSession = false;
			newState.deletedSession = false;
			newState.deletingSessionError = '';
			return newState;
		}
		case 'RESET_DELETE_SAVED_session': {
			newState.deletingsession = false;
			newState.deletedsession = false;
			newState.deletingsessionError = '';
			return newState;
		}
		case 'RESET_session': {
			newState.savingsession = false;
			newState.savedsession = false;
			newState.savingsessionError = '';
			newState.fetchingsession = '';
			newState.fetchingsessionError = '';
			newState.session = cloneDeep(session);
			return newState;
		}
		case 'RESET_DELETE_session': {
			newState.deletingsession = false;
			newState.deletedsession = false;
			newState.deletingsessionError = '';
			return newState;
		}
		case 'GET_SYSTEM_CODE': {
			newState.fetchingSystemCode = true;
			newState.fetchedSystemCode = false;
			newState.fetchingSystemCodeError = '';
			return newState;
		}
		case 'GET_SYSTEM_CODE_FULFILLED': {
			newState.fetchingSystemCode = false;
			newState.fetchedSystemCode = true;
			if(action.payload) {
				action.payload.res.data.forEach(system => {
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
		case 'SAVE_OFFERS_SESSION': {
			newState.offers = action.payload.offersSession;
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

const session = {
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
	fetchingSessions: true,
	fetchingSessionsError: '',
	savingsession: false,
	savingsessionError: '',
	fetchingsession: false,
	fetchingsessionError: '',
	deletingsession: false,
	deletedsession: false,
	deletingsessionError: '',
	deletingSession: false,
	deletingSessionError: '',
	fileName: ''
};