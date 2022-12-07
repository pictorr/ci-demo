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
import { resetPasswordRequest } from '../../actions/authenticationActions.js';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';

class RequestResetPassword extends PureComponent {
	_updateInput = (field, setFieldValue) => e => {
		setFieldValue(field, e.target.value);
	};

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

	_handleSubmit = values => {
		const { dispatch } = this.props;

		const data = {
			emailAddress: values.emailAddress
		};

		dispatch(resetPasswordRequest(data));
	};

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch({ type: 'RESET_RESET_PASSWORD' });
	}

	render() {
		const { authentication, t } = this.props;

		return (
			<Container
				component="div"
				maxWidth="xs"
				className='authentication-form-wrapper'>
				<div className='authentication-form-container'>
					<Avatar className='authentication-form-container'>
						<MailOutlineIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header reset-password'
						component="h1"
						variant="h5">
						{ t('reset_password') }
					</Typography>
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
						onSubmit={ this._handleSubmit }>
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
									{ authentication.resettingPasswordError ?
										<CustomAlert
											severity='error'
											message={ authentication.resettingPasswordError }/>
										:
										authentication.resetPassword ?
											<CustomAlert
												severity='success'
												message={ t('successfully_requested_reset_password') }/>
											:
											null
									}
									<GeneralButton
										className='authentication-form-button'
										loading={ authentication.resettingPassword }
										disabled={ authentication.resettingPassword }
										onClick={ handleSubmit }
										type="submit">
										{ t('reset_password_button') }
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

export default withTranslation()(connect(mapStateToProps)(RequestResetPassword));