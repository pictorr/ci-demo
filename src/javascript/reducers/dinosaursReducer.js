import cloneDeep from 'lodash/cloneDeep';
import { foodChoices } from '../utils/constants.js';

export default function dinosaursReducer(state = cloneDeep(defaultState), action) {
	let newState = cloneDeep(state);
	switch(action.type) {
		case 'GET_DINOSAURS': {
			newState.fetchingDinosaurs = true;
			newState.fetchingDinosaursError = '';
			return newState;
		}
		case 'GET_DINOSAURS_FULFILLED': {
			newState.fetchingDinosaurs = false;
			newState.dinosaurs = action.payload.dinosaurs;
			return newState;
		}
		case 'GET_DINOSAURS_REJECTED': {
			newState.fetchingDinosaurs = false;
			newState.fetchingDinosaursError = action.payload.error;
			return newState;
		}
		case 'UPDATE_DINOSAUR':
		case 'SAVE_DINOSAUR': {
			newState.savingDinosaur = true;
			newState.savingDinosaurError = '';
			return newState;
		}
		case 'UPDATE_DINOSAUR_FULFILLED':
		case 'SAVE_DINOSAUR_FULFILLED': {
			newState.savingDinosaur = false;
			newState.savedDinosaur = true;
			return newState;
		}
		case 'UPDATE_DINOSAUR_REJECTED':
		case 'SAVE_DINOSAUR_REJECTED': {
			newState.savingDinosaur = false;
			newState.savingDinosaurError = action.payload.error;
			return newState;
		}
		case 'GET_DINOSAUR': {
			newState.fetchingDinosaur = true;
			return newState;
		}
		case 'GET_DINOSAUR_FULFILLED': {
			newState.fetchingDinosaur = false;
			newState.dinosaur = action.payload.dinosaur;
			return newState;
		}
		case 'GET_DINOSAUR_REJECTED': {
			newState.fetchingDinosaur = false;
			newState.fetchingDinosaurError = action.payload.error;
			return newState;
		}
		case 'DELETE_DINOSAUR': {
			newState.deletingDinosaur = true;
			newState.deletedDinosaur = false;
			return newState;
		}
		case 'DELETE_DINOSAUR_FULFILLED': {
			newState.deletingDinosaur = false;
			newState.deletedDinosaur = true;
			newState.dinosaurs = newState.dinosaurs.filter(dinosaur => dinosaur.id !== action.payload.dinosaurId);
			return newState;
		}
		case 'DELETE_DINOSAUR_REJECTED': {
			newState.deletingDinosaur = false;
			newState.deletingDinosaurError = action.payload.error;
			return newState;
		}
		case 'RESET_DINOSAUR': {
			newState.savingDinosaur = false;
			newState.savedDinosaur = false;
			newState.savingDinosaurError = '';
			newState.fetchingDinosaur = '';
			newState.fetchingDinosaurError = '';
			newState.dinosaur = cloneDeep(dinosaur);
			return newState;
		}
		case 'RESET_DELETE_DINOSAUR': {
			newState.deletingDinosaur = false;
			newState.deletedDinosaur = false;
			newState.deletingDinosaurError = '';
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

const dinosaur = {
	id: '',
	species: '',
	foodPreference: foodChoices?.[0],
	wikipediaPage: '',
	averageSize: '',
	image: '',
};

const defaultState = {
	fetchingDinosaurs: true,
	fetchingDinosaursError: '',
	dinosaurs: [],
	savingDinosaur: false,
	savedDinosaur: false,
	savingDinosaurError: '',
	fetchingDinosaur: false,
	fetchingDinosaurError: '',
	dinosaur: cloneDeep(dinosaur),
	deletingDinosaur: false,
	deletedDinosaur: false,
	deletingDinosaurError: ''
};