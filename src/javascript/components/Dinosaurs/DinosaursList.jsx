import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import { withTranslation } from 'react-i18next';
import EmptyTableMessage from '../Templates/Table/EmptyTableMessage.jsx';
import { Card } from '@material-ui/core';
import RowButtons from './RowButtons.jsx';
import Typography from '@material-ui/core/Typography';
import { deleteDinosaur, getDinosaurs } from '../../actions/dinosaursActions.js';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomDialog from '../Templates/CustomDialog.jsx';
import { resetItem } from '../../actions/generalActions.js';
import { Link } from 'react-router-dom';

class DinosaursList extends PureComponent {
	constructor(props) {
		super(props);

		const { t } = props;

		this.tableHeaders = [
			{ id: 'species', label: t('dinosaurSpecies') },
			{ id: 'foodPreference', label: t('dinosaurFoodPreference') },
			{ id: 'wikipediaPage', label: t('dinosaurWikipediaPage') },
			{ id: 'averageSize', label: t('dinosaurAverageSize') },
			{ id: 'actions', label: t('actions'), align: 'right' },
		];

		this.state = {
			deleteDialogOpen: false,
			dinosaurId: null,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(getDinosaurs());
	}

	// This is not included in CustomTable because you might want to customize it for your project
	_getTableEmptyComponent = () => {
		const { t } = this.props;

		return (
			<EmptyTableMessage message={ t('list_empty') }/>
		);
	};

	_handleDeleteDialog = (state, dinosaurId) => () => {
		this.setState(prevState => ( {
			deleteDialogOpen: state === false || state === true ? state : !prevState.deleteDialogOpen,
			dinosaurId: state === true || ( typeof state !== 'boolean' && !prevState.deleteDialogOpen ) ? dinosaurId : null,
		} ), () => {
			const { deleteDialogOpen } = this.state;
			const { dispatch } = this.props;

			if (!deleteDialogOpen) {
				dispatch(resetItem('DELETE_DINOSAUR'));
			}
		});
	};

	_deleteDinosaur = () => {
		const { dinosaurId } = this.state;
		const { dispatch } = this.props;

		dispatch(deleteDinosaur(dinosaurId));
	};

	_mapDinosaursList = () => {
		const { dinosaurs } = this.props;

		return dinosaurs.dinosaurs.map(dinosaur =>  {
			return ( { 
			...dinosaur,
			specificTableCellClassName: [{
				id: "averageSize",
				className: "dinosaurs-list-number-cell"
			}],
			tableCellProps: {
				component: Link,
				to: `/private/dinosaurs/dinosaur/${ dinosaur.id }`,
			},
			actions: (
				<div className='dinosaurs-list-actions'>
					<GeneralButton
						key='delete'
						onClick={ this._handleDeleteDialog(true, dinosaur.id) }
						className='dinosaurs-list-action-button'>
						<DeleteIcon className='dinosaurs-list-action-button-icon'/>
					</GeneralButton>
					<GeneralButton
						key='edit'
						href={ `/private/dinosaurs/edit-dinosaur/${ dinosaur.id }` }
						className='dinosaurs-list-action-button edit'>
						<EditIcon className='dinosaurs-list-action-button-icon'/>
					</GeneralButton>
				</div>
			)
		} )});
	};

	render() {
		const { deleteDialogOpen } = this.state;
		const { dinosaurs, t } = this.props;

		return (
			<Card className='general-card'>
				<div className='dinosaurs-list-title-wrapper'>
					<Typography
						variant="h4"
						component="h1">
						{ t('manageDinosaurs') }
					</Typography>
				</div>
				<div>
					<RowButtons t={ t }/>
					<CustomTable
						WrapperComponent={ Card }
						defaultOrderBy='species'
						tableHeaders={ this.tableHeaders }
						TableEmptyComponent={ this._getTableEmptyComponent() }
						data={ this._mapDinosaursList() }/>
				</div>
				<CustomDialog
					title={ t('deleteDinosaurTitle') }
					description={ t('deleteDinosaurDescription') }
					agreeText={ t('confirm') }
					disagreeText={ t('cancel') }
					successMessage={ dinosaurs.deletedDinosaur ? t('deletedDinosaur') : null }
					errorMessage={ dinosaurs.deletingDinosaurError }
					open={ deleteDialogOpen }
					loading={ dinosaurs.deletingDinosaur }
					handleDialog={ this._handleDeleteDialog }
					onAgree={ this._deleteDinosaur }
					t={ t }/>
			</Card>
		);
	}
}

const mapStateToProps = store => ( {
	dinosaurs: store.dinosaurs,
	authentication: store.authentication,
} );

export default withTranslation()(connect(mapStateToProps)(DinosaursList));