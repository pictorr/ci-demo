import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

class PageLoader extends PureComponent {
	render() {
		const { t } = this.props;
		return (
			<main className="page-loader-main">
				<div className="lds-spinner">
					<div/>
				</div>
			</main>
		);
	}
}

export default withTranslation()(PageLoader);