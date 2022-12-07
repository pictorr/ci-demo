import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import omit from 'lodash/omit';
import SpinnerForButtons from './SpinnerForButtons.jsx';
import { withTranslation } from 'react-i18next';

class DefaultButton extends PureComponent {
	render() {
		const { loading, disabled, children } = this.props;

		return (
			<Button
				{ ...omit(this.props, ['loading', 'className']) }
				className={ `js-focus-visible ${ disabled ? ' disabled-button' : '' }` }>
				{ loading ? (
					<SpinnerForButtons/>
				) : children }
			</Button>
		);
	}
}

export default withTranslation()(DefaultButton);
