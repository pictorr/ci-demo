import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class EmptyTableMessage extends PureComponent {
	render() {
		const { message } = this.props;

		return (
			<div className='empty-table-message-container'>
				<p className='empty-table-message'>
					{ typeof message === 'function' ? message() : message }
				</p>
			</div>
		);
	}
}

EmptyTableMessage.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node, PropTypes.object]).isRequired
};

export default EmptyTableMessage;