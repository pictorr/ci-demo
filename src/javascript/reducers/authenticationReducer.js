import cloneDeep from 'lodash/cloneDeep';
import {setItemInStorage} from "../utils/utils";

export default function authenticationReducer(state = cloneDeep(defaultState), action) {
	let newState = cloneDeep(state);
	switch(action.type) {
		case 'ON_REGISTER': {
			newState.registering = true;
			newState.registerError = '';
			return newState;
		}
		case 'ON_REGISTER_FULFILLED':
		case 'RESET_REGISTER': {
			newState.registering = false;
			newState.registerError = '';
			return newState;
		}
		case 'ON_REGISTER_REJECTED': {
			newState.registering = false;
			newState.registerError = action.payload.error;
			return newState;
		}
		case 'ON_LOGIN': {
			newState.logginIn = true;
			newState.loginError = '';
			return newState;
		}
		case 'ON_LOGIN_FULFILLED': {
			setItemInStorage('isAdmin', action.payload.isAdmin);
			setItemInStorage('functionalitiesAccess', action.payload.functionalitiesAccess);
			setItemInStorage('isMasterAdmin', action.payload.isMasterAdmin);
			setItemInStorage('userId', action.payload.id);
			setItemInStorage('language', action.payload.language);
			setItemInStorage('country', action.payload.country);
			newState.logginIn = false;
			newState.token = action.payload.token;
			newState.loginError = '';
			return newState;
		}
		case 'ON_LOGIN_REJECTED': {
			newState.logginIn = false;
			newState.loginError = action.payload.error;
			return newState;
		}
		case 'RESET_LOGIN': {
			newState.logginIn = false;
			newState.loginError = '';
			return newState;
		}
		case 'RESEND_MAIL_CONFIRMATION': {
			newState.resendingConfirmAccount = true;
			newState.resendingConfirmAccountError = '';
			return newState;
		}
		case 'RESEND_MAIL_CONFIRMATION_FULFILLED':
		case 'RESET_RESEND_CONFIRM_ACCOUNT': {
			newState.resendingConfirmAccount = false;
			newState.resendingConfirmAccountError = '';
			return newState;
		}
		case 'RESEND_MAIL_CONFIRMATION_REJECTED': {
			newState.resendingConfirmAccount = false;
			newState.resendingConfirmAccountError = action.payload.error;
			return newState;
		}
		case 'CONFIRM_ACCOUNT': {
			newState.confirmingAccount = true;
			newState.confirmingAccountError = '';
			return newState;
		}
		case 'CONFIRM_ACCOUNT_FULFILLED':
		case 'RESET_CONFIRM_ACCOUNT': {
			newState.confirmingAccount = false;
			newState.confirmingAccountError = '';
			return newState;
		}
		case 'CONFIRM_ACCOUNT_REJECTED': {
			newState.confirmingAccount = false;
			newState.confirmingAccountError = action.payload.error;
			return newState;
		}
		case 'RESET_PASSWORD': {
			newState.resettingPassword = true;
			newState.resetPassword = false;
			newState.resettingPasswordError = '';
			return newState;
		}
		case 'RESET_PASSWORD_FULFILLED': {
			newState.resettingPassword = false;
			newState.resetPassword = true;
			newState.resettingPasswordError = '';
			return newState;
		}
		case 'RESET_PASSWORD_REJECTED': {
			newState.resettingPassword = false;
			newState.resetPassword = false;
			newState.resettingPasswordError = action.payload.error;
			return newState;
		}
		case 'RESET_RESET_PASSWORD': {
			newState.resettingPassword = false;
			newState.resetPassword = false;
			newState.resettingPasswordError = '';
			return newState;
		}
		case 'SAVE_PASSWORD': {
			newState.savingPassword = true;
			newState.savedPassword = false;
			newState.savingPasswordError = '';
			return newState;
		}
		case 'SAVE_PASSWORD_FULFILLED': {
			newState.savingPassword = false;
			newState.savedPassword = true;
			newState.savingPasswordError = '';
			return newState;
		}
		case 'SAVE_PASSWORD_REJECTED': {
			newState.savingPassword = false;
			newState.savedPassword = false;
			newState.savingPasswordError = action.payload.error;
			return newState;
		}
		case 'RESET_SAVE_PASSWORD': {
			newState.savingPassword = false;
			newState.savedPassword = false;
			newState.savingPasswordError = '';
			return newState;
		}
		case 'CHECKED_CREDENTIALS': {
			newState.checkedCredentials = true;
			return newState;
		}
		case 'SET_TOKEN': {
			newState.token = action.payload.token;
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

const defaultState = {
	token: '',
	id:'',
	registering: false,
	registerError: '',
	loggingIn: false,
	loginError: '',
	resendingConfirmAccount: false,
	resendingConfirmAccountError: '',
	confirmingAccountError: '',
	confirmingAccount: false,
	resettingPassword: false,
	resetPassword: false,
	resettingPasswordError: '',
	savingPassword: false,
	savedPassword: false,
	savingPasswordError: '',
	checkedCredentials: false,
};