import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import omit from 'lodash/omit';
import { colours } from '../../../utils/colours.js';
import CachedIcon from '@material-ui/icons/Cached';

const styles = theme => ( {
	margin: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	root: {
		width: '100%',
		color: colours.white,
		fontSize: '16px',
		fontWeight: '600',
		lineHeight: 2,
		boxShadow: 'none',
		backgroundColor: colours.purple,
		textTransform: 'uppercase',
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'Segoe UI',
			'Roboto',
			'Helvetica Neue',
			'sans-serif',
		].join(','),
		'&:disabled': {
			color: colours.white,
			backgroundColor: colours.purple,
			cursor: 'not-allowed',
		},
		'&:focus': {
			borderColor: colours.purpleHover,
			backgroundColor: colours.purple,
			color: colours.white,
		},
		'&:hover': {
			backgroundColor: colours.purpleHover,
			color: colours.white,
		},
	},
} );

class GeneralButton extends PureComponent {
	render() {
		const { classes, loading, disabled, className, children, suffix, prefix } = this.props;

		return (
			<Button
				{ ...omit(this.props, ['loading', 'className']) }
				style={{borderRadius:"0px"}}
				className={ `js-focus-visible ${ classes.margin }${ className ? ` ${ className }` : '' }${ disabled ? ' disabled-button' : '' }` }>
				{!loading && prefix ?
					prefix
				:null}
				{ loading ? (
					<CachedIcon className="rotating mr-5"/>
				) : null }
				{children}
				{!loading && suffix ?
					suffix
				:null}
			</Button>
		);
	}
}

GeneralButton.propTypes = {
	href: PropTypes.string,
	onClick: PropTypes.func,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

export default withStyles(styles)(GeneralButton);
