import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

const PurpleCheckbox = withStyles({
    root: {
      color: '#A61F7D',
      '&$checked': {
        color: '#A61F7D',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class CustomOfferModals extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			checked: false
		}
	}

	_changeChecked = () => {
		this.setState({
			checked: !this.state.checked,
		})
	}

	render() {
		const { open, closeText, handleDialog, t } = this.props;

		if (open === 'false') {
			return null
		}
		else {
			return (
				<Dialog
					className="dialog custom-dialog-spinner-wrapper"
					open={ open }
					onClose={ handleDialog(false) }>
					<DialogTitle className="dialog-title dialog"> { t('compatible_offers') }</DialogTitle>
					<DialogContent
					className="dialog custom-dialog-spinner-wrapper flex-col"
					>
						<DialogContentText>
							{ t('description_popup') }
						</DialogContentText>
					</DialogContent>
					<DialogActions className="dialog custom-dialog-spinner-wrapper" >
						<PurpleCheckbox checked={this.state.checked} onClick={this._changeChecked}/> 
							{t("dont_show_message")}
					</DialogActions>
					<DialogActions className="dialog custom-dialog-spinner-wrapper" >
						<GeneralButton onClick={ handleDialog(false, this.state.checked) }>
							{ closeText || t('close') }
						</GeneralButton>
					</DialogActions>
				</Dialog>
			);
		}
	}
}

CustomOfferModals.propTypes = {
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

export default CustomOfferModals;
