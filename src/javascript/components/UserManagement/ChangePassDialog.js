import React, { PureComponent } from 'react';
import { Dialog, DialogActions, DialogTitle, Grid, TextField } from '@material-ui/core';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateUserPassword } from '../../actions/usersActions.js';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import SecondaryButton from '../Templates/Buttons/SecondaryButton.jsx';
import { withStyles } from '@material-ui/core/styles';
import CustomAlert from "../Templates/CustomAlert";

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

class ChangePassDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      password: ''
    }
  }

  _handleSubmit = (values) => {
    const {userId, dispatch, onClose} = this.props;
    const data = {
      userId: userId,
      password: values.password,
      sendEmail: true
    }

    dispatch(updateUserPassword(data));
    onClose();
  }

  render() {
    const {title, agreeText, disagreeText, open, onClose, t} = this.props;

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
              password: ''
            } }
            validationSchema={ Yup.object().shape({
              password: Yup.string()
                .nullable()
                .min(8, t('minimum_characters').replace('__min__', 8))
                .max(128, t('maximum_characters').replace('__max__', 128))
                .required(t('required_field')),
            }) }
            onSubmit={ this._handleSubmit }>
            { ({handleSubmit, errors, touched, handleChange, handleBlur, values}) => {
              return (
                <Form
                  className='custom-dialog-spinner-wrapper'
                  onSubmit={ handleSubmit }>
                  <Grid container spacing={ 2 }>
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
                        error={ errors.password }
                        onChange={ handleChange }
                        onBlur={ handleBlur }
                      />
                      { errors?.password && touched.password ? <CustomAlert xs={ 12 } className='authentication-alert' severity='error' message={ errors.password }/>:null}
                    </Grid>
                  </Grid>
                  <br />
                  <GeneralButton
                    disabled={ errors?.password }
                    onClick={ () => this._handleSubmit(values) }
                    type="submit">
                    { agreeText }
                  </GeneralButton>
                  <SecondaryButton
                    onClick={ onClose }
                    variant="contained"
                    color="secondary">
                    { disagreeText }
                  </SecondaryButton>

                </Form>
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
