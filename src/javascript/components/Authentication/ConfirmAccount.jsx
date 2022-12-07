import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import { resendMailConfirmation } from '../../actions/authenticationActions.js';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';

class ConfirmAccount extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			resendCounter: 60,
		};

		this.resendInterval = setInterval(() => {
			const { resendCounter } = this.state;
			if (resendCounter === 0) {
				clearInterval(this.resendInterval);
				return;
			}
			this.setState(prevState => ( {
				resendCounter: prevState.resendCounter - 1
			} ));
		}, 1000);
	}

	_resendMailConfirmation = () => {
		const { match, dispatch } = this.props;

		const data = {
			emailAddress: decodeURIComponent(match.params.emailAddress),
		};

		dispatch(resendMailConfirmation(data, this._resendMailConfirmationTimeout));
	};

	_resendMailConfirmationTimeout = () => {
		this.setState({
			resendCounter: 60
		}, () => {
			this.resendInterval = setInterval(() => {
				const { resendCounter } = this.state;
				if (resendCounter === 0) {
					clearInterval(this.resendInterval);
					return;
				}
				this.setState(prevState => ( {
					resendCounter: prevState.resendCounter - 1
				} ));
			}, 1000);
		});
	};

	componentWillUnmount() {
		const { dispatch } = this.props;
		if (this.resendInterval) {
			clearInterval(this.resendInterval);
		}
		dispatch({ type: 'RESET_RESEND_CONFIRM_ACCOUNT' });
	}

	render() {
		const { t } = this.props;

		return (
			<Container
				component="div"
				maxWidth="xs"
				className='authentication-form-wrapper'>
				<div className='authentication-form-container'>
					<Avatar className='authentication-form-container'>
						<CheckCircleOutlineIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header rubrik-font'
						component="h1"
						variant="h5">
						{ t('successfully_registered') }
					</Typography>
					<Typography
						className="rubrik-font"
						component="h2"
						align='center'
						variant="body1">
						{ t('successfully_registered_paragraph') }
					</Typography>
					<Typography
						className="rubrik-font"
						className='authentication-form-register-success-body-2'
						component="h3"
						align='center'
						variant="body2">
						{ t('successfully_registered_approval') }
					</Typography>
				</div>
				<GeneralSeparator/>
				<GeneralButton href='/login'>
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