import React, { lazy, PureComponent, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../Layout/Header/Header.jsx';
import Footer from '../Layout/Footer/Footer.jsx';
import PageLoader from '../Templates/PageLoader.jsx';
import Homepage from '../Homepage/Homepage.jsx';
import RegularRoute from '../Templates/RegularRoute.jsx';
import { determineIfRouteIsActive } from '../../utils/utils.js';

// This will cause the suspense loader. If you want to prevent that loader, simply import those as you normally would.
const Dinosaurs = lazy(() => import('../Dinosaurs/DinosaursList.jsx'));
const Users = lazy(() => import('../UserManagement/UsersList'));
const Reports = lazy(() => import('../Reports/Reports'));
const CreateAndUpdateDinosaurs = lazy(() => import('../Dinosaurs/CreateAndUpdateDinosaurs/CreateAndUpdateDinosaurs.jsx'));
const Dinosaur = lazy(() => import('../Dinosaurs/Dinosaur.jsx'));
const SessionsRouter = lazy(() => import('../Sessions/SessionsRouter.jsx'));
const DataForm = lazy(() => import('../Sessions/DataForm.jsx'));
const SavedOffers = lazy(() => import('../SavedOffers/SavedOffers.jsx'));
const CreateOffersRouter = lazy(() => import('../Offers/CreateAndUpdateOffer/CreateOffersRouter.jsx'));
const CreateOffers2Router = lazy(() => import('../Offers/CreateAndUpdateOffer/CreateOffers2Router.jsx'));
const CreateOffers3Router = lazy(() => import('../Offers/CreateAndUpdateOffer/CreateOffers3Router.jsx'));
const UpdateOffersRouter = lazy(() => import('../Offers/CreateAndUpdateOffer/UpdateOffersRouter.jsx'));
const UpdateOffers2Router = lazy(() => import('../Offers/CreateAndUpdateOffer/UpdateOffers2Router.jsx'));
const ExcelImport = lazy(() => import('../ExcelImports/ExcelImport.jsx'));
const EditAccount = lazy(() => import('../Authentication/EditAccount.jsx'));
const Error404 = lazy(() => import('../Templates/Error404.jsx'));

class Private extends PureComponent {
	constructor(props) {
		super(props);

		const { location } = props;

		this.privateRoutes = [{
			path: '/private/dinosaurs',
			component: Dinosaurs,
			exact: true,
		}, {
			path: '/private/reports',
			component: Reports,
		},   {
			path: '/private/users',
			component: Users,
		}, {
			path: '/private/account',
			component: EditAccount,
		},  {
			path: '/private/dinosaurs/new-dinosaur',
			component: CreateAndUpdateDinosaurs,
		}, {
			path: '/private/dinosaurs/edit-dinosaur/:dinosaurId',
			component: CreateAndUpdateDinosaurs,
		}, {
			path: '/private/dinosaurs/dinosaur/:dinosaurId',
			component: Dinosaur,
		}, {
			path: '/private/imports',
			component: ExcelImport,
			exact: true,
		}, {
			path: '/private/sessions',
			component: SessionsRouter,
			exact: true,
		}, {
			path: '/private/create-new-offer/:offerId',
			component: CreateOffers3Router,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/edit/:id/offers/edit-offer/:offerId',
			component: UpdateOffers2Router,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/edit/:id/offers/new-offer/:offerId',
			component: CreateOffers2Router,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/:id/offers/edit-offer/:offerId',
			component: UpdateOffersRouter,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/:id/offers/new-offer/:offerId',
			component: CreateOffersRouter,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/:id/offers/view/:offerDetailsId',
			component: CreateOffersRouter,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/edit/:id/offers/view/:offerDetailsId',
			component: UpdateOffers2Router,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/edit/:id/offers',
			component: SavedOffers,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/:id/offers',
			component: SavedOffers,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/edit/:id',
			component: DataForm,
			checkDynamicLocation: true,
		}, {
			path: '/private/sessions/session/:id',
			component: DataForm,
			checkDynamicLocation: true,
		}, {
			path: '/private/',
			component: Error404,
			checkDynamicLocation: true,
		}];

		this.state = {
			isActive: determineIfRouteIsActive(this.privateRoutes, location),
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { location } = this.props;

		if (prevProps.location.pathname !== location.pathname) {
			this.setState({
				isActive: determineIfRouteIsActive(this.privateRoutes, location),
			});
		}
	}

	_renderPrivatePageHeader = () => {
		const { loggedIn, } = this.props;

		return this.privateRoutes.map((route, i) => (
			<RegularRoute
				key={ i }
				loggedIn={ loggedIn }
				path={ route.path }
				Component={ Header }/>
		));
	};

	_renderPrivatePageFooter = () => {
		const { loggedIn } = this.props;

		return this.privateRoutes.map((route, i) => (
			<RegularRoute
				key={ i }
				loggedIn={ loggedIn }
				path={ route.path }
				Component={ Footer }/>
		));
	};

	_renderPrivateRoutes = () => {
		const { loggedIn } = this.props;

		return this.privateRoutes.map((route, i) => (
			<RegularRoute
				key={ i }
				loggedIn={ loggedIn }
				path={ route.path }
				exact={ route.exact }
				Component={ route.component }/>
		));
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
					{ this._renderPrivatePageHeader() }
				</Switch>
				{/*Main section content*/ }
				<main className='main'>
					<Suspense fallback={ <PageLoader/> }>
				<Switch>
						{ this._renderPrivateRoutes() }
						<Route exact path={ '/' } component={ Homepage }/>
				</Switch>
					</Suspense>
				</main>
				{/*Footer*/ }
				<Switch>
					{ this._renderPrivatePageFooter() }
				</Switch>
			</>
		);
	}
}
export default Private;