import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PageLoader from './components/Templates/PageLoader.jsx';
import { colours } from './utils/colours.js';
import { validateToken } from './actions/authenticationActions.js';
import { getItemFromStorage, removeItemFromStorage } from './utils/utils.js';
import ProtectedRoute from './components/Templates/ProtectedRoute.jsx';
import RegularRoute from './components/Templates/RegularRoute.jsx';
import { AppContext } from './AppContext.jsx';
import EventEmitter from '../javascript/utils/EventEmitter.js';

const client = new EventEmitter();

const Public = lazy(() => import('./components/Routers/Public.jsx'));
const Private = lazy(() => import('./components/Routers/Private.jsx'));

const theme = createTheme({
	palette: {
		primary: {
			main: colours.blue,
			dark: colours.darkBlue,
		},
		secondary: {
			main: colours.blue,
			dark: colours.darkBlue,
		},
	},
});

class Index extends Component {
	constructor(props) {
		super(props);

		// loggedIn from this component is used throughout the application.
		// Do not duplicate it in a reducer as it will not work as expected.
		this.state = {
			checkingCredentials: true,
			loggedIn: false,
			accountActivationPage: false
		};

		this.appContext = {
			client: client,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const token = getItemFromStorage('token');


		if (location.pathname.includes('/account-confirmation')) {
			this.setState({
				accountActivationPage: true
			});
		} else if (token) {
			validateToken(token, dispatch)
				.then(valid => {
					// <ProtectedRoute/> will handle redirects in case the token is invalid
					this.setState({
						loggedIn: valid,
						checkingCredentials: false,
					});
				});
		} else {
			this.setState({
				checkingCredentials: false,
			});
		}
		this.appContext.client.subscribe('LOGGED_IN', this._onLoginListener);
		this.appContext.client.subscribe('LOGOUT', this._logoutListener);
	}

	_onLoginListener = payload => {
		const { callback } = payload;

		this.setState({
			loggedIn: true,
			checkingCredentials: false,
		}, callback);
	};

	_logoutListener = () => {
		removeItemFromStorage('token');
		this.setState({
			loggedIn: false,
		});
	};

	componentDidUpdate(prevProps) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			window.scroll(0, 0);
		}
	}

	componentWillUnmount() {
		this.appContext.client.unsubscribe('LOGGED_IN', this._onLoginListener);
		this.appContext.client.unsubscribe('LOGOUT', this._logoutListener);
	}

	_renderRoute = Component => props => {
		const { loggedIn } = this.state;

		return (
			<Component
				{ ...props }
				loggedIn={ loggedIn }/>
		);
	};

	render() {
		const { loggedIn, checkingCredentials, accountActivationPage } = this.state;

		return (
			<AppContext.Provider value={ this.appContext }>
				<ThemeProvider theme={ theme }>
					<CssBaseline/>
					<Suspense fallback={ <PageLoader/> }>
						<Switch>
							{ checkingCredentials ?
								null
								:
								<>
									<ProtectedRoute
										loggedIn={ loggedIn }
										path={ '/private' }
										Component={ Private }/>
									<Route
										path={ '/' }
										render={ this._renderRoute(Public) }/>
								</>
							}
							{accountActivationPage ?
								<>
									<RegularRoute
										path={ '/account-confirmation' }
										Component={ Public }/>
								</>
								: null
							}
						</Switch>
					</Suspense>
				</ThemeProvider>
			</AppContext.Provider>
		);
	}
}

const mapStateToProps = store => ( {
	authentication: store.authentication
} );

export default withRouter(connect(mapStateToProps)(Index));
