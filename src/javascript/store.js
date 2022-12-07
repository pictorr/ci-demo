import { applyMiddleware, createStore } from 'redux';
import { createRootReducer } from './rootReducer.js';
import thunk from 'redux-thunk';

let generateNewStore;

if (process.env.NODE_ENV === 'development') {
	const { composeWithDevTools } = require('redux-devtools-extension');
	generateNewStore = () => {
		return createStore(
			createRootReducer(),
			composeWithDevTools(
				applyMiddleware(thunk),
			),
		);
	};
} else {
	generateNewStore = () => {
		return createStore(
			createRootReducer(),
			applyMiddleware(thunk),
		);
	};
}

export default generateNewStore;
