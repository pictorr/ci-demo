import React, { PureComponent } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

class BackButton extends PureComponent {
	render() {
		const { onClick, disabled, t } = this.props;

		return (
			<Toolbar className='dinosaurs-list-toolbar ml-30'>
				<Grid
					// className='dinosaurs-list-toolbar-grid'
					spacing={ 2 }
					container>
					<Grid
						item>
						<GeneralButton
							disabled={disabled}
							onClick={onClick}
							startIcon={<KeyboardBackspaceIcon/>}
						>
							{ t('back') }
						</GeneralButton>
					</Grid>
				</Grid>
			</Toolbar>

		);
	}
}

export default BackButton;