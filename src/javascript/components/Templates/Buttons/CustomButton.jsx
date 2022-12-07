import React, { PureComponent } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import GeneralButton from './GeneralButton.jsx';

class CustomButton extends PureComponent {
	render() {
		const { className, onClick, disabled, startIcon, className2, title, prefix } = this.props;

		return (
			<Toolbar className={`dinosaurs-list-toolbar ml-30 ${className2}`}>
				<Grid
					spacing={ 2 }
					container>
					<Grid
						item>
						<GeneralButton
							prefix={prefix}
                            className = {className}
							disabled={disabled}
							onClick={onClick}
							startIcon={startIcon}
						>
							{ title }
						</GeneralButton>
					</Grid>
				</Grid>
			</Toolbar>

		);
	}
}

export default CustomButton;