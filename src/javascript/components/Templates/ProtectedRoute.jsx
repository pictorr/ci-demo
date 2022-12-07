import React, { PureComponent } from 'react';
import { Redirect, Route } from 'react-router-dom';
import omit from 'lodash/omit';

class ProtectedRoute extends PureComponent {
	_onRenderRoute = props => {
		const { loggedIn, Component } = this.props;

		if (loggedIn) {
			return (
				<Component
					{ ...props }
					loggedIn={ loggedIn }/>
			);
		}
		return (
			<Redirect to={ '/login' }/>
		);
	};

	render() {
		// Very important, do not remove Component from this, otherwise this won't work
		const routeProps = omit(this.props, ['children', 'loggedIn', 'Component']);

		return (
			<Route
				{ ...routeProps }
				render={ this._onRenderRoute }
			/>
		);
	}
}

export default ProtectedRoute;