import React, { PureComponent } from 'react';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

class BackToOffersButton extends PureComponent {
	render() {
		const { onClick, disabled, className, t } = this.props;

		return (
			<GeneralButton
				className="pl-17 pr-20"
				disabled={disabled}
				onClick={onClick}
				prefix={<KeyboardBackspaceIcon className='mr-10'/>}
			>
				{ t('back_to_offers') }
			</GeneralButton>

		);
	}
}

export default BackToOffersButton;