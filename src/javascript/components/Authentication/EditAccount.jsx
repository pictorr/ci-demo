import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { Formik } from 'formik';
import * as Yup from 'yup';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import { internationalPhoneNumberPattern, phoneNumberPattern, languageCodes, jobs, counties, countryCodes } from '../../utils/constants.js';
import { getUser, updateUser, updateUserPassword } from '../../actions/usersActions.js';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getItemFromStorage } from "../../utils/utils";
import PageLoader from '../../components/Templates/PageLoader.jsx';
import { withStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { colours } from '../../utils/colours.js';

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

class EditAccount extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            changePassword: false,
        }
    }

    _updateInput = (field, setFieldValue) => e => {
        setFieldValue(field, e.target.value);
    };

    _onBlur = (field, setFieldTouched) => () => {
        setFieldTouched(field);
    };

    _handleSubmit = values => {
        const { dispatch, users } = this.props;
        const { changePassword } = this.state;

        const data = {
            company: values.company,
            job: values.job,
            address: values.address,
            locality: values.locality,
            language: values.language,
            state: values.state,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            emailAddress: values.emailAddress,
            id: getItemFromStorage('userId')
        };
        if (data.company.length === 0) {
            data.company = '-';
        }

        if (changePassword) {
            const dataChangePassword = {
                userId: getItemFromStorage('userId'),
                password: values.password
            }

            dispatch(updateUserPassword(dataChangePassword))
        }

        let changedLang = false;
        if (data?.language && users?.user?.language) {
            if (data?.language !== users?.user?.language) {
                changedLang = true;
            }
        }
        if (changedLang) {
            localStorage.setItem('language', data.language);
            window.location.reload();
        }
        dispatch(updateUser(data, this._handleSubmitCallback()));
    };

    _handleSubmitCallback = () => () => {
        const { history } = this.props;
        history.push('/private/sessions');
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUser(getItemFromStorage('userId')));
    }

    _onDrop = setFieldValue => acceptedFiles => {
        setFieldValue('image', acceptedFiles[0]);
    };

    _onDropRejected = reason => {
        const { t } = this.props;

        let newState = {
            imageErrors: [],
        };
        if (reason[0].errors[0].code === 'file-too-large') {
            newState = {
                imageErrors: [...newState.imageErrors, t('file_too_large')]
            };
        }

        this.setState(newState);
    };

    _changePassword = () => {
        this.setState({
            changePassword: !this.state.changePassword
        })
    }

    render() {
        const { authentication, users, t } = this.props;
        const { user } = users;
        const { changePassword } = this.state;

        let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }
        let country = localStorage.getItem('country');
        if (!country) { country = 'ro'; }

        if (users.fetchingUser) {
            return (
                <PageLoader/>
			);
        }
        return (
            <Container
                component="div"
                maxWidth="xs"
                className='authentication-form-wrapper'>
                <CssBaseline/>
                <div className='authentication-form-container'>
                    <Avatar className='authentication-form-container'>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography
                        className='authentication-form-header'
                        component="h1" variant="h5">
                        { t('edit_account') }
                    </Typography>
                    <Formik
                        initialValues={ {
                            company: user?.company || '',
                            job: user?.job || '',
                            address: user?.address || '',
                            locality: user?.locality || '',
                            country: user?.country || 'ro',
                            language: user?.language || '',
                            state: user?.state || '',
                            firstName: user?.firstName || '',
                            lastName: user?.lastName || '',
                            phoneNumber: user?.phoneNumber || '',
                            emailAddress: user?.emailAddress || '',
                            password: '',
                            confirmPassword: '',
                            acceptedTerms: false,
                        } }
                        validationSchema={ Yup.object().shape({
                            company: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128)),
                            job: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            address: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            locality: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            language: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            state: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            firstName: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            lastName: Yup.string()
                                .nullable()
                                .min(1, t('minimum_characters').replace('__min__', 1))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                            phoneNumber: Yup.string()
                                .nullable()
                                .min(10, t('minimum_characters').replace('__min__', 10))
                                .max(15, t('maximum_characters').replace('__max__', 15))
                                .matches(lang === 'ro' ? phoneNumberPattern : internationalPhoneNumberPattern, t('invalid_phone_format'))
                                .required(t('required_field')),
                            password: Yup.string()
                                .nullable()
                                .min(7, t('minimum_characters').replace('__min__', 7))
                                .max(128, t('maximum_characters').replace('__max__', 128)),
                            confirmPassword: Yup.string()
                                .nullable()
                                .when('password', {
                                    is: val => ( val && val.length > 0 && changePassword === true ),
                                    then: Yup.string().oneOf(
                                        [ Yup.ref('password') ],
                                        t('passwords_must_match'),
                                    ),
                                })
                                .min(7, t('minimum_characters').replace('__min__', 7))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                        }) }
                        onSubmit={ this._handleSubmit }>
                        { ({ setFieldValue, setFieldTouched, values, errors, touched, handleSubmit }) => {
                            return (
                                <ThemeProvider theme={ createTheme({
                                    palette: {
                                        primary: {
                                            main: colours.purple,
                                            light: colours.purple
                                        },
                                        secondary: {
                                            main: colours.purple
                                        },
                                    },
                                }) }>
                                <form
                                    className='authentication-form'
                                    onSubmit={ handleSubmit }>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 12 }>
                                            <CssTextField
                                                variant="outlined"
                                                fullWidth
                                                id="company"
                                                label={ t('company_register') }
                                                name="company"
                                                autoComplete="fname"
                                                error={ !!errors.company && touched.company }
                                                helperText={ !!errors.company && touched.company && errors.company }
                                                value={ values.company }
                                                onChange={ this._updateInput('company', setFieldValue) }
                                                onBlur={ this._onBlur('company', setFieldTouched) }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel>{ `${ t('job') } *` }</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    fullWidth
                                                    id="job"
                                                    label={ t('job') }
                                                    name="job"
                                                    autoComplete="fname"
                                                    error={ !!errors.job && touched.job }
                                                    helperText={ !!errors.job && touched.job && errors.job }
                                                    value={ values.job }
                                                    onChange={ this._updateInput('job', setFieldValue) }
                                                    onBlur={ this._onBlur('job', setFieldTouched) }
                                                >
                                                    {jobs[lang].map((el) => {
                                                        return <MenuItem value={ el }>{ el }</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <CssTextField
                                                variant="outlined"
                                                fullWidth
                                                id="address"
                                                label={ `${ t('address') } *` }
                                                name="address"
                                                autoComplete="fname"
                                                error={ !!errors.address && touched.address }
                                                helperText={ !!errors.address && touched.address && errors.address }
                                                value={ values.address }
                                                onChange={ this._updateInput('address', setFieldValue) }
                                                onBlur={ this._onBlur('address', setFieldTouched) }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <CssTextField
                                                variant="outlined"
                                                fullWidth
                                                id="locality"
                                                label={ `${ t('locality') } *` }
                                                name="locality"
                                                autoComplete="fname"
                                                error={ !!errors.locality && touched.locality }
                                                helperText={ !!errors.locality && touched.locality && errors.locality }
                                                value={ values.locality }
                                                onChange={ this._updateInput('locality', setFieldValue) }
                                                onBlur={ this._onBlur('locality', setFieldTouched) }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel>{ `${ t('country') } *` }</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    fullWidth
                                                    id="country"
                                                    label={ t('country') }
                                                    name="country"
                                                    autoComplete="fname"
                                                    error={ !!errors.country && touched.country }
                                                    helperText={ !!errors.country && touched.country && errors.country }
                                                    value={ values.country }
                                                    onChange={ this._updateInput('country', setFieldValue) }
                                                    onBlur={ this._onBlur('country', setFieldTouched) }
                                                    disabled="true"
                                                >
                                                    { countryCodes.map((el) => {
                                                        return <MenuItem value={ el.value }>{ el.label }</MenuItem>
                                                    }) }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel>{ `${ t('language') } *` }</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    fullWidth
                                                    id="language"
                                                    label={ t('language') }
                                                    name="language"
                                                    autoComplete="fname"
                                                    error={ !!errors.language && touched.language }
                                                    helperText={ !!errors.language && touched.language && errors.language }
                                                    value={ values.language }
                                                    onChange={ this._updateInput('language', setFieldValue) }
                                                    onBlur={ this._onBlur('language', setFieldTouched) }
                                                    disabled="true"
                                                >
                                                    { languageCodes.map((el) => {
                                                        return <MenuItem value={ el.value }>{ el.label }</MenuItem>
                                                    }) }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {lang === 'ro' ?
                                        <Grid item xs={ 12 }>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel>{ `${ t('state') } *` }</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    fullWidth
                                                    id="state"
                                                    label={ t('state') }
                                                    name="state"
                                                    autoComplete="fname"
                                                    error={ !!errors.state && touched.state }
                                                    helperText={ !!errors.state && touched.state && errors.state }
                                                    value={ values.state }
                                                    onChange={ this._updateInput('state', setFieldValue) }
                                                    onBlur={ this._onBlur('state', setFieldTouched) }
                                                >
                                                    {counties[lang].map((el) => {
                                                            return <MenuItem value={ el }>{ el }</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        :null}
                                        <Grid item xs={ 12 } sm={ 6 }>
                                            <CssTextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label={ t('first_name') }
                                                name="firstName"
                                                autoComplete="fname"
                                                error={ !!errors.firstName && touched.firstName }
                                                helperText={ !!errors.firstName && touched.firstName && errors.firstName }
                                                value={ values.firstName }
                                                onChange={ this._updateInput('firstName', setFieldValue) }
                                                onBlur={ this._onBlur('firstName', setFieldTouched) }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 } sm={ 6 }>
                                            <CssTextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="lastName"
                                                label={ t('last_name') }
                                                name="lastName"
                                                autoComplete="lname"
                                                error={ !!errors.lastName && touched.lastName }
                                                helperText={ !!errors.lastName && touched.lastName && errors.lastName }
                                                value={ values.lastName }
                                                onChange={ this._updateInput('lastName', setFieldValue) }
                                                onBlur={ this._onBlur('lastName', setFieldTouched) }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <CssTextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                type={ 'tel' }
                                                id="phoneNumber"
                                                label={ t('phone_number') }
                                                name="phoneNumber"
                                                error={ !!errors.phoneNumber && touched.phoneNumber }
                                                helperText={ !!errors.phoneNumber && touched.phoneNumber && errors.phoneNumber }
                                                value={ values.phoneNumber }
                                                onChange={ this._updateInput('phoneNumber', setFieldValue) }
                                                onBlur={ this._onBlur('phoneNumber', setFieldTouched) }
                                            />
                                        </Grid>
                                        {changePassword ? 
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
                                            </Grid> : null}
                                        {changePassword ? 
                                            <Grid item xs={ 12 }>
                                                <CssTextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label={ t('confirm_password') }
                                                    type="password"
                                                    id="password"
                                                    autoComplete="new-password"
                                                    error={ !!errors.confirmPassword && touched.confirmPassword }
                                                    helperText={ !!errors.confirmPassword && touched.confirmPassword && errors.confirmPassword }
                                                    value={ values.confirmPassword }
                                                    onChange={ this._updateInput('confirmPassword', setFieldValue) }
                                                    onBlur={ this._onBlur('confirmPassword', setFieldTouched) }
                                                />
                                            </Grid> : null}
                                    </Grid>
                                    { authentication.registerError ?
                                        <CustomAlert
                                            severity='error'
                                            message={ authentication.registerError }/>
                                        :
                                        null
                                    }
                                    <GeneralButton
                                            onClick={ this._changePassword }
                                    >
                                        { changePassword === false ? t('edit_password') : t('edit_password_cancel') }
                                    </GeneralButton>
                                    <GeneralButton
                                        loading={ authentication.registering }
                                        disabled={ authentication.registering }
                                        onClick={ handleSubmit }
                                        type="submit">
                                        { t('finish_edit_account') }
                                    </GeneralButton>
                                </form>
			                    </ThemeProvider>
                            );
                        } }
                    </Formik>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = store => ( {
    authentication: store.authentication,
    users: store.users,
} );

export default withTranslation()(connect(mapStateToProps)(EditAccount));