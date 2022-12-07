import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { colours } from '../../../utils/colours.js';

const styles = theme => ( {
	root: {
		position: 'relative',
		display: 'inline-block',
		lineHeight: 0,
	},
	bottom: {
		color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
	},
	top: {
		color: colours.blue,
		animationDuration: '550ms',
		position: 'absolute',
		left: 0,
	},
	circle: {
		strokeLinecap: 'round',
	},
} );

class SpinnerForButtons extends PureComponent {
	render() {
		const { classes } = this.props;

		return (
			<div className={ classes.root }>
				<CircularProgress
					variant="determinate"
					className={ classes.bottom }
					size={ 24 }
					thickness={ 4 }
					{ ...this.props }
					value={ 100 }
				/>
				<CircularProgress
					variant="indeterminate"
					disableShrink
					className={ classes.top }
					classes={ {
						circle: classes.circle,
					} }
					size={ 24 }
					thickness={ 4 }
					{ ...this.props }
				/>
			</div>
		);
	}
}

export default withStyles(styles)(SpinnerForButtons);