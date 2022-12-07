import React, { PureComponent } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

class ManageOffersButton extends PureComponent {
	render() {
		const { onClick, t } = this.props;

		return (
			<Toolbar className='dinosaurs-list-toolbar'>
				<Grid
					className='dinosaurs-list-toolbar-grid'
					spacing={ 2 }
					container>
					<Grid
						xs={ 12 }
						sm={ 4 }
						md={ 4 }
						lg={ 4 }
						item>
						<GeneralButton onClick={() => onClick()} suffix={(<AddCircleOutlineIcon className='button-icon'/>)}>
							{ t('create_new_session') }
						</GeneralButton>
					</Grid>
				</Grid>
			</Toolbar>

		);
	}
}

export default ManageOffersButton;