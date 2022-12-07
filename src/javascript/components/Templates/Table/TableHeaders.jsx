import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';

const styles = () => ( {
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
} );

class TableHeader extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			paddingSize: 'normal',
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this._changeTableDimension);
	}

	_changeTableDimension = () => {
		if (window.innerWidth <= 1250) {
            this.setState({
                paddingSize: 'none'
            })
        }
        else {
            this.setState({
                paddingSize: 'normal'
            })
        }
	}

	componentWillUnmount() {
        window.removeEventListener('resize', this._changeNumberColumns)
    }

	_createSortHandler = value => e => {
		const { onRequestSort } = this.props;

		onRequestSort(e, value);
	};

	_renderTableColumns = () => {
		const { paddingSize } = this.state;
		const { classes, order, orderBy, tableHeaders } = this.props;

		return tableHeaders.map(headCell => (
			<TableCell
				key={ headCell.id }
				padding={`${paddingSize}`}
				align={ headCell.align || 'left' }
				sortDirection={ orderBy === headCell.id ? order : false }>
				<TableSortLabel
					active={ orderBy === headCell.id }
					direction={ orderBy === headCell.id ? order : 'asc' }
					onClick={ this._createSortHandler(headCell.id) }>
					{ headCell.label }
					{ orderBy === headCell.id ? (
						<p className={ classes.visuallyHidden }>
							{ order === 'desc' ? 'sorted descending' : 'sorted ascending' }
						</p>
					) : null }
				</TableSortLabel>
			</TableCell>
		));
	};

	render() {
		return (
			<TableHead>
				<TableRow>
					{ this._renderTableColumns() }
				</TableRow>
			</TableHead>
		);
	}
}

export default withStyles(styles)(TableHeader);
