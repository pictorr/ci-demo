import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class CustomLink extends PureComponent {
	render() {
		const { className, href, target, children, title } = this.props;
		return (
			<Link
				className={ className || '' }
				title={ title }
				to={ `${ href !== '/' ? href : '/' }` }
				target={ target || '_self' }>
				{ children }
			</Link>
		);
	}
}

CustomLink.propTypes = {
	className: PropTypes.string,
	href: PropTypes.string.isRequired,
	target: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
	title: PropTypes.string,
};

export default CustomLink;
