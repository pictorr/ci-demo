import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';
import { confirmAccount } from '../../actions/authenticationActions.js';

class ConfirmAccount extends PureComponent {
	componentDidMount() {
		this._confirmAccount();
	}

	_confirmAccount = () => {
		const { match, dispatch } = this.props;
		if (match.params.activationId) {
			dispatch(confirmAccount(match.params.activationId));
		} else {
			let activationId = location.pathname.split('account-confirmation/')[1];
			dispatch(confirmAccount(activationId));
		}
	};

	componentWillUnmount() {
		const { dispatch } = this.props;
		if (this.redirectTimeout) {
			clearTimeout(this.redirectTimeout);
		}
		dispatch({ type: 'RESET_CONFIRM_ACCOUNT' });
	}

	render() {
		const { authentication, t } = this.props;

		return (
			<Container
				component="div"
				maxWidth="xs"
				className='authentication-form-wrapper'>
				<div className='authentication-form-container'>
					<Avatar className='authentication-form-avatar'>
						<CheckCircleOutlineIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header rubrik-font'
						component="h1" variant="h5">
						{ authentication.confirmingAccountError ? t('account_not_activated') : authentication.confirmingAccount ? null : t('account_activated') }
					</Typography>
				</div>
				{ authentication.confirmingAccountError ?
					<CustomAlert
						severity='error'
						message={ authentication.confirmingAccountError }/>
					:
					authentication.confirmingAccount ?
						null
						:
						<CustomAlert
							severity='success'
							message={ t('account_activated_description') }/>
				}
				<GeneralSeparator/>
				<GeneralButton
					href='/login'>
					{ t('back_to_login') }
				</GeneralButton>
			</Container>
		);
	}
}

const mapStateToProps = store => ( {
	authentication: store.authentication
} );

export default withTranslation()(connect(mapStateToProps)(ConfirmAccount));