import React, { PureComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Logo from '../../Templates/Logo.jsx';
import LanguageSelect from './LanguageSelect';

// This can be used if you want to have a different header for the authentication pages or other pages, just rename it accordingly
class AuthenticationHeader extends PureComponent {
	render() {
		const { t } = this.props;

		return (
			<div>
            	<Logo />
				<AppBar className="meniu-bar-style" position="relative">
					<Toolbar className="toolbar-style">
					<Link
						className = "text-color-toolbar"
						href={ '/' }
						color="inherit">
						{ t('home') }
					</Link>
					{/* {process.env.REACT_APP_ENABLE_INTL === 'true' && */}
							<LanguageSelect />
					{/* } */}
				</Toolbar>
			</AppBar>
			</div>
		);
	}
}

export default withTranslation()(AuthenticationHeader);