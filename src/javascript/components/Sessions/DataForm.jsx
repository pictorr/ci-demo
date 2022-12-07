import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Card, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import SecondaryButton from '../Templates/Buttons/SecondaryButton.jsx';
import CustomAlert from '../Templates/CustomAlert.jsx';
import { resetItem } from '../../actions/generalActions.js';
import { getSession, updateDataSession } from '../../actions/sessionActions.js';
import { floatNumberRegex, counties } from '../../utils/constants';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { getSessions, deleteSavedSession } from '../../actions/offerActions.js';
import moment from 'moment';
import { parse, isDate } from "date-fns";
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

class DataForm extends PureComponent {
    constructor(props) {
        super(props);

        const {match, t} = props;

        this.state = {
            imageErrors: [],
            isEdit: match.path.indexOf('/edit') !== -1,
            typeObjectiveOptions: [
                {
                    label: t('type_objective_option_1'),
                    option: 1
                },
                {
                    label: t('type_objective_option_2'),
                    option: 2
                },
                {
                    label: t('type_objective_option_3'),
                    option: 3
                },
                {
                    label: t('type_objective_option_4'),
                    option: 4
                },
                {
                    label: t('type_objective_option_5'),
                    option: 5
                },
                {
                    label: t('type_objective_option_6'),
                    option: 6
                },
                {
                    label: t('type_objective_option_7'),
                    option: 7
                },
                {
                    label: t('type_objective_option_8'),
                    option: 8
                }
            ],
            lastProjectData: ''
        };
    }

    componentDidMount() {
        const { isEdit } = this.state;
        const { match, dispatch } = this.props;

        if (isEdit) {
            dispatch(getSession(match?.params?.id));
        } else {
            dispatch(getSessions());
        }
    }

    componentDidUpdate(prevProps) {
        const { offer } = this.props;
        if (prevProps.offer !== offer && offer?.sessions?.length > 0) {
            this.setState({
                lastProjectData: offer?.sessions[0]?.data
            });
        }
    }

    _onDrop = setFieldValue => acceptedFiles => {
        setFieldValue('image', acceptedFiles[0]);
    };

    _onDropRejected = reason => {
        const {t} = this.props;

        let newState = {
            imageErrors: [],
        };
        if (reason[0].errors[0].code === 'file-too-large') {
            newState = {
                imageErrors: [ ...newState.imageErrors, t('file_too_large') ]
            };
        }

        this.setState(newState);
    };

    _updateInput = (field, setFieldValue) => e => {
        setFieldValue(field, e.target.value);
    };

    _onBlur = (field, setFieldTouched) => () => {
        setFieldTouched(field);
    };

