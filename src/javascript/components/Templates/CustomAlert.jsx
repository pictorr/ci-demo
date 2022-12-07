import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

class CustomAlert extends PureComponent {
	render() {
		const { severity, message, className } = this.props;

		return (
			<div className={ `custom-alert${ className ? ` ${ className }` : '' }` }>
				<Alert severity={ severity }>
					{ message }
				</Alert>
			</div>
		);
	}
}

CustomAlert.propTypes = {
	severity: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default CustomAlert;