import React, { PureComponent } from 'react';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import SaveIcon from '@material-ui/icons/Save';

class SaveCurrentOffers extends PureComponent {
	render() {
		const { newOffer, t } = this.props;

		return (

			<GeneralButton href='/private/sessions' onClick={newOffer} prefix = {(<SaveIcon className='button-icon mr-10'/>)} className="secondary-button-style">
				{ t('save_session') }
			</GeneralButton>

		);
	}
}

export default SaveCurrentOffers;