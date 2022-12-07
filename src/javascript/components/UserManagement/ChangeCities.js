import React, { PureComponent } from 'react';
import { Dialog, DialogActions, DialogTitle, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/usersActions.js';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import SecondaryButton from '../Templates/Buttons/SecondaryButton.jsx';
import { counties } from '../../utils/constants.js';
import { withStyles } from '@material-ui/core/styles';
import { cloneDeep } from 'lodash';

const GreenCheckbox = withStyles({
    root: {
      color: '#A61F7D',
      '&$checked': {
        color: '#A61F7D',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class ChangePassDialog extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            city: '',
            numberColumns: 3,
            selected: [],
        }
    }

    componentDidMount() {
        let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }

        let allSelected = [];

        const { user } = this.props;

        if (user?.cities?.length) {
            this.setState({
                selected: user.cities,
            })
        }
        else {
            counties[lang].forEach((county, index) => {
                allSelected.push({
                    county: county,
                    selected: false,
                })
            })
    
            this.setState({
                selected: allSelected,
            })
        }

    }

    _handleChange = (index) => (e) => {
        const { selected } = this.state;

        let newSelected = cloneDeep(selected);

        newSelected[index].selected = !newSelected[index].selected;

        this.setState({
            selected: newSelected
        })
    }

    _handleSubmit = () => {
        const {selected} = this.state;
        const {userId, dispatch, onClose} = this.props;
        const data = {
            id: userId,
            cities: selected,
            sendEmail: true
        }

        dispatch(updateUser(data));
        onClose();
    }

    render() {
        const {title, agreeText, disagreeText, open, onClose, t} = this.props;
        const {city, numberColumns, selected} = this.state;

        let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }

        let styles = ['one', 'two', 'three', 'four'];

        return (
            <Dialog
                className="dialog custom-dialog-spinner-wrapper"
                open={ open }
                onClose={ onClose }>
                <DialogTitle className="dialog-title dialog">
                    { title }
                </DialogTitle>
                <DialogActions>
                    <Formik
                        initialValues={ {
                            city: ''
                        } }
                        validationSchema={ Yup.object().shape({
                            city: Yup.string()
                                .nullable()
                                .min(7, t('minimum_characters').replace('__min__', 7))
                                .max(128, t('maximum_characters').replace('__max__', 128))
                                .required(t('required_field')),
                        }) }
                        onSubmit={ this._handleSubmit }>
                        { ({handleSubmit}) => {
                            return (
                                <form
                                    className='custom-dialog-spinner-wrapper'
                                    onSubmit={ handleSubmit }>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 12 }>
                                        <div class="wrapper">
                                            {
                                                selected.map((el, index) => {
                                                    return <div className={`${styles[(index) % numberColumns]}`}> <FormControlLabel
                                                        control={<GreenCheckbox
                                                            checked={el.selected}
                                                            onChange={this._handleChange(index)}
                                                            name={el.county}
                                                        />}
                                                        label={el.county}
                                                    />
                                                    </div>
                                                })
                                            }
                                        </div>

                                        </Grid>
                                    </Grid>
                                    <br />
                                    <GeneralButton
                                        onClick={ this._handleSubmit }
                                        type="submit">
                                        { agreeText }
                                    </GeneralButton>
                                    <SecondaryButton
                                        onClick={ onClose }
                                        variant="contained"
                                        color="secondary">
                                        { disagreeText }
                                    </SecondaryButton>
                                    
                                </form>
                            );
                        } }
                    </Formik>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = store => ({
    authentication: store.authentication
});

export default withTranslation()(connect(mapStateToProps)(ChangePassDialog));
