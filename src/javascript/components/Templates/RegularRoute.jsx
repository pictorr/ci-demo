import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import omit from 'lodash/omit';

class RegularRoute extends PureComponent {
	_onRenderRoute = props => {
		const { loggedIn, Component } = this.props;
		return (
			<Component
				{ ...props }
				loggedIn={ loggedIn }/>
		);
	};

	render() {
		const { render } = this.props;
		// Very important, do not remove Component from this, otherwise this won't work
		const routeProps = omit(this.props, ['children', 'loggedIn', 'Component']);

		return (
			<Route
				{ ...routeProps }
				render={ render || this._onRenderRoute }
			/>
		);
	}
}

export default RegularRoute;