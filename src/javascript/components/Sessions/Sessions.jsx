import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import { withTranslation } from 'react-i18next';
import EmptyTableMessage from '../Templates/Table/EmptyTableMessage.jsx';
import { Card } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import CustomDialog from '../Templates/CustomDialog.jsx';
import SearchIcon from '@material-ui/icons/Search';
import { resetItem } from '../../actions/generalActions.js';
import { downloadSession, getSessions, saveSession, updateSavedOffer, deleteSavedSession, deleteSavedOffers } from '../../actions/offerActions.js';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CustomSwitch from '../Templates/CustomSwitch.jsx';
import { colours } from '../../utils/colours.js';
import CircularProgress from '@material-ui/core/CircularProgress';

class SavedOffers extends PureComponent {
	constructor(props) {
		super(props);

		const { t } = props;

		this.tableHeaders = [
			{ id: 'nr', label: t('nr'), align:"center" },
			{ id: 'objective', label: t('objective') },
			{ id: 'typeObjective', label: t('type_objective') },
			{ id: 'code', label: t('project_code') },
			{ id: 'company', label: t('company') },
			{ id: 'phoneNumber', label: t('phone_number') },
			{ id: 'numberOfOffers', label: t('number_of_offers') },
			{ id: 'data', label: t('date_created') },
			{ id: 'dataValidation', label: t('date_validation') },
			{ id: 'price', label: t('price'), align: "right" },
			{ id: 'actions', label: t('actions'), align: 'right' },
		];

		this.tableHeaders2 = [
			{ id: 'nr', label: t('nr'), align:"center" },
			{ id: 'objective', label: t('objective') },
			{ id: 'price', label: t('price'), align: "right" },
			{ id: 'actions', label: t('actions'), align: 'right' },
		];

		this.state = {
			deleteDialogOpen: false,
			sessionId: null,
			searchValue: '',
			tableHeaders: this.tableHeaders,
			sessions: [],
			filteredSessions: [],
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
		const { dispatch } = this.props;

		let promises = [dispatch(getSessions())];

		return Promise.all(promises).then(() => {
			const { offer } = this.props;
			let promises2 = [];
			offer.sessions.forEach(session => {
				if ((!(session.data && session.data.company))) {
					promises2.push(dispatch(deleteSavedSession(session._id)))
				}
			})
			return Promise.all(promises2).then(() => {
				dispatch(getSessions());
			})
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { sessionId } = this.state;
		const { offer } = this.props;
		if (prevProps.offer.downloadedSession !== this.props.offer.downloadedSession && this.props.offer.downloadedSession && sessionId) {
			setTimeout(() => {
				window.open(`${process.env.REACT_APP_PUBLIC_UPLOADS}/${offer.fileName}`);
				this.setState({
					offerId: null
				})
			}, 500);
		}

		if (prevProps?.offer?.sessions !== this.props?.offer?.sessions) {
			this._mapData();
		}
	}

	_getTableEmptyComponent = () => {
		const { t } = this.props;

		return (
			<EmptyTableMessage message={t('list_empty')} />
		);
	};

	_handleDeleteDialog = (state, sessionId) => () => {
		this.setState(prevState => ({
			deleteDialogOpen: state === false || state === true ? state : !prevState.deleteDialogOpen,
			sessionId: state === true || (typeof state !== 'boolean' && !prevState.deleteDialogOpen) ? sessionId : null,
		}), () => {
			const { deleteDialogOpen } = this.state;
			const { dispatch } = this.props;

			if (!deleteDialogOpen) {
				dispatch(resetItem('DELETE_SESSION'));
			}
		});
	};

	_deleteSavedSession = () => {
		const { sessionId } = this.state;
		const { dispatch } = this.props;

		dispatch(deleteSavedSession(sessionId));
	};

	_downloadSession = (sessionId) => (e) => {
		const { dispatch } = this.props;
		this.setState({ sessionId: sessionId });
		dispatch(downloadSession(sessionId));
	}

	_updateSavedOffersUser = (thisSession) => {
		const { dispatch } = this.props;
		thisSession.session.forEach(offer => {
			dispatch(updateSavedOffer(offer.sessions[0].id, offer))
		})
	}

	_viewSession = (id) => () => {
		const { history } = this.props;
		history.push(`/private/sessions/session/edit/${id}/offers`);
	}

	_mapData = () => {
		const { offer, t } = this.props;
		const { sessionId } = this.state;
		let updatedSessions = [...offer?.sessions];

		updatedSessions = updatedSessions.map((thisSession, index) => {
			let sum = 0;
			thisSession.session.forEach(session => {
				sum += session.price;
			})
			return ({
				...thisSession,
				specificTableCellClassName: [{
					id: "price",
					className: "offer-list-number-cell"
				}],
				nr: index + 1,
				numberOfOffers: thisSession.session.length,
				data: moment(thisSession.createdOn).format('DD/MM/YYYY'),
				dataValidation: thisSession?.data?.validationDate ? moment(thisSession?.data?.validationDate).format('DD/MM/YYYY') : null,
				company: thisSession?.data?.company,
				contactPerson: thisSession?.data?.contactPerson,
				objective: thisSession?.data?.objective,
				typeObjective: thisSession?.data?.typeObjective,
				code: thisSession?.data?.code,
				email: thisSession?.data?.email,
				location: thisSession?.data?.location,
				phoneNumber: thisSession?.data?.phoneNumber,
				price: sum.toFixed(2),
				actions: (
					<div className='dinosaurs-list-actions'>
						{offer.downloadingSession && sessionId === thisSession._id
							? <CircularProgress />
							: <GeneralButton
								key='download'
								title={t('download_session')}
								onClick={this._downloadSession(thisSession._id)}
								disabled={thisSession.session.length === 0}
								className='dinosaurs-list-action-button'>
								<DownloadIcon className='dinosaurs-list-action-button-icon' />
							</GeneralButton>
						}
						<GeneralButton
							key='delete'
							title={t('delete_session')}
							onClick={this._handleDeleteDialog(true, thisSession._id)}
							className='dinosaurs-list-action-button edit'>
							<DeleteIcon className='dinosaurs-list-action-button-icon' />
						</GeneralButton>
						<GeneralButton
							key='edit'
							title={t('edit_session')}
							onClick={() => this._updateSavedOffersUser(thisSession)}
							href={`/private/sessions/session/edit/${thisSession._id}`}
							className='dinosaurs-list-action-button edit'>
							<EditIcon className='dinosaurs-list-action-button-icon' />
						</GeneralButton>
						<GeneralButton
							key='view'
							title={t('view_session_offers')}
							onClick={this._viewSession(thisSession._id)}
							className='dinosaurs-list-action-button edit'>
							<VisibilityIcon className='dinosaurs-list-action-button-icon' />
						</GeneralButton>
					</div>
				),
			})
		})

		this.setState({
			sessions: updatedSessions,
			filteredSessions: updatedSessions
		});
	}

	_filterData = () => {
		const { sessions, filteredSessions, searchValue } = this.state;
		let updatedSessions = [...filteredSessions];
		if (searchValue.length > 0) {
			updatedSessions = updatedSessions.filter(el =>
				el?.objective?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
				el?.typeObjective?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
				el?.code?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
				el?.company?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
				el?.phoneNumber?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
				el?.validationDate?.toLowerCase()?.includes(searchValue.toLowerCase())
			);
		} else {
			updatedSessions = [...sessions];
		}

		this.setState({
			filteredSessions: updatedSessions
		});
	}

	_redirectPage = (sessionId) => {
		const { history } = this.props;

		history.push(`/private/sessions/session/edit/${sessionId}`);
	}

	_newSession = () => {
		const { dispatch } = this.props;
		dispatch(deleteSavedOffers())
		dispatch(saveSession(this._redirectPage))
	}

	_onChange = (e) => {
		this.setState({
			searchValue: e.target.value
		}, () => {
			this._filterData();
		});
	}

	render() {
		const { deleteDialogOpen, searchValue, searchFiels, filteredSessions, deactivateColumns, tableHeaders } = this.state;
		const { offer, t } = this.props;

		return (
			<ThemeProvider theme={ createTheme({
				palette: {
					primary: {
						main: colours.purple,
						light: colours.purple
					},
					secondary: {
						main: colours.purple
					},
				},
			}) }>
				<Card className='general-card'>
					<div className='dinosaurs-list-title-wrapper'>
						<Typography
							className="rubrik-font"
							variant="h4"
							component="h1">
							{t('sessions_offers')}
						</Typography>
					</div>
					<div className="searchAndButton">
						<div className="ml-30 flex-jb">
							<TextField
								InputProps={{
									startAdornment: (
									<InputAdornment position="start">
										<SearchIcon className="primaryColorIcons"/>
									</InputAdornment>
									),
								}}
								// variant="outlined"
								placeholder={t('search')}
								className="min-width-search mt-16 ml-3"
								size="medium"
								value={searchValue}
								onChange={this._onChange}
							/>
						</div>
						<div className="ml-30 mr-30 mt-16">
							<GeneralButton onClick={this._newSession} prefix={(<AddCircleOutlineIcon className='button-icon mr-10' />)} className="pl-17 pr-20">
								{t('create_new_session')}
							</GeneralButton>
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
					<div className="ml-30 mr-30 flex-col">
						<CustomTable
							t={t}
							searchValue={searchValue}
							searchFiels={searchFiels}
							WrapperComponent={Card}
							// orderBy={"createdOn"}
							// order={"desc"}
							rowsPerPage={100}
							tableHeaders={tableHeaders}
							TableEmptyComponent={this._getTableEmptyComponent()}
							data={filteredSessions} />
					</div>
					<CustomDialog
						title={t('delete_session_title')}
						description={t('delete_session_description')}
						agreeText={t('confirm')}
						disagreeText={t('cancel')}
						successMessage={offer.deletedSession ? t('delete_session') : null}
						errorMessage={offer.deletingSessionError}
						open={deleteDialogOpen}
						loading={offer.deletingSession}
						handleDialog={this._handleDeleteDialog}
						onAgree={this._deleteSavedSession}
						t={t} />
				</Card>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = store => ({
	offer: store.offer,
	authentication: store.authentication,
});

export default withTranslation()(connect(mapStateToProps)(SavedOffers));