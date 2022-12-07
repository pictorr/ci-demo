import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHeaders from './TableHeaders.jsx';
import { getComparator, pickFromPropsOrState, stableSort } from '../../../utils/utils.js';
import CustomTableRow from './CustomTableRow.jsx';

class CustomTable extends PureComponent {
	constructor(props) {
		super(props);

		const { defaultOrder, defaultOrderBy, tableHeaders } = props;

		this.state = {
			order: defaultOrder || 'asc',
			orderBy: defaultOrderBy || tableHeaders?.[0]?.id,
			page: 0,
			rowsPerPage: 25,
			tableSize: 'medium',
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this._changeTableDimension);
	}

	_changeTableDimension = () => { 
		if (window.innerWidth <= 1250) {
            this.setState({
                tableSize: 'small'
            })
        }
        else {
            this.setState({
                tableSize: 'medium'
            })
        }
	}

	componentWillUnmount() {
        window.removeEventListener('resize', this._changeNumberColumns)
    }

	_handleRequestSort = (e, orderBy) => {
		this.setState(prevState => ( {
			order: prevState.orderBy === orderBy && prevState.order === 'asc' ? 'desc' : 'asc',
			orderBy: orderBy,
		} ));
	};

	_handleChangePage = (e, newPage) => {
		this.setState({
			page: newPage
		});
	};

	_handleChangeRowsPerPage = e => {
		this.setState({
			page: 0,
			rowsPerPage: e.target.value
		});
	};

	_renderRows = () => {
		const { TableRowComponent, tableHeaders, data, tableRowProps, tableCellProps } = this.props;
		const order = pickFromPropsOrState('order', this);
		const page = pickFromPropsOrState('page', this);
		const orderBy = pickFromPropsOrState('orderBy', this);
		const rowsPerPage = pickFromPropsOrState('rowsPerPage', this);

		return stableSort(data, getComparator(order, orderBy))
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			.map((row, index) => {

				// "key" passed individually so that eslint shuts up
				const propsToPass = {
					tableHeaders: tableHeaders,
					tableRowProps: row?.tableRowProps || tableRowProps || {},
					item: {
						...row,
						tableCellProps: row?.tableCellProps || tableCellProps || {},
					},
				};

				if (TableRowComponent) {
					return (
						<TableRowComponent
							key={ row?.id || row?._id || index }
							{ ...propsToPass }/>
					);
				}

				return (
					<CustomTableRow
						key={ row?.id || row?._id || index }
						openCell = {row?.openCell}
						{ ...propsToPass }/>
				);
			});
	};

	render() {
		const {
			hidePaginaton, TableEmptyComponent, tableHeaders, data, rowsPerPageOptions, WrapperComponent, wrapperComponentProps,
			handleRequestSort, handleChangeRowsPerPage, handleChangePage, stickyHeaderProp, t
		} = this.props;
		const { tableSize } = this.state;

		const order = pickFromPropsOrState('order', this);
		const page = pickFromPropsOrState('page', this);
		const orderBy = pickFromPropsOrState('orderBy', this);
		const rowsPerPage = pickFromPropsOrState('rowsPerPage', this);

		const emptyRows = 10 - Math.min(10, data.length - page * 10);

		const TableRootComponent = WrapperComponent || Paper;

		return (
			<TableRootComponent { ...( wrapperComponentProps || {} ) }>
				<TableContainer>
					<Table stickyHeader size={`${tableSize}`} >
						<TableHeaders
							order={ order }
							orderBy={ orderBy }
							rowCount={ data?.length }
							tableHeaders={ tableHeaders || [] }
							onRequestSort={ handleRequestSort || this._handleRequestSort }/>
						{ data?.length ? (
							<TableBody>
								{ this._renderRows() }
							</TableBody>
						) : null }
						{ data?.length > 6 && emptyRows ? (
							<TableRow style={ { height: 38 * emptyRows } }>
								<TableCell colSpan={ 6 }/>
							</TableRow>
						) : null }
					</Table>
				</TableContainer>
				{ data?.length
					? null
					: TableEmptyComponent
						? ( typeof TableEmptyComponent === 'function' ? TableEmptyComponent() : TableEmptyComponent )
						: null
				}
				{
				!hidePaginaton ?
					<TablePagination
						rowsPerPageOptions={ rowsPerPageOptions || [25, 50, 100] }
						component="div"
						labelRowsPerPage={`${t('rows_per_page')}`}
						count={ data?.length }
						rowsPerPage={ rowsPerPage }
						page={ page }
						onChangePage={ handleChangePage || this._handleChangePage }
						onChangeRowsPerPage={ handleChangeRowsPerPage || this._handleChangeRowsPerPage }
					/>
					: null
				}
			</TableRootComponent>
		);
	}
}

// 1. tableHeaders.label: accept Proptypes.func
CustomTable.propTypes = {
	tableHeaders: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
	})).isRequired,
	data: PropTypes.array.isRequired,
	defaultOrderBy: PropTypes.string,
	order: PropTypes.string,
	orderBy: PropTypes.string,
	handleRequestSort: PropTypes.func,
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
	handleChangeRowsPerPage: PropTypes.func,
	handleChangePage: PropTypes.func,
	TableEmptyComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.node]),
	TableRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.node]),
	tableRowProps: PropTypes.object,
	tableCellProps: PropTypes.object,
	WrapperComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.node]), // example: <CustomTable WrapperComponent={ Card }/>. NOT WORKING FOR: <CustomTable WrapperComponent={ <Card/> }/>. WrapperComponent's render will be: render() { return ( <tagName> {...other stuff} {this.props.children} {...other stuff} </tagName>
	wrapperComponentProps: PropTypes.object,
	hidePaginaton: PropTypes.bool
};

export default CustomTable;
