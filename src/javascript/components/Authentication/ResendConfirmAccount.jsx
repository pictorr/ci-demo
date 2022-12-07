import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import Copyright from './Copyright.jsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';
import { resendMailConfirmation } from '../../actions/authenticationActions.js';

class ResendConfirmAccount extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			resendCounter: 0,
		};
	}

	_updateInput = (field, setFieldValue) => e => {
		setFieldValue(field, e.target.value);
	};

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

	_resendMailConfirmation = values => {
		const { dispatch } = this.props;

		const data = {
			emailAddress: values.emailAddress,
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
		dispatch({ type: 'RESET_RESET_PASSWORD' });
	}

	render() {
		const { resendCounter } = this.state;
		const { authentication, t } = this.props;

		return (
			<Container
				component="div"
				maxWidth="xs"
				className='authentication-form-wrapper'>
				<div className='authentication-form-container'>
					<Avatar className='authentication-form-avatar'>
						<MailOutlineIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header'
						component="h1"
						variant="h5">
						{ t('resend_confirmation') }
					</Typography>
					{/* <Typography
						className='authentication-form-register-success-body-2'
						align='center'
						variant="body2"
						color="textSecondary">
						{ t('resend_confirm_account_description_1') }
					</Typography>
					<Typography
						className='authentication-form-register-success-body-2 margin-bottom'
						variant="body2"
						color="textSecondary"
						align="center">
						{ t('resend_confirm_account_description_2') }
					</Typography> */}
					<Formik
						initialValues={ {
							emailAddress: '',
						} }
						validationSchema={ Yup.object().shape({
							emailAddress: Yup.string()
								.nullable()
								.email(t('valid_email'))
								.min(7, t('minimum_characters').replace('__min__', 7))
								.max(256, t('maximum_characters').replace('__max__', 256))
								.required(t('required_field')),
						}) }
						onSubmit={ this._resendMailConfirmation }>
						{ ({ setFieldValue, setFieldTouched, values, errors, touched, handleSubmit }) => {
							return (
								<form
									className='authentication-form'
									onSubmit={ handleSubmit }>
									<Grid container spacing={ 2 }>
										<Grid item xs={ 12 }>
											<TextField
												variant="outlined"
												required
												fullWidth
												id="email"
												label={ t('email_address') }
												name="email"
												autoComplete="email"
												type='email'
												error={ !!errors.emailAddress && touched.emailAddress }
												helperText={ !!errors.emailAddress && touched.emailAddress && errors.emailAddress }
												value={ values.emailAddress }
												onChange={ this._updateInput('emailAddress', setFieldValue) }
												onBlur={ this._onBlur('emailAddress', setFieldTouched) }
											/>
										</Grid>
									</Grid>
									{ resendCounter !== 0 ?
										<CustomAlert
											severity='success'
											message={ t('resend_confirmation_success').replace('__seconds__', resendCounter) }/>
										:
										null
									}
									{ authentication.resendingConfirmAccountError ?
										<CustomAlert
											severity='error'
											message={ authentication.resendingConfirmAccountError }/>
										:
										null
									}
									<GeneralButton
										className='authentication-form-button'
										disabled={ resendCounter !== 0 }
										loading={ authentication.resendingConfirmAccount }
										onClick={ handleSubmit }
										type="submit">
										{ t('confirm') }
									</GeneralButton>
								</form>
							);
						} }
					</Formik>
				</div>
				<GeneralSeparator/>
				<GeneralButton href='/login'>
					{ t('back_to_login') }
				</GeneralButton>
				<Copyright t={ t }/>
			</Container>
		);
	}
}

const mapStateToProps = store => ( {
	authentication: store.authentication
} );

export default withTranslation()(connect(mapStateToProps)(ResendConfirmAccount));