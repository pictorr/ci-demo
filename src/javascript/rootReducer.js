import { combineReducers } from 'redux';
import authenticationReducer from './reducers/authenticationReducer.js';
import dinosaursReducer from './reducers/dinosaursReducer.js';
import usersReducer from './reducers/usersReducer.js';
import offerReducer from './reducers/offerReducer.js';
import sessionReducer from './reducers/sessionReducer.js';
import importsReducer from './reducers/importsReducer.js';
import reportsReducer from './reducers/reportsReducer.js';

export const createRootReducer = () => combineReducers({
	authentication: authenticationReducer,
	dinosaurs: dinosaursReducer,
	users: usersReducer,
	offer: offerReducer,
	session: sessionReducer,
	imports: importsReducer,
	reports: reportsReducer,
});
