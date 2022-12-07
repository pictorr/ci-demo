import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import Copyright from './Copyright.jsx';
import CustomLink from '../Templates/CustomLink.jsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { onLogin } from '../../actions/authenticationActions.js';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { setItemInStorage } from '../../utils/utils.js';
import { AppContext } from '../../AppContext.jsx';
import { withStyles } from '@material-ui/core/styles';

const CssTextField = withStyles({
	root: {
	  '& label.Mui-focused': {
		color: '#A61F7D',
	  },
	  '& .MuiInput-underline:after': {
		borderBottomColor: '#A61F7D',
	  },
	  '& .MuiOutlinedInput-root': {
		'& fieldset': {
		  borderColor: '#A61F7D',
		},
		'&:hover fieldset': {
		  borderColor: '#A61F7D',
		},
		'&.Mui-focused fieldset': {
		  borderColor: '#A61F7D',
		},
	  },
	},
  })(TextField);

  
const GreenCheckbox = withStyles({
    root: {
      color: '#A61F7D',
      '&$checked': {
        color: '#A61F7D',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class Login extends PureComponent {
	_updateInput = (field, setFieldValue) => e => {
		if (field === 'rememberMe') {
			setFieldValue(field, e.target.checked);
		} else {
			setFieldValue(field, e.target.value);
		}
	};

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

	_handleSubmit = values => {
		const { dispatch } = this.props;

		localStorage.setItem("openModal", true);

		const data = {
			emailAddress: values.emailAddress,
			password: values.password,
			rememberMe: values.rememberMe,
		};

		dispatch(onLogin(data, this._handleSubmitCallback));
	};

	_handleSubmitCallback = token => {
		const { client } = this.context;
		setItemInStorage('token', token);
		client.emit('LOGGED_IN', { callback: this._emitCallback });

		window.location.reload();
	};

	// This function makes sure there is no race condition between history.push and client.emit
	// This is passed as a callback to the subscription to LOGGED_IN this.setState
	_emitCallback = () => {
		const { history } = this.props;
		history.push('/private/sessions');
	};

	render() {
		const { match, authentication, t } = this.props;

		return (
			<Container
				component="div"
				maxWidth="xs"
				className='authentication-form-wrapper'>
				<div className='authentication-form'>
					<Avatar className='authentication-form-header-icon'>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography
						className='authentication-form-header'
						component="h1"
						variant="h5">
						{ t('login') }
					</Typography>
					<Formik
						initialValues={ {
							emailAddress: '',
							password: '',
							rememberMe: false,
						} }
						validationSchema={ Yup.object().shape({
							emailAddress: Yup.string()
								.nullable()
								.email(t('valid_email'))
								.min(7, t('minimum_characters').replace('__min__', 7))
								.max(256, t('maximum_characters').replace('__max__', 256))
								.required(t('required_field')),
							password: Yup.string()
								.nullable()
								.min(8, t('minimum_characters').replace('__min__', 8))
								.max(128, t('maximum_characters').replace('__max__', 128))
								.required(t('required_field')),
							rememberMe: Yup.boolean()
								.nullable()
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
											<CssTextField
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
										<Grid item xs={ 12 }>
											<CssTextField
												variant="outlined"
												required
												fullWidth
												name="password"
												label={ t('password') }
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
									</Grid>
									<Grid
										alignItems={ 'center' }
										container>
										<Grid
											item
											xs={ 8 }>
										</Grid>
										<Grid
											className='login-forgot-password'
											item
											xs={ 4 }>
											<CustomLink href="/reset-password" className="primaryColorText">
												{ t('forgot_password') }
											</CustomLink>
										</Grid>
									</Grid>
									{ authentication.loginError ?
										<CustomAlert
											className='authentication-alert'
											severity='error'
											message={ authentication.loginError }/>
										:
										match.params.passwordReset ?
											<CustomAlert
												className='authentication-alert'
												severity='success'
												message={ t('useNewPassword') }/>
											:
											null
									}
									{ authentication.loginError ?
										<CustomLink href='/resend-confirm-account'>
											<Typography
												variant="body2"
												align="center">
												{ t('not_activated') }
											</Typography>
										</CustomLink>
										:
										null
									}
									<GeneralButton
										loading={ authentication.loggingIn }
										disabled={ authentication.loggingIn }
										onClick={ handleSubmit }
										type="submit">
										{ t('enter_account') }
									</GeneralButton>
								</form>
							);
						} }
					</Formik>
				</div>
				<GeneralSeparator/>
				<GeneralButton href='/register'>
					{ t('not_registered') }
				</GeneralButton>
				<Copyright t={ t }/>
			</Container>
		);
	}
}

Login.contextType = AppContext;

const mapStateToProps = store => ( {
	authentication: store.authentication
} );

export default withTranslation()(connect(mapStateToProps)(withStyles()(Login)));