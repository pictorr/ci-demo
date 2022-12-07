import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import CustomSelect from '../Templates/CustomSelect.jsx';

class SessionModal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			saveOffer: true,
		}
	}

	_renderSession = () => {
		const { session, } = this.props;

		return session.map(thisSession => {
			return <option>
				{thisSession.data.objective}
			</option>
		})
	}

	_onChange = (e) => {
		this.setState({
			saveOffer: false
		}, () => {
			const { onChange } = this.props;
			onChange(e)();
		})
	}

	render() {
		const { open, onClickCancel, onClickConfirm, t } = this.props;
		const { saveOffer } = this.state;

		return (
			<Dialog
				className="dialog custom-dialog-spinner-wrapper general-card"
				open={ open }
				onClose={ onClickCancel(false) }>
				<DialogTitle className="dialog-title dialog"> 
					{t('choose_project')}
				</DialogTitle>
				<DialogActions className="dialog custom-dialog-spinner-wrapper" >
					<GeneralButton onClick={onClickConfirm(true)}> 
						{t('create_new_project')}
					</GeneralButton>
				</DialogActions>
				<DialogContent className="dialog">
					<CustomSelect
						label={ `${t('select_project')}` }
						options={ this._renderSession() }
						onChange={ this._onChange }/>
				</DialogContent>
				<DialogActions className="dialog custom-dialog-spinner-wrapper" >
					<GeneralButton onClick={ onClickCancel(false) } >
						{t('quit')}
					</GeneralButton>
					<GeneralButton onClick={onClickConfirm(false)} disabled={ saveOffer } > 
						{t('save_offer')}
					</GeneralButton>
				</DialogActions>
			</Dialog>
		);
	}
}

SessionModal.propTypes = {
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

export default SessionModal;
