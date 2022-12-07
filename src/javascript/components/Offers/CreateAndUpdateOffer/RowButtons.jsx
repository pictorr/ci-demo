import React, { PureComponent } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import GeneralButton from '../../Templates/Buttons/GeneralButton.jsx';

class RowButtons extends PureComponent {
	render() {
		const { t } = this.props;

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
						lg={ 2 }
						item>
						<GeneralButton href='/private/offers/new-offer'>
							{ t('add_offer') }
						</GeneralButton>
					</Grid>
				</Grid>
			</Toolbar>

		);
	}
}

export default RowButtons;