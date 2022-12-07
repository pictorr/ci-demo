import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
import CustomLink from '../Templates/CustomLink.jsx';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import Copyright from './Copyright.jsx';
import { internationalPhoneNumberPattern, phoneNumberPattern, languageCodes, countryCodes, counties, jobs } from '../../utils/constants.js';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { onRegister } from '../../actions/authenticationActions.js';
import omit from 'lodash/omit';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import GeneralSeparator from '../Templates/GeneralSeparator.jsx';
import UploadField from "../Dinosaurs/CreateAndUpdateDinosaurs/UploadField";
import ReCAPTCHA from 'react-google-recaptcha';
import ReactCountryFlag from 'react-country-flag';

class Register extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: true,
            languageSelected : false
        };
    }

    handleChange = value => {
        this.setState({ value: false });
    };

    _updateInput = (field, setFieldValue) => e => {
        if (field === 'language') {
            localStorage.setItem('language', e.target.value);
    		window.location.reload();

        }
        if (field === 'idCardSeries') {
            setFieldValue(field, e.target.value?.toUpperCase());
        } else if (field === 'acceptedTerms') {
            setFieldValue(field, e.target.checked);
        } else {
            setFieldValue(field, e.target.value);
        }
    };

    _onBlur = (field, setFieldTouched) => () => {
        setFieldTouched(field);
    };

    _handleSubmit = values => {
        const { dispatch, t } = this.props;

        if (values.acceptedTerms) {
            const data = {
                ...values,
            };
            if (data.company.length === 0) {
                data.company = '-';
            }
            dispatch(onRegister(omit(data, [ 'confirmPassword', 'acceptedTerms' ]), this._handleSubmitCallback(values.emailAddress)));
        } else {
            dispatch({
                type: 'ON_REGISTER_REJECTED',
                payload: { error: t('agree_terms_conditions') },
            });
        }
    };

    _handleSubmitLanguage = () => {
        this.setState({
            languageSelected : true
        })
    }

    _handleSubmitCallback = emailAddress => () => {
        const { history } = this.props;
        history.push(`/confirm-account/${ encodeURIComponent(emailAddress) }`);
    };

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({ type: 'RESET_REGISTER' });
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

    render() {
        const { authentication, t } = this.props;
        const { languageSelected } = this.state;
        
        let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }

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
                        { t('register') }
                    </Typography>
                    <Formik
                        initialValues={ {
                            image: '',
                            company: '',
                            // job: jobs[lang][0],
                            address: '',
                            locality: '',
                            country: countryCodes.filter(contry => contry.value === lang)[0].value,
                            language: languageCodes.filter(contry => contry.value === lang)[0].value,
                            state: lang === 'ro' ? '' : '-',
                            firstName: '',
                            lastName: '',
                            phoneNumber: '',
                            emailAddress: '',
                            password: '',
                            confirmPassword: '',
                            acceptedTerms: false,
                        } }
                        validationSchema={ Yup.object().shape({
                            image: Yup.mixed()
                                .nullable(),
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
                            country: Yup.string()
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
                            confirmPassword: Yup.string()
                                .nullable()
                                .when('password', {
                                    is: val => ( val && val.length > 0 ),
                                    then: Yup.string().oneOf(
                                        [ Yup.ref('password') ],
                                        t('required_field'),
                                    ),
                                })
                                .min(8, t('minimum_characters').replace('__min__', 8))
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
                                            <Typography
                                                component='h2'
                                                variant="h6">
                                                { t('personal_information') }
                                            </Typography>
                                        </Grid>
                                        {languageSelected === false ?
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
                                                        // disabled
                                                    >
                                                        { languageCodes.map((el) => {
                                                            let flag = el?.value?.toUpperCase();
                                                            if (flag === 'EN') {
                                                                flag = 'GB'
                                                            }
                                                            if (flag === 'CR') {
                                                                flag = 'HR'
                                                            }
                                                            if (flag === 'SB') {
                                                                flag = 'RS'
                                                            }
                                                            return <MenuItem value={ el.value }>
                                                                <div>
                                                                    <ReactCountryFlag
                                                                        countryCode={flag}
                                                                        svg
                                                                        style={{
                                                                            fontSize: '2em',
                                                                            lineHeight: '2em',
                                                                            marginRight:'0.5em'
                                                                        }}
                                                                    />
                                                                { el.label }
                                                                </div></MenuItem>
                                                        }) }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            :null
                                        }
                                        {
                                            languageSelected === false ?
                                                <GeneralButton
                                                    onClick={ this._handleSubmitLanguage }>
                                                    { t('continue') }
                                                </GeneralButton>
                                            :
                                            <Grid container spacing={ 2 }>
                                                <Grid item xs={ 12 }>
                                                    <TextField
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
                                                    <TextField
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
                                                    <TextField
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
                                                            disabled
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
                                                            disabled
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
                                                :null }
                                                <Grid item xs={ 12 } sm={ 6 }>
                                                    <TextField
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
                                                    <TextField
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
                                                    <TextField
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
                                                <Grid item xs={ 12 }>
                                                    <Typography
                                                        component='h2'
                                                        variant="h6">
                                                        { t('account_data') }
                                                    </Typography>
                                                </Grid>
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
                                                <Grid item xs={ 12 }>
                                                    <TextField
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
                                                <Grid item xs={ 12 }>
                                                    <TextField
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
                                                </Grid>
                                                <Grid item xs={ 12 }>
                                                    <FormControlLabel
                                                        control={ (
                                                            <Checkbox
                                                                name="acceptedTerms"
                                                                onChange={ this._updateInput('acceptedTerms', setFieldValue) }
                                                                checked={ values.acceptedTerms }
                                                                color="primary"/>
                                                        ) }
                                                        label={ (
                                                            <Typography
                                                                variant='body1'
                                                                component='p'>
                                                                { t('read_agree') }{ ' ' }
                                                                <CustomLink
                                                                    className='register-terms-and-conditions'
                                                                    target='_blank'
                                                                    href='/terms-and-conditions'>
                                                                    { t('terms_conditions') }
                                                                </CustomLink>
                                                            </Typography>
                                                        ) }
                                                    />
                                                </Grid>
                                                </Grid>}
                                            </Grid>
                                            {
                                                languageSelected === true ?
                                                    authentication.registerError ?
                                                        <CustomAlert
                                                            severity='error'
                                                            message={ authentication.registerError }/>
                                                        :
                                                        null
                                                    :
                                                    null
                                            }
                                            {
                                                languageSelected === true ?
                                                    window.location.hostname !== 'localhost' && window.location.hostname !== 'siniat.gdm.ro' &&
                                                        <ReCAPTCHA
                                                            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                                                            onChange={this.handleChange}
                                                        />
                                                :
                                                null
                                            }
                                            {
                                                languageSelected === true ?
                                                    window.location.hostname !== 'localhost' && window.location.hostname !== 'siniat.gdm.ro' ?
                                                        <GeneralButton
                                                            loading={ authentication.registering }
                                                            disabled={ authentication.registering || this.state.value }
                                                            onClick={ handleSubmit }
                                                            type="submit">
                                                            { t('finish_register') }
                                                        </GeneralButton>
                                                        : 
                                                        <GeneralButton
                                                            loading={ authentication.registering }
                                                            onClick={ handleSubmit }
                                                            type="submit">
                                                            { t('finish_register') }
                                                        </GeneralButton> 
                                                    :
                                                    null
                                            }
                                </form>
                            );
                        } }
                    </Formik>
                </div>
                <GeneralSeparator/>
                {
                    languageSelected === true ?
                        <GeneralButton href='/login'>
                            { t('already_registered') }
                        </GeneralButton>
                    :null
                }
                <Copyright t={ t }/>
            </Container>
        );
    }
}

const mapStateToProps = store => ( {
    authentication: store.authentication
} );

export default withTranslation()(connect(mapStateToProps)(Register));