import React, { lazy, PureComponent, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import Header from '../Layout/Header/Header.jsx';
import Footer from '../Layout/Footer/Footer.jsx';
import AuthenticationHeader from '../Layout/Header/AuthenticationHeader.jsx';
import AuthenticationFooter from '../Layout/Footer/AuthenticationFooter.jsx';
import PageLoader from '../Templates/PageLoader.jsx';
import Homepage from '../Homepage/Homepage.jsx';
import Terms from '../Terms/Terms.jsx';
import AuthenticationRoute from '../Templates/AuthenticationRoute.jsx';
import RegularRoute from '../Templates/RegularRoute.jsx';
import { determineIfRouteIsActive } from '../../utils/utils.js';

// This will cause the suspense loader. If you want to prevent that loader, simply import those as you normally would.
const Login = lazy(() => import('../Authentication/Login.jsx'));
const Register = lazy(() => import('../Authentication/Register.jsx'));
const RequestResetPassword = lazy(() => import('../Authentication/RequestResetPassword.jsx'));
const NewPassword = lazy(() => import('../Authentication/NewPassword.jsx'));
const ConfirmAccount = lazy(() => import('../Authentication/ConfirmAccount.jsx'));
const AccountConfirmation = lazy(() => import('../Authentication/AccountConfirmation.jsx'));
const ResendConfirmAccount = lazy(() => import('../Authentication/ResendConfirmAccount.jsx'));
const Error404 = lazy(() => import('../Templates/Error404.jsx'));

class Public extends PureComponent {
	constructor(props) {
		super(props);

		const { location } = props;

		this.authenticationRoutes = [{
			path: '/login',
			component: Login,
			exact: true,
		}, {
			path: '/login/:passwordReset',
			component: Login,
			checkDynamicLocation: true,
		}, {
			path: '/register',
			component: Register,
		}, {
			path: '/reset-password/:resetPasswordId',
			component: NewPassword,
			checkDynamicLocation: true,
		}, {
			path: '/reset-password',
			component: RequestResetPassword,
			exact: true,
		}, {
			path: '/terms-and-conditions',
			component: Terms,
			exact: true,
		}, {
			path: '/confirm-account/:emailAddress',
			component: ConfirmAccount,
			checkDynamicLocation: true,
		}, {
			path: '/account-confirmation/:activationId',
			component: AccountConfirmation,
			checkDynamicLocation: true,
		}, {
			path: '/resend-confirm-account',
			component: ResendConfirmAccount,
		}, {
			path: '/',
			component: Homepage,
			exact: true,
		}];

		this.state = {
			isActive: determineIfRouteIsActive(this.authenticationRoutes, location),
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { location } = this.props;

		if (prevProps.location.pathname !== location.pathname) {
			this.setState({
				isActive: determineIfRouteIsActive(this.authenticationRoutes, location),
			});
		}
	}

	_renderAuthenticationHeaders = () => {
		const { loggedIn, } = this.props;

		return this.authenticationRoutes.map((route, i) => {
			if (route.path === '/') {
				return (
					<RegularRoute
						exact
						loggedIn={ loggedIn }
						path={ '/' }
						Component={ Header }/>
				);
			}

			return (
				<RegularRoute
					key={ i }
					loggedIn={ loggedIn }
					path={ route.path }
					Component={ AuthenticationHeader }/>
			);
		});
	};

	_renderAuthenticationFooters = () => {
		const { loggedIn } = this.props;

		return this.authenticationRoutes.map((route, i) => {
			if (route.path === '/') {
				return (
					<RegularRoute
						exact
						loggedIn={ loggedIn }
						path={ '/' }
						Component={ Footer }/>
				);
			}

			return (
				<RegularRoute
					key={ i }
					loggedIn={ loggedIn }
					path={ route.path }
					Component={ AuthenticationFooter }/>
			);
		});
	};

	_renderAuthenticationRoutes = () => {
		const { loggedIn } = this.props;

		return this.authenticationRoutes.map((route, i) => {
			if (route.path === '/') {
				return (
					<RegularRoute
						key={ i }
						loggedIn={ loggedIn }
						path={ route.path }
						exact={ route.exact }
						Component={ route.component }/>
				);
			}

			return (
				<AuthenticationRoute
					key={ i }
					loggedIn={ loggedIn }
					path={ route.path }
					exact={ route.exact }
					Component={ route.component }/>
			);
		});
	};

	render() {
		const { isActive } = this.state;

		if (!isActive) {
			return (
				<></>
			);
		}

		return (
			<>
				{/*Header*/ }
				<Switch>
					{ this._renderAuthenticationHeaders() }
				</Switch>
				{/*Main section content*/ }
				<main className='main'>
					<Suspense fallback={ <PageLoader/> }>
						{ this._renderAuthenticationRoutes() }
					</Suspense>
				</main>
				{/*Footer*/ }
				<Switch>
					{ this._renderAuthenticationFooters() }
				</Switch>
			</>
		);
	}
}

export default Public;