import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class CustomTableRow extends PureComponent {

	/**
	 * Did not create another component for simplicity. Here are the props for this function
	 * item: {
	    tableCellProps: PropTypes.object //https://material-ui.com/api/table-cell/#tablecell-api !!!Can be passed either individually for an item or as a general prop on CustomTable for all CustomTableRows
	    id: PropTypes.string, //Or _id. Fallback is tableHeaders index
	    ...item fields that you defined in tableHeaders
	 }
	 */
	_renderTableCells = () => {
		const { tableHeaders, item } = this.props;

		return tableHeaders?.map((header, index) => {
			if (header?.id === 'actions') {
				return (
					<TableCell
						key={ index }
						{ ...omit(item?.tableCellProps || {}, ['component', 'to']) }
						className={(item?.tableCellProps?.className || "" )+ (item?.specificTableCellClassName.some(specificClassName => specificClassName?.id === header?.id) ? `${item?.specificTableCellClassName.find(specificClassName => specificClassName?.id === header?.id)?.className}` : "") } >
						{ item?.[header?.id] }
					</TableCell>
				);
			}

			return (
				<TableCell
					key={ index }
					{ ...( item?.tableCellProps || {} ) }
					className={(item?.tableCellProps?.className || "" )+ (item?.specificTableCellClassName.some(specificClassName => specificClassName?.id === header?.id) ? `${item?.specificTableCellClassName.find(specificClassName => specificClassName?.id === header?.id)?.className}` : "") }>
					{ item?.[header?.id] }
				</TableCell>
			);
		});
	};

	render() {
		const { tableRowProps, openCell } = this.props;

		return (
			<TableRow { ...( tableRowProps || {} ) } hover selected={openCell ? true : false}>
				{ this._renderTableCells() }
			</TableRow>
		);
	}
}

CustomTableRow.propTypes = {
	tableRowProps: PropTypes.object, //https://material-ui.com/api/table-row/#tablerow-api !!!Can be passed either individually for an item or as a general prop on CustomTable for all CustomTableRows
	item: PropTypes.object,
};

export default CustomTableRow;