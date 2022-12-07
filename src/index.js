import React from 'react';
import ReactDOM from 'react-dom';
import Index from './javascript';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import generateNewStore from './javascript/store.js';
import 'react-datepicker/dist/react-datepicker.css';
import './i18n';

const store = generateNewStore();
const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
	ReactDOM.hydrate(<Provider store={ store }>
		<BrowserRouter>
			<Index/>
		</BrowserRouter>
	</Provider>, rootElement);
} else {
	ReactDOM.render(<Provider store={ store }>
		<BrowserRouter>
			<Index/>
		</BrowserRouter>
	</Provider>, rootElement);
}