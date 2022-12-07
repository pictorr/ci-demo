import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { getItemFromStorage } from "../../utils/utils";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PrintIcon from '@material-ui/icons/Print';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

class Logo extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dropdown: false,
			isAdmin: false,
			isMasterAdmin: false
		}
	}

	componentDidMount() {
		if (getItemFromStorage('isAdmin') === 'true') {
			this.setState({
				isAdmin: true
			});
		}
		if (getItemFromStorage('isMasterAdmin') === 'true') {
			this.setState({
				isMasterAdmin: true
			});
		}
	}


	_openDropdown = () => {
		this.setState({
			dropdown: !this.state.dropdown,
		})
	}

	_onClick = () => {
		const { history } = this.props;
        history.push('/');
	}

	_chooseClassname = (name) => {
		const { currentPage } = this.props;
		return currentPage === name ? 'toolbar-hamburger-1' : 'toolbar-hamburger-2'
	}

	render() {
		const { onLogout, onPrint, offerId, t } = this.props;
		const { dropdown, isAdmin, isMasterAdmin } = this.state;

		return (
			<div className="logoInPage">
				<div className="flex-jb">
					<img onClick={this._onClick} className="logo-size cursor-pointer" src={'/images/siniat-logo.svg'}></img>
					<div className="flex-center items-center app-bar-items">
						<div className='flex-center items-center print-button-style icon-button'>
							<PrintIcon onClick={onPrint} />
						</div>
						<IconButton className="icon-button" edge="end" color="inherit">
							<MenuIcon onClick={this._openDropdown} />
						</IconButton>
					</div>
				</div>
				<div>
					{dropdown ?
						<div className="links">
							{(isMasterAdmin) &&
								<Link className="flex-jb full-width items-center text-decoration-none" href='/private/reports'>
									<div
										className={` ${this._chooseClassname('reports')}`}
										color="inherit">
										{t('reports')}
									</div>
									<ArrowForwardIosIcon className="arrow-style" />
								</Link>
							}
							{(isMasterAdmin || isAdmin) &&
								<Link className="flex-jb full-width items-center text-decoration-none" href='/private/users'>
									<div
										className={` ${this._chooseClassname('users')}`}
										color="inherit">
										{t('manage_users')}
									</div>
									<ArrowForwardIosIcon className="arrow-style" />
								</Link>
							}
							{(isMasterAdmin || isAdmin) &&
								<Link className="flex-jb full-width items-center text-decoration-none" href='/private/imports'>
									<divide
										className={` ${this._chooseClassname('imports')}`}
										color="inherit">
										{t('imports')}

									</divide>
									<ArrowForwardIosIcon className="arrow-style" />
								</Link>
							}
							<Link className="flex-jb full-width items-center text-decoration-none" href='/private/sessions'>
								<div
									className={` ${this._chooseClassname('sessions')}`}
									color="inherit">
									{t('my_sessions')}
								</div>
								<ArrowForwardIosIcon className="arrow-style" />
							</Link>
							<Link className="flex-jb full-width items-center text-decoration-none" href={`/private/create-new-offer/${offerId}`}>
								<div
									className={` ${this._chooseClassname('createOffer')}`}
									color="inherit">
									{t('new_offer')}
								</div>
								<ArrowForwardIosIcon className="arrow-style" />
							</Link>
							<Link className="flex-jb full-width items-center text-decoration-none" href='/private/account'>
								<div
									className={` ${this._chooseClassname('account')}`}
									color="inherit">
									{t('manage_account')}
								</div>
								<ArrowForwardIosIcon className="arrow-style" />
							</Link>
							<Link className="flex-jb full-width items-center text-decoration-none" onClick={onLogout}>
								<div
									className={` ${this._chooseClassname('account')}`}
									color="inherit">
									<PowerSettingsNewIcon className="mt-5" />
								</div>
								<ArrowForwardIosIcon className="arrow-style" />
							</Link>
							{/* <Link onClick={onLogout} className="flex-jb full-width items-center text-decoration-none log-out">
								<PowerSettingsNewIcon />
								<ArrowForwardIosIcon className="arrow-style" />
							</Link> */}
						</div>
						:
						null
					}
				</div>
			</div>
		);
	}
}

Logo.propTypes = {
	className: PropTypes.string,
};

export default Logo;