import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import { withTranslation } from 'react-i18next';
import EmptyTableMessage from '../Templates/Table/EmptyTableMessage.jsx';
import { Card } from '@material-ui/core';
import SaveOfferButton from './SaveOfferButton.jsx';
import SaveCurrentOffers from './SaveCurrentOffers.jsx';
import Typography from '@material-ui/core/Typography';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import CustomDialog from '../Templates/CustomDialog.jsx';
import { resetItem } from '../../actions/generalActions.js';
import { deleteSavedOffers, getSavedOffers, downloadSavedOffer, deleteSavedOffer, deleteOffers, newOffer } from '../../actions/offerActions.js';
import { updateOffersSession, getSession, deleteSessionOffer } from '../../actions/sessionActions.js';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CustomAlert from '../Templates/CustomAlert.jsx';
import CustomSwitch from '../Templates/CustomSwitch.jsx';
import { translationsDetails } from '../../utils/constants.js';
class SavedOffers extends PureComponent {
	constructor(props) {
		super(props);

		const { match, t } = props;

		this.tableHeaders = [
			{ id: 'nr', label: t('nr'),  align:'center' },
			{ id: 'excelName', label: t('boq_code') },
			{ id: 'systemName', label: t('system_name') },
			{ id: 'height', label: t('height'), align: 'right' },
			{ id: 'distanceCeiling', label: t('ceilings_distance'), align: 'right' },
			{ id: 'thicknessSystem', label: t('thickness_system'), align: 'right' },
			{ id: 'fireResistance', label: t('fire_resistance'), align: 'right' },
			{ id: 'moistureResistance', label: t('moisture_resistance'), align: 'right' },
			{ id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right' },
            { id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right' },
			{ id: 'systemCode', label: t('system_code'), align: 'right' },
			{ id: 'surface', label: t('surface'), align: 'right' },
			{ id: 'pricePerUnit', label: t('price_per_unit'), align: 'right' },
			{ id: 'price', label: t('price'), align: 'right' },
			{ id: 'actions', label: t('actions'), align: 'right' },
		];

		this.tableHeaders2 = [
			{ id: 'nr', label: t('nr'),  align:'center' },
			{ id: 'excelName', label: t('boq_code') },
			{ id: 'price', label: t('price'), align: 'right' },
			{ id: 'actions', label: t('actions'), align: 'right' },
		];

		this.state = {
			isEdit: match.path.indexOf('/edit') !== -1,
			deleteDialogOpen: false,
			offerId: null,
			tableHeaders: this.tableHeaders,
			deactivateColumns: false,
		};
	}

	_deactivateColumns = () => () => {
        this.setState((prevState) => ({
            deactivateColumns: !prevState.deactivateColumns,
            tableHeaders: !prevState.deactivateColumns === true ? this.tableHeaders2 : this.tableHeaders
        }))
    }

	componentDidMount() {
		const { match, dispatch } = this.props;
		const { isEdit } = this.state;
        window.addEventListener('resize', this._changeColumns);

		if (isEdit) {
			dispatch(getSession(match?.params?.id));
		}
		else {
			dispatch(getSavedOffers());
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {offerId} = this.state;
		const {offer} = this.props;
		if (prevProps.offer.downloadedOffer !== this.props.offer.downloadedOffer && this.props.offer.downloadedOffer && offerId) {
			setTimeout(() => {
				window.open(`${process.env.REACT_APP_PUBLIC_UPLOADS}/${offer.fileName}`);
				this.setState({
					offerId: null
				})
			}, 500);
		}
	}

	// This is not included in CustomTable because you might want to customize it for your project
	_getTableEmptyComponent = () => {
		const { t } = this.props;

		return (
			<EmptyTableMessage message={ t('list_empty') }/>
		);
	};

	_handleDeleteDialog = (state, offerId) => () => {
		this.setState(prevState => ( {
			deleteDialogOpen: state === false || state === true ? state : !prevState.deleteDialogOpen,
			offerId: state === true || ( typeof state !== 'boolean' && !prevState.deleteDialogOpen ) ? offerId : null,
		} ), () => {
			const { deleteDialogOpen, isEdit } = this.state;
			const { dispatch } = this.props;

			if (!deleteDialogOpen) {
				if(isEdit) { 
					dispatch(resetItem('DELETE_SESSION_OFFER'));
				}
				else {
					dispatch(resetItem('DELETE_SAVED_OFFER'));
				}
			}
		});
	};

	_deleteSavedOffer = () => {
		const { offerId } = this.state;
		const { dispatch } = this.props;

		dispatch(deleteSavedOffer(offerId));
	};

	_deleteOfferSession = () => {
		const { offerId } = this.state;
		const { dispatch, match } = this.props; 

		dispatch({ type: 'DELETE_SAVED_OFFER_FULFILLED', payload:{offerId: offerId} });
		dispatch(deleteSessionOffer(match.params.id, offerId));
	};

	_downloadOffer = (offerId) => (e) => {
		const { dispatch, location } = this.props;
		let split = location.pathname.split('/');
		let sessionId = split[5];

		this.setState({ 
			offerId: offerId 
		});
		
		dispatch(downloadSavedOffer(sessionId, offerId));
	}

	_handleOffer = (type, offer, offerId) => () => {
		const { history, match, dispatch } = this.props;
		dispatch(deleteOffers());

		history.push(`/private/sessions/session/edit/${ match.params.id }/offers/view/${ offer._id }`);
	}

    _mapSavedOffers = () => {
		const { offer, t } = this.props;
		const { isEdit } = this.state;

		return offer.userSavedOffers.filter(thisOffer => isEdit || thisOffer.status === 'saved').map((thisOffer, index) => {
			let fire = '';
			if (thisOffer.fireResistance.includes(t('minute'))) {
				fire = thisOffer.fireResistance;
			}
			else
			if (thisOffer.fireResistance.includes('m')) {
				fire = thisOffer.fireResistance.slice(0, -1) + ` ${t('minute')} `;
			}
			else {
				fire = thisOffer.fireResistance + ` ${t('minute')}`
			}
			return ({
				...thisOffer,
				nr: index + 1,
				height: thisOffer.systemName?.includes('Plafoane') ? '-' : thisOffer.height + ' m',
				distanceCeiling: thisOffer.systemName?.includes('Plafoane') ? thisOffer.height + ' cm' : '-',
				systemCode: thisOffer.systemCodeTable,
				systemName: t(translationsDetails[thisOffer.systemName]),
				burglaryResistance: thisOffer.burglaryResistance || '-',
				fireResistance: fire,
				soundInsulation: thisOffer.soundInsulation === 'Nu' ? t('Nu') : t('Da'),
				price: thisOffer.price.toFixed(2),
				pricePerUnit: (thisOffer.price / thisOffer.surface).toFixed(2),
				surface: thisOffer.surface.toFixed(2),
				specificTableCellClassName: [{
					id: "price",
					className: "offer-list-number-cell"
				},{
					id: "pricePerUnit",
					className: "offer-list-number-cell"
				}, {
					id: "surface",
					className: "offer-list-number-cell"
				}, {
					id: "systemCode",
					className: "offer-list-number-cell"
				}, {
					id: "height",
					className: "offer-list-number-cell"
				}, {
					id: "distanceCeiling",
					className: "offer-list-number-cell"
				}, {
					id: "fireResistance",
					className: "offer-list-number-cell"
				}, {
					id: "burglaryResistance",
					className: "offer-list-number-cell"
				}, {
					id: "moistureResistance",
					className: "offer-list-number-cell"
				}, {
					id: "izolareAcustica",
					className: "offer-list-number-cell"
				}, {
					id: "thicknessSystem",
					className: "offer-list-number-cell"
				}],
				actions: (
					<div className='dinosaurs-list-actions'>
						<GeneralButton
							key='download'
							title={`${t('download_offer')}`}
							onClick={ this._downloadOffer(thisOffer._id) }
							className='dinosaurs-list-action-button'>
							<DownloadIcon className='dinosaurs-list-action-button-icon'/>
						</GeneralButton>
						<GeneralButton
							title={`${t('delete_offer')}`}
							key='delete'
							onClick={ this._handleDeleteDialog(true, thisOffer._id) }
							className='dinosaurs-list-action-button edit'>
							<DeleteIcon className='dinosaurs-list-action-button-icon'/>
						</GeneralButton>
						<GeneralButton
							key='view'
							title={t('offer_details')}
							onClick={ this._handleOffer(thisOffer.systemName.includes("Placari") && thisOffer.systemName.includes("Noisy") === false ? 'Placari' : 'Pereti', thisOffer, thisOffer._id)}
							className='dinosaurs-list-action-button edit'>
							<VisibilityIcon className='dinosaurs-list-action-button-icon'/>
						</GeneralButton>
					</div>
				)
			})
		})
    }

    _newOffer = () => {
        const { dispatch } = this.props;
        dispatch(newOffer(this._newOfferCallback));
	}

	_newOfferCallback = offerId => {
        const { history, match } = this.props;
		const { isEdit } = this.state;
        history.push(isEdit ? `/private/sessions/session/edit/${match.params.id}/offers/new-offer/${offerId}` : `/private/sessions/session/${match.params.id}/offers/new-offer/${offerId}`);
    }

	_makeStructure = (face) => {
        if (face.plate3) {
            return {
                plate1: face.plate1,
                plate2: face.plate2,
                plate3: face.plate3
            }
        }
        if (face.plate2) {
            return {
                plate1: face.plate1,
                plate2: face.plate2,
            }
        }
        return {
            plate1: face.plate1,
        }
    }
	
	_saveSession = () => {
		const { dispatch, offer, match } = this.props;
		let restructure = [];
		offer.userSavedOffers.filter(thisOffer => thisOffer.status === 'saved').forEach(thisOffer => {
			let face1Structure = {}, face2Structure = {};

			if (thisOffer?.plate?.face1) {
				face1Structure = this._makeStructure(thisOffer.plate.face1);
				face2Structure = this._makeStructure(thisOffer.plate.face2);
			}

			let data = {
				savedOfferId: thisOffer.savedOfferId,
				profileType: thisOffer.profileType,
				fireResistance: thisOffer.fireResistance,
				moistureResistance: thisOffer.moistureResistance,
				burglaryResistance: thisOffer.burglaryResistance || '',
				soundInsulation: thisOffer.soundInsulation,
				ceilingSupport: thisOffer.ceilingSupport,
				protectionSense: thisOffer.protectionSense,
				height: thisOffer.height,
				support: thisOffer.support,
				finishing: thisOffer.finishing,
				izolareAcustica: thisOffer.izolareAcustica,
				interax: thisOffer.interax,
				interaxSustineri: thisOffer.interaxSustineri || '',
				price: thisOffer.price,
				consumption: thisOffer.consumption,
				consumptionExterior: thisOffer.consumptionExterior,
				face1: face1Structure || {plate1: '', plate2: '', plate3: ''},
				face2: face2Structure || {plate1: '', plate2: '', plate3: ''},
				initialFace1: thisOffer.initialPlate ? thisOffer.initialPlate.face1 : {plate1: '', plate2: '', plate3: ''},
				initialFace2: thisOffer.initialPlate ? thisOffer.initialPlate.face2 : {plate1: '', plate2: '', plate3: ''},
				systemName: thisOffer.systemName,
				systemCode: thisOffer.systemCode,
				systemCodeTable: thisOffer.systemCodeTable,
				platingPlates: thisOffer.platingPlates || {plate1: '', plate2: '', plate3: '', plate4: ''},
                platingInitialPlates: thisOffer.platingInitialPlates || {plate1: '', plate2: '', plate3: '', plate4: ''},
				status: thisOffer.status
			}
			restructure.push(data);
		}) 

        dispatch(updateOffersSession(restructure, match.params.id));
        dispatch(deleteSavedOffers())
	}

	render() {
		const { deleteDialogOpen, isEdit, deactivateColumns, tableHeaders } = this.state;
		const { offer, session, t } = this.props;

		if (offer.fetchingSavedOffer) {
			return (
				<Card className='general-card small'>
					Loading
				</Card>
			);
		}

		return (
			<Card className='general-card'>
				<div className="title-buttons">
					<div className="ml-30">
						<Typography
							className="rubrik-font"
							variant="h4"
							component="h1">
							{ `${t('manage_offers')} - ${session?.session?.data?.objective ? session?.session?.data?.objective : ''}` }
						</Typography>
					</div>
					<div className="ml-30 mr-30 mt-16 mb-16 max-width">
						<SaveOfferButton 
							newOffer={this._newOffer}
							t={ t }/>
						<SaveCurrentOffers 
							newOffer={this._saveSession}
							t={ t }/>
					</div>
				</div>
				<div className='compact-toggle items-center mb-16 mr-30'>
					<span className="margin-5">
						{t('less_table_cols')}
					</span> 
					<CustomSwitch
						color='default'
						className='toggle-style'
						checked={ deactivateColumns }
						onClick={ this._deactivateColumns() }
					>
					</CustomSwitch>
				</div>
				{offer.userSavedOffers.filter(thisOffer => (isEdit || thisOffer.status === 'saved') && thisOffer?.plate?.face1).length > 0 ? 
					<div className="ml-30 mr-30">
						<CustomTable
							t={t}
							stickyHeaderProp = {true}
							WrapperComponent={ Card }
							defaultOrderBy='species'
							tableHeaders={ tableHeaders }
							TableEmptyComponent={ this._getTableEmptyComponent() }
							data={ this._mapSavedOffers() }/>
					</div> 
				: 	<div className="flex-center">
						<div className="custom-alert-info">
							<CustomAlert
							severity='info'
							message={ t('no_offers') }/>
						</div>
					</div>
				}
				<CustomDialog
					title={ t('delete_offer_title') }
					description={ t('delete_offer_description') }
					agreeText={ t('confirm') }
					disagreeText={ t('cancel') }
					successMessage={ isEdit ? session.deletedSessionOffer ? t('deleted_session_offer') : null : offer.deletedOffer ? t('deleted_offer') : null }
					errorMessage={ isEdit ? session.deletingSessionOfferError : offer.deletingOfferError }
					open={ deleteDialogOpen }
					loading={ isEdit ? session.deletingSessionOffer : offer.deletingOffer }
					handleDialog={ this._handleDeleteDialog }
					onAgree={ isEdit ? this._deleteOfferSession : this._deleteSavedOffer }
					t={ t }/>
			</Card>
		);
	}
}

const mapStateToProps = store => ( {
	offer: store.offer,
	session: store.session,
	authentication: store.authentication,
} );

export default withTranslation()(connect(mapStateToProps)(SavedOffers));