import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Link from '@material-ui/core/Link';

class GuestMenu extends PureComponent {
	render() {
		const { t } = this.props;

		return (
			<>
				<Link
					className = "text-color-toolbar"
					href={ '/login' }
					color="inherit">
					{ t('login') }
				</Link>
				<Link
					className = "text-color-toolbar"
					href={ '/register' }
					color="inherit">
					{ t('register') }
				</Link>
			</>
		);
	}
}

export default withTranslation()(GuestMenu);