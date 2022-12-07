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
import { resetPasswordSavePassword } from '../../actions/authenticationActions.js';

class NewPassword extends PureComponent {
	_updateInput = (field, setFieldValue) => e => {
		setFieldValue(field, e.target.value);
	};

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

	_handleSubmit = values => {
		const { match, dispatch } = this.props;

		const data = {
			password: values.password,
			resetPasswordId: match.params.resetPasswordId,
		};

		dispatch(resetPasswordSavePassword(data, this._handleSubmitCallback));
	};

	_handleSubmitCallback = () => {
		const { history } = this.props;

		this.redirectTimeout = setTimeout(() => {
			history.replace('/login/password-saved');
		}, 5000);
	};

	componentWillUnmount() {
		const { dispatch } = this.props;

		if (this.redirectTimeout) {
			clearTimeout(this.redirectTimeout);
		}
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
					<Avatar className='authentication-form-avatar'>
						<MailOutlineIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header reset-password'
						component="h1" variant="h5">
						{ t('reset_password') }
					</Typography>
					<Formik
						initialValues={ {
							password: '',
							confirmPassword: '',
						} }
						validationSchema={ Yup.object().shape({
							password: Yup.string()
								.nullable()
								.min(7, t('minimum_characters').replace('__min__', 7))
								.max(128, t('maximum_characters').replace('__max__', 128))
								.required(t('required_field')),
							confirmPassword: Yup.string()
								.nullable()
								.when('password', {
									is: val => ( val && val.length > 0 ),
									then: Yup.string().oneOf(
										[Yup.ref('password')],
										t('required_field'),
									),
								})
								.min(7, t('minimum_characters').replace('__min__', 7))
								.max(128, t('maximum_characters').replace('__max__', 128))
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
												name="password"
												label={ t('newPassword') }
												type="password"
												id="password"
												autoComplete="new-password"
												error={ !!errors.password && touched.password }
												helperText={ !!errors.password && touched.password && errors.password }
												value={ values.password }
												onChange={ this._updateInput('password', setFieldValue) }
												onBlur={ this._onBlur('password', setFieldTouched) }
											/>
										</Grid>
										<Grid item xs={ 12 }>
											<TextField
												variant="outlined"
												required
												fullWidth
												name="password"
												label={ t('confirm_new_password') }
												type="password"
												id="password"
												autoComplete="new-password"
												error={ !!errors.confirmPassword && touched.confirmPassword }
												helperText={ !!errors.confirmPassword && touched.confirmPassword && errors.confirmPassword }
												value={ values.confirmPassword }
												onChange={ this._updateInput('confirmPassword', setFieldValue) }
												onBlur={ this._onBlur('confirmPassword', setFieldTouched) }
											/>
										</Grid>
									</Grid>
									{ authentication.savingPasswordError ?
										<CustomAlert
											severity='error'
											message={ authentication.savingPasswordError }/>
										:
										authentication.savedPassword ?
											<CustomAlert
												severity='success'
												message={ t('saved_password') }/>
											:
											null
									}
									{ authentication.savedPassword ?
										<GeneralButton
											href='/login'
											className='authentication-form-button'>
											{ t('back_to_login') }
										</GeneralButton>
										:
										<GeneralButton
											loading={ authentication.savingPassword }
											disabled={ authentication.savingPassword }
											onClick={ handleSubmit }
											className='authentication-form-button'
											type="submit">
											{ t('save_password') }
										</GeneralButton>
									}
								</form>
							);
						} }
					</Formik>
				</div>
				{ authentication.savedPassword ?
					<div className='authentication-form-copyright-spacing'/>
					:
					<>
						<GeneralSeparator/>
						<GeneralButton href='/login'>
							{ t('back_to_login') }
						</GeneralButton>
					</>
				}
				<Copyright t={ t }/>
			</Container>
		);
	}
}

const mapStateToProps = store => ( {
	authentication: store.authentication
} );

export default withTranslation()(connect(mapStateToProps)(NewPassword));
