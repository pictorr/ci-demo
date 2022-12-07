import React, { PureComponent } from 'react';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import SaveIcon from '@material-ui/icons/Save';

class SaveOfferButton extends PureComponent {
	render() {
		const { onClick, disabled, t } = this.props;

		return (
			<GeneralButton
				prefix = {(<SaveIcon className='mr-10'/>)} 
				className="secondary-button-style pl-17 pr-20"
				disabled={disabled}
				onClick={onClick}
			>
				{ t('save_offer') }
			</GeneralButton>

		);
	}
}

export default SaveOfferButton;