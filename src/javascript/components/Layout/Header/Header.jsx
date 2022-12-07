import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LoggedInMenu from './LoggedInMenu.jsx';
import { AppContext } from '../../../AppContext.jsx';
import GuestMenu from './GuestMenu.jsx';
import Logo from '../../Templates/Logo.jsx';
import Link from '@material-ui/core/Link';
import { newOffer } from '../../../actions/offerActions.js';
import { connect } from 'react-redux';
import LanguageSelect from './LanguageSelect.js';

class Header extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			currentPage: 'home'
		}
	}

	componentDidMount() {
		const { match, dispatch } = this.props;

		let promises = [];

		let pageName = 'home';

		if (match?.path?.includes('reports')) {
			pageName = "reports"
		}
		if (match?.path?.includes('users')) {
			pageName = "users"
		}
		if (match?.path?.includes('imports')) {
			pageName = "imports"
		}
		if (match?.path?.includes('sessions')) {
			pageName = "sessions"
		}
		if (match?.path?.includes('account')) {
			pageName = "account"
		}
		if (match?.path?.includes('logout')) {
			pageName = "logout"
		}
		if (match?.path?.includes('create-new-offer')) {
			pageName = "createOffer";
		}

		return Promise.all(promises).then(() => {
			dispatch(newOffer(offerId => {
				this.setState({
					offerId: offerId,
					currentPage: pageName
				})
			}));
		})
	}

	_changeLanguage = newLanguage => () => {
		const { i18n } = this.props;

		i18n.changeLanguage(newLanguage);
		// You might also want to reload in order to fetch data in the new language?
		window.location.reload();
	};

	_onLogout = () => {
		const { client } = this.context;

		client.emit('LOGOUT');
	};

	_onPrint = () => {
		window.print();
	}

	render() {
		const { loggedIn, t } = this.props;
		const { currentPage, offerId } = this.state;

		return (
			<div>
				<Logo
					t={t}
					currentPage={currentPage}
					loggedIn={loggedIn}
					history={this.props.history}
					onLogout={this._onLogout}
					onPrint={this._onPrint}
					offerId={offerId}
				/>
				<AppBar className="meniu-bar-style" position="relative">
					<Toolbar>
						<Link
							href='/'
							className="ml-37 text-color-toolbar"
						>
							{t('home')}
						</Link>
						{process.env.REACT_APP_ENABLE_INTL === 'true' && currentPage === 'home' && !loggedIn &&
							<LanguageSelect />
						}

						{loggedIn &&
							<Link
								className="text-color-toolbar"
								onClick={this._onPrint}
							>
								{t('print')}
							</Link>
						}

						<div className='header-spacing' />
						{loggedIn ?
							<LoggedInMenu onLogout={this._onLogout} currentPage={currentPage} offerId={offerId} />
							:
							<GuestMenu t={t} />
						}

					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Header.contextType = AppContext;

const mapStateToProps = store => ({
	offer: store.offer,
	session: store.session
});

export default withTranslation()(connect(mapStateToProps)(Header));