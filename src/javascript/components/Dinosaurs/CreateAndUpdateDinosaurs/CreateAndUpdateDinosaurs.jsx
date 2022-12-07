import React, { PureComponent } from 'react';
import { Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import UploadField from './UploadField.jsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isURL } from '../../../utils/utils.js';
import TextField from '@material-ui/core/TextField';
import { floatNumberRegex, foodChoices } from '../../../utils/constants.js';
import CustomSelect from '../../Templates/CustomSelect.jsx';
import GeneralButton from '../../Templates/Buttons/GeneralButton.jsx';
import { getDinosaur, saveDinosaur, updateDinosaur } from '../../../actions/dinosaursActions.js';
import CustomAlert from '../../Templates/CustomAlert.jsx';
import { resetItem } from '../../../actions/generalActions.js';

class CreateAndUpdateDinosaurs extends PureComponent {
	constructor(props) {
		super(props);

		const { match, t } = props;

		this.state = {
			imageErrors: [],
			isEdit: match.path.indexOf('/edit-dinosaur') !== -1,
			foodChoicesOptions: foodChoices.map(foodChoice => (
				<option
					key={ foodChoice }
					value={ foodChoice }>
					{ t(foodChoice) }
				</option>
			))
		};
	}

	componentDidMount() {
		const { isEdit } = this.state;
		const { match, dispatch } = this.props;

		if (isEdit) {
			dispatch(getDinosaur(match?.params?.dinosaurId));
		}
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

	_updateInput = (field, setFieldValue) => e => {
		setFieldValue(field, e.target.value);
	};

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

	_handleSubmit = values => {
		const { isEdit } = this.state;
		const { match, dispatch } = this.props;

		let data = {
			image: values.image,
			species: values.species,
			foodPreference: values.foodPreference,
			wikipediaPage: values.wikipediaPage,
			averageSize: values.averageSize,
		};

		if (isEdit) {
			if (isURL(data.image)) {
				delete data.image;
			}
			data = {
				...data,
				id: match.params.dinosaurId
			};
			dispatch(updateDinosaur(data));
		} else {
			dispatch(saveDinosaur(data));
		}
	};

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(resetItem('DINOSAUR'));
	}

	render() {
		const { isEdit, foodChoicesOptions } = this.state;
		const { dinosaurs, t } = this.props;

		if (isEdit && dinosaurs.fetchingDinosaur) {
			return (
				<Card className='general-card small'>
					Loading
				</Card>
			);
		}

		return (
			<Card className='general-card small'>
				<Formik
					initialValues={ {
						image: isEdit ? dinosaurs.dinosaur.image : '',
						species: isEdit ? dinosaurs.dinosaur.species : '',
						foodPreference: isEdit ? dinosaurs.dinosaur.foodPreference : foodChoices?.[0],
						wikipediaPage: isEdit ? dinosaurs.dinosaur.wikipediaPage : '',
						averageSize: isEdit ? dinosaurs.dinosaur.averageSize : '',
					} }
					validationSchema={ Yup.object().shape({
						image: Yup.mixed()
							.nullable(),
						species: Yup.string()
							.nullable()
							.max(128, t('maximum_characters').replace('__max__', 128))
							.required(t('required_field')),
						foodPreference: Yup.string()
							.nullable()
							.oneOf(foodChoices)
							.required(t('required_field')),
						wikipediaPage: Yup.string()
							.nullable()
							.test('valid-link', t('mustBeValidWikipediaLink'), value => value && isURL(value) && new URL(value).hostname.indexOf('wikipedia.org') !== -1)
							.max(256, t('maximum_characters').replace('__max__', 256))
							.required(t('required_field')),
						averageSize: Yup.string()
							.nullable()
							.matches(floatNumberRegex, t('numbers_only'))
							.max(10, t('maximum_characters').replace('__max__', 10))
							.required(t('required_field')),
					}) }
					onSubmit={ this._handleSubmit }>
					{ ({ getFieldProps, setFieldValue, setFieldTouched, values, errors, touched, handleSubmit }) => {
						return (
							<form onSubmit={ handleSubmit }>
								<Grid container>
									<UploadField
										src={ values.image }
										onDrop={ this._onDrop }
										onDropRejected={ this._onDropRejected }
										setFieldValue={ setFieldValue }
										t={ t }/>
								</Grid>
								<Grid
									spacing={ 2 }
									className='manage-dinosaur-fields'
									container>
									<Grid
										item
										xs={ 12 }>
										<TextField
											{ ...getFieldProps('species') }
											variant="outlined"
											fullWidth
											label={ t('dinosaurSpecies') }
											error={ !!errors.species && touched.species }
											helperText={ !!errors.species && touched.species && errors.species }
											onChange={ this._updateInput('species', setFieldValue) }
											onBlur={ this._onBlur('species', setFieldTouched) }
										/>
									</Grid>
									<Grid
										item
										xs={ 12 }>
										<CustomSelect
											{ ...getFieldProps('foodPreference') }
											hideEmpty
											className='calendar-modal-slot-input-50'
											label={ t('dinosaurFoodPreference') }
											options={ foodChoicesOptions }
											onChange={ this._updateInput('foodPreference', setFieldValue) }/>
									</Grid>
									<Grid
										item
										xs={ 12 }>
										<TextField
											{ ...getFieldProps('wikipediaPage') }
											variant="outlined"
											fullWidth
											label={ t('dinosaurWikipediaPage') }
											error={ !!errors.wikipediaPage && touched.wikipediaPage }
											helperText={ !!errors.wikipediaPage && touched.wikipediaPage && errors.wikipediaPage }
											onChange={ this._updateInput('wikipediaPage', setFieldValue) }
											onBlur={ this._onBlur('wikipediaPage', setFieldTouched) }
										/>
									</Grid>
									<Grid
										item
										xs={ 12 }>
										<TextField
											{ ...getFieldProps('averageSize') }
											variant="outlined"
											fullWidth
											label={ t('dinosaurAverageSize') }
											error={ !!errors.averageSize && touched.averageSize }
											helperText={ !!errors.averageSize && touched.averageSize && errors.averageSize }
											onChange={ this._updateInput('averageSize', setFieldValue) }
											onBlur={ this._onBlur('averageSize', setFieldTouched) }
										/>
									</Grid>
								</Grid>
								{ dinosaurs.savingDinosaurError ?
									<CustomAlert
										severity='error'
										message={ dinosaurs.savingDinosaurError }/>
									:
									dinosaurs.savedDinosaur ?
										<CustomAlert
											severity='success'
											message={ t('dinosaurSaved') }/>
										:
										null
								}
								<Grid
									className='manage-dinosaur-actions'
									container>
									{ dinosaurs.savedDinosaur ?
										<GeneralButton href='/private/dinosaurs'>
											{ t('back') }
										</GeneralButton>
										:
										<>
											<GeneralButton
												loading={ dinosaurs.savingDinosaur }
												disabled={ dinosaurs.savingDinosaur }
												onClick={ handleSubmit }
												type='submit'>
												{ t('save') }
											</GeneralButton>
											<GeneralButton href='/private/dinosaurs'>
												{ t('cancel') }
											</GeneralButton>
										</>
									}
								</Grid>
							</form>
						);
					} }
				</Formik>
			</Card>
		);
	}
}

const mapStateToProps = store => ( {
	dinosaurs: store.dinosaurs,
} );

export default withTranslation()(connect(mapStateToProps)(CreateAndUpdateDinosaurs));