    _handleSubmit = values => {
        const { typeObjectiveOptions, isEdit } = this.state;
        const { match, dispatch, history } = this.props;

        let data = {
            company: values.company,
            contactPerson: values.contactPerson,
            email: values.email,
            phoneNumber: values.phoneNumber,
            objective: values.objective,
            typeObjective: typeObjectiveOptions[values.typeObjective - 1].label,
            code: values.code !== '' ? values.code : '-',
            location: values.location,
            description: values.description,
            validationDate: values.validationDate,
        };

        data = {
            ...data,
            id: match.params.id
        };
        let promises = [ dispatch(updateDataSession(data)) ]
        return Promise.all(promises).then(() => {
            isEdit ? history.push(`/private/sessions/session/edit/${ match.params.id }/offers`)
                : history.push(`/private/sessions/session/${ match.params.id }/offers`)
        })
    };

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(resetItem('Session'));
    }

    _handleDateChange = (date, setFieldValue) => {

        let auxDate = new Date(date)
        setFieldValue('validationDate', auxDate);
    }

    _deleteSession = () => {
        const {match, dispatch} = this.props;
        if (!isEdit) {
            dispatch(deleteSavedSession(match?.params?.id));
        }
    }

    _parseDateString = (value, originalValue) => {
        return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
    }

    render() {
        const { isEdit, typeObjectiveOptions, lastProjectData } = this.state;
        const { session, t } = this.props;

        let todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + 14);

        if (session.fetchingSessions) {
            return (
                <Card className='general-card small'>
                    Loading
                </Card>
            );
        }

        let initialData = {};
        if (session?.session?.data?.typeObjective) {
            initialData.company = session?.session?.data?.company ? session?.session?.data?.company : '';
            initialData.contactPerson = session?.session?.data?.contactPerson ? session?.session?.data?.contactPerson : '';
            initialData.email = session?.session?.data?.email ? session?.session?.data?.email : '';
            initialData.phoneNumber = session?.session?.data?.phoneNumber ? session?.session?.data?.phoneNumber : '';
            initialData.objective = session?.session?.data?.objective ? session?.session?.data?.objective : '';
            initialData.location = session?.session?.data?.location ? session?.session?.data?.location : '';
            initialData.description = session?.session?.data?.description ? session?.session?.data?.description : '';
            initialData.code = session?.session?.data?.code ? session?.session?.data?.code : '';
            let findObjectiveType = typeObjectiveOptions.find(el => el.label === session?.session?.data?.typeObjective);
            if (findObjectiveType) {
                initialData.typeObjective = findObjectiveType.option;
            }
        }
        if (lastProjectData?.typeObjective) {
            initialData.company = lastProjectData?.company ? lastProjectData?.company : '';
            initialData.contactPerson = lastProjectData?.contactPerson ? lastProjectData?.contactPerson : '';
            initialData.email = lastProjectData?.email ? lastProjectData?.email : '';
            initialData.phoneNumber = lastProjectData?.phoneNumber ? lastProjectData?.phoneNumber : '';
            initialData.objective = lastProjectData?.objective ? lastProjectData?.objective : '';
            initialData.location = lastProjectData?.location ? lastProjectData?.location : '';
            initialData.description = lastProjectData?.description ? lastProjectData?.description : '';
            let findObjectiveType = typeObjectiveOptions.find(el => el.label === lastProjectData?.typeObjective);
            if (findObjectiveType) {
                initialData.typeObjective = findObjectiveType.option;
            }
        }

        let validDate = session?.session && session?.session?.data?.validationDate ? session?.session?.data?.validationDate : todayDate;
        let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }

        return (
            <Card className='general-card small'>
                <div className='dinosaurs-list-title-wrapper mb-30'>
                    <Typography
                        variant="h4"
                        component="h1">
                        { t('personal_information') }
                    </Typography>
                </div>
                <Formik
                    initialValues={ {
                        company: initialData?.company ? initialData?.company : '',
                        contactPerson: initialData?.contactPerson ? initialData?.contactPerson : '',
                        email: initialData?.email ? initialData?.email : '',
                        phoneNumber: initialData?.phoneNumber ? initialData?.phoneNumber : '',
                        objective: initialData?.objective ? initialData?.objective : '',
                        typeObjective: initialData?.typeObjective ? initialData?.typeObjective : '',
                        location: initialData?.location ? initialData?.location : '',
                        description: initialData?.description ? initialData?.description : '',
                        code: initialData?.code ? initialData?.code : '',
                        validationDate: isEdit ? new Date(validDate) : moment(todayDate),
                    } }
                    validationSchema={ Yup.object().shape({
                        company: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128))
                            .required(t('required_field')),
                        contactPerson: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128))
                            .required(t('required_field')),
                        email: Yup.string()
                            .nullable(),
                        phoneNumber: Yup.string()
                            .nullable()
                            .matches(floatNumberRegex, t('numbers_only'))
                            .max(10, t('maximum_characters').replace('__max__', 10))
                            .required(t('required_field')),
                        objective: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128))
                            .required(t('required_field')),
                        typeObjective: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128))
                            .required(t('required_field')),
                        location: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128)),
                        description: Yup.string()
                            .nullable()
                            .max(128, t('maximum_characters').replace('__max__', 128))
                            .required(t('required_field')),
                        code: Yup.string()
                            .nullable()
                            .min(1, t('minimum_characters').replace('__min__', 1))
                            .max(128, t('maximum_characters').replace('__max__', 128)),
                        validationDate: Yup.date().transform(this._parseDateString)
                            .required(t('required_field')),

                    }) }
                    onSubmit={ this._handleSubmit }>
                    { ({getFieldProps, setFieldValue, setFieldTouched, values, errors, touched, handleSubmit}) => {
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
                            <form onSubmit={ handleSubmit }>
                                <Grid
                                    spacing={ 2 }
                                    className='manage-dinosaur-fields'
                                    container>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('company') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('company') }
                                            error={ !!errors.company && touched.company }
                                            helperText={ !!errors.company && touched.company && errors.company }
                                            onChange={ this._updateInput('company', setFieldValue) }
                                            onBlur={ this._onBlur('company', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('contactPerson') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('contact_person') }
                                            error={ !!errors.contactPerson && touched.contactPerson }
                                            helperText={ !!errors.contactPerson && touched.contactPerson && errors.contactPerson }
                                            onChange={ this._updateInput('contactPerson', setFieldValue) }
                                            onBlur={ this._onBlur('contactPerson', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('email') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('email') }
                                            error={ !!errors.email && touched.email }
                                            helperText={ !!errors.email && touched.email && errors.email }
                                            onChange={ this._updateInput('email', setFieldValue) }
                                            onBlur={ this._onBlur('email', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('phoneNumber') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('phone_number') }
                                            error={ !!errors.phoneNumber && touched.phoneNumber }
                                            helperText={ !!errors.phoneNumber && touched.phoneNumber && errors.phoneNumber }
                                            onChange={ this._updateInput('phoneNumber', setFieldValue) }
                                            onBlur={ this._onBlur('phoneNumber', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('objective') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('objective') }
                                            error={ !!errors.objective && touched.objective }
                                            helperText={ !!errors.objective && touched.objective && errors.objective }
                                            onChange={ this._updateInput('objective', setFieldValue) }
                                            onBlur={ this._onBlur('objective', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 }>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel>{ t('type_objective') }</InputLabel>
                                            <Select
                                                { ...getFieldProps('typeObjective') }
                                                label={ t('type_objective') }
                                                error={ !!errors.typeObjective && touched.typeObjective }
                                                helperText={ !!errors.typeObjective && touched.typeObjective && errors.typeObjective }
                                                onChange={ this._updateInput('typeObjective', setFieldValue) }
                                                onBlur={ this._onBlur('typeObjective', setFieldTouched) }
                                            >
                                                {
                                                    typeObjectiveOptions.map((el) => {
                                                        return <MenuItem value={ el.option }>{ el.label }</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {lang === 'ro' ?
                                    <Grid item xs={ 12 }>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel>{ t('location') }</InputLabel>
                                            <Select
                                                { ...getFieldProps('location') }
                                                label={ t('location') }
                                                error={ !!errors.location && touched.location }
                                                helperText={ !!errors.location && touched.location && errors.location }
                                                onChange={ this._updateInput('location', setFieldValue) }
                                                onBlur={ this._onBlur('location', setFieldTouched) }
                                            >
                                                {counties[lang].map((el) => {
                                                    return <MenuItem value={ el }>{ el }</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    :null}
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('description') }
                                            variant="outlined"
                                            cols='71'
                                            rowsMin='3'
                                            fullWidth
                                            label={ t('description') }
                                            error={ !!errors.description && touched.description }
                                            helperText={ !!errors.description && touched.description && errors.description }
                                            onChange={ this._updateInput('description', setFieldValue) }
                                            onBlur={ this._onBlur('description', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <CssTextField
                                            { ...getFieldProps('code') }
                                            variant="outlined"
                                            fullWidth
                                            label={ t('project_code') }
                                            error={ !!errors.code && touched.code }
                                            helperText={ !!errors.code && touched.code && errors.code }
                                            onChange={ this._updateInput('code', setFieldValue) }
                                            onBlur={ this._onBlur('code', setFieldTouched) }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={ 12 }>
                                        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                                            <KeyboardDatePicker
                                                variant="outlined"
                                                // inputVariant="outlined"
                                                defaultValue={ values.validationDate }
                                                label={ `${ t('validation_date') }` }
                                                format="dd/MM/yyyy"
                                                value={ values.validationDate }
                                                InputAdornmentProps={ {position: "start"} }
                                                onChange={ date => this._handleDateChange(date, setFieldValue) }
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                </Grid>
                                { session.savingSessionError ?
                                    <CustomAlert
                                        severity='error'
                                        message={ session.savingSessionError }/>
                                    :
                                    session.savedSession ?
                                        <CustomAlert
                                            severity='success'
                                            message={ t('sessionaved') }/>
                                        :
                                        null
                                }
                                <Grid
                                    className='manage-Session-actions'
                                    container>
                                    { session.savedSession ?
                                        <GeneralButton href='/private/sessions'>
                                            { t('back') }
                                        </GeneralButton>
                                        :
                                        <>
                                            <GeneralButton
                                                loading={ session.savingSession }
                                                disabled={ session.savingSession }
                                                onClick={ handleSubmit }
                                                type='submit'>
                                                { t('next') }
                                            </GeneralButton>
                                            <SecondaryButton href={ `/private/sessions` }
                                                           onClick={ this._deleteSession }
                                            >
                                                { t('cancel') }
                                            </SecondaryButton>
                                        </>
                                    }
                                </Grid>
                            </form>
                            </ThemeProvider>
                        );
                    } }
                </Formik>
            </Card>
        );
    }
}

const mapStateToProps = store => ({
    session: store.session,
    offer: store.offer,
});

export default withTranslation()(connect(mapStateToProps)(DataForm));