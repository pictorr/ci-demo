import React, { PureComponent } from 'react';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

class SaveOfferButton extends PureComponent {
	render() {
		const { newOffer, t } = this.props;

		return (
			<GeneralButton onClick={newOffer} prefix={(<AddCircleOutlineIcon className='button-icon mr-10'/>)}>
				{ t('new_offer') }
			</GeneralButton>
		);
	}
}

export default SaveOfferButton;