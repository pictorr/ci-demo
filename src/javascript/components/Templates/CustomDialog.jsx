import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SpinnerForButtons from './Buttons/SpinnerForButtons.jsx';
import CustomAlert from './CustomAlert.jsx';
import GeneralButton from './Buttons/GeneralButton';
import SecondaryButton from './Buttons/SecondaryButton';

class CustomDialog extends PureComponent {
	render() {
		const {
			title, description, agreeText, disagreeText, open, loading, errorMessage, successMessage, closeText,
			handleDialog, onAgree, t
		} = this.props;

		return (
			<Dialog
				className="dialog custom-dialog-spinner-wrapper"
				open={ open }
				onClose={ handleDialog(false) }>
				<DialogTitle className="dialog-title dialog">{ title }</DialogTitle>
				<DialogContent
				className="dialog custom-dialog-spinner-wrapper flex-col"
				>
					<DialogContentText>
						{ description }
					</DialogContentText>
					{ errorMessage ?
						<CustomAlert
							severity='error'
							message={ errorMessage }/>
						:
						successMessage ?
							<CustomAlert
								severity='success'
								message={ successMessage }/>
							:
							null
					}
				</DialogContent>
				<DialogActions
				className="dialog custom-dialog-spinner-wrapper"
				>
					{ loading ?
						<div>
							<SpinnerForButtons/>
						</div>
						:
						successMessage ?
							<SecondaryButton onClick={ handleDialog(false) }>
								{ closeText || t('close') }
							</SecondaryButton>
							:
							<>
								<SecondaryButton onClick={ handleDialog(false) } className="mr-16">
									{ disagreeText }
								</SecondaryButton>
								<GeneralButton
									onClick={ onAgree }
									>
									{ agreeText }
								</GeneralButton>
							</>
					}
				</DialogActions>
			</Dialog>
		);
	}
}

CustomDialog.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	agreeText: PropTypes.string.isRequired,
	disagreeText: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	loading: PropTypes.bool,
	handleDialog: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	onAgree: PropTypes.func.isRequired,
	errorMessage: PropTypes.string,
	successMessage: PropTypes.string,
	closeText: PropTypes.string,
};

export default CustomDialog;
