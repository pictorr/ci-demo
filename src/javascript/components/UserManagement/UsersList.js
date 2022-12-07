import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, Select, Typography } from '@material-ui/core';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import { getUser, getUsers, updateUser } from '../../actions/usersActions.js';
import { getItemFromStorage } from "../../utils/utils";
import { Redirect } from "react-router-dom";
import CustomSwitch from '../Templates/CustomSwitch.jsx';
import moment from 'moment';
import DownloadUsers from "./DownloadUsers";
import EditIcon from '@material-ui/icons/Edit';
import ChangePassDialog from './ChangePassDialog';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import ChangeCities from './ChangeCities.js';
import CustomSelect from '../Templates/CustomSelect.jsx';
import { statesRo, countryCodes } from '../../utils/constants.js'

class UsersList extends PureComponent {
    constructor(props) {
        super(props);

        const {t} = props;

        this.tableHeaders = [
            {id: 'nr', label: t('nr'), align: 'left'},
            {id: 'fullName', label: t('last_name'), align: 'right'},
            {id: 'emailAddress', label: t('email'), align: 'right'},
            {id: 'phoneNumber', label: t('phone_number'), align: 'right'},
            {id: 'lastLogin', label: t('last_login'), align: 'right'},
            {id: 'createdOn', label: t('created_on'), align: 'right'},
            {id: 'state', label: t('state'), align: 'right'},
            {id: 'job', label: t('job'), align: 'right'},
            {id: 'logins', label: t('logins_number'), align: 'right'},
            {id: 'actions', label: t('actions'), align: 'right'},
            {id: 'activated', label: t('status_active'), align: 'right'},
            {id: 'isAdmin', label: t('is_admin'), align: 'right'},
            {id: 'functionalitiesAccess', label: t('access'), align: 'right'},
            {id: 'cities', label: t('county'), align: 'right'},
        ];

        this.tableHeaders2 = [
            {id: 'nr', label: t('nr'), align: 'left'},
            {id: 'fullName', label: t('last_name'), align: 'right'},
            {id: 'emailAddress', label: t('email'), align: 'right'},
            {id: 'phoneNumber', label: t('phone_number'), align: 'right'},
            {id: 'logins', label: t('logins_number'), align: 'right'},
            {id: 'actions', label: t('actions'), align: 'right'},
            {id: 'activated', label: t('status_active'), align: 'right'},
            {id: 'isAdmin', label: t('is_admin'), align: 'right'},
        ];

        this.state = {
            redirect: false,
            loggedUserRole: 'general',
            tableHeaders: this.tableHeaders,
            showDialog: false,
            editedUserId: '',
            deactivateColumns: false,
            country: 'ro'
        };
    }

    componentDidMount() {
        this._restrictAccess();

        const {dispatch} = this.props;
        dispatch(getUsers());
        dispatch(getUser(getItemFromStorage('userId')));

        let allStates = [];

        statesRo.forEach( state => {
            allStates.push({
                city: state,
                checked: false,
            })
        })

        this.setState({
            states: allStates
        })
    }

    _restrictAccess = () => {
        let hasAccess = false;
        if (getItemFromStorage('isAdmin') === 'true') {
            hasAccess = true;
            this.setState({
                loggedUserRole: 'admin'
            });
        }
        if (getItemFromStorage('isMasterAdmin') === 'true') {
            hasAccess = true;
            this.setState({
                loggedUserRole: 'masterAdmin'
            });
        } else {
            this._removeMasterAdminColumn();
        }
        if (!hasAccess) {
            this.setState({
                redirect: true
            });
        }
    }

    _removeMasterAdminColumn = () => {
        const {tableHeaders} = this.state;
        let filteredTabledHeaders;
        if (getItemFromStorage('isAdmin') === 'true') {
            filteredTabledHeaders = tableHeaders.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities");
        }
        else {
            filteredTabledHeaders = tableHeaders.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities" && el.id !== "state" && el.id !== "job");
        }
        this.setState({
            tableHeaders: filteredTabledHeaders
        });
    }

    _mapUsersList = () => {
        const { users, t } = this.props;
        const { country } = this.state;
        let thisUser = {};

        users.users.forEach(user => {
            if (user.id === getItemFromStorage('userId')) {
                thisUser = user;
            }
        })

        return users.users.filter(user => {
            let ok = false, activated = false, activated2 = false;

            const { states } = this.state;

            if (getItemFromStorage('isAdmin') === 'true') {
                states?.forEach(state => {
                    if (state.checked === true && user.state === state.city ) {
                        ok = true;
                    }
                    if (state.checked === true) {
                        activated = true;
                    }
                })
            }
            
            if (getItemFromStorage('isMasterAdmin') === 'false') {
                if (thisUser.country === 'ro') {
                    thisUser.cities.forEach(city => {
                        if (city.selected === true && user.state === city.county && activated === false) {
                            ok = true
                        }
                    })
                }
                else {
                    if (thisUser.country === user.country) {
                        ok = true;
                    }
                }
            }

            if ((country === thisUser?.country || getItemFromStorage('isMasterAdmin') === 'true') && country !== 'select-value' && country !== 'ro' && activated === false) {
                activated2 = true;
                if (user.country !== country) {
                    ok = false;
                }
                else {
                    ok = true;
                }
            }

            if (user.id === thisUser.id) {
                ok = false
            }

            if (getItemFromStorage('isMasterAdmin') === 'true' && activated === false && activated2 === false) {
                ok = true
            }

            return ok;
        }).map((user, index) => {
            return ({

                ...user,
                nr: index + 1,
                fullName: `${ user.firstName } ${ user.lastName }`,
                lastLogin: user?.lastLogin ? moment(user.lastLogin).format('YYYY-MM-DD') : '-',
                createdOn: user?.createdOn ? moment(user.createdOn).format('YYYY-MM-DD') : '-',
                logins: user?.logins ? user?.logins?.length : '-',
                specificTableCellClassName: [ {
                    id: "fullName",
                    className: "offer-list-number-cell"
                },{
                    id: "emailAddress",
                    className: "offer-list-number-cell"
                },{
                    id: "phoneNumber",
                    className: "offer-list-number-cell"
                },{
                    id: "lastLogin",
                    className: "offer-list-number-cell"
                },{
                    id: "createdOn",
                    className: "offer-list-number-cell"
                },{ 
                    id: "logins",
                    className: "offer-list-number-cell"
                },{
                    id: "actions",
                    className: "offer-list-number-cell"
                },{
                    id: "activated",
                    className: "offer-list-number-cell"
                },{
                    id: "isAdmin",
                    className: "offer-list-number-cell"
                },{
                    id: "functionalitiesAccess",
                    className: "offer-list-number-cell"
                },{
                    id: "cities",
                    className: "offer-list-number-cell"
                },{
                    id: "job",
                    className: "offer-list-number-cell"
                },{
                    id: "state",
                    className: "offer-list-number-cell"
                } ],
                actions: (
                    <div className='dinosaurs-list-actions'>
                        <GeneralButton
                            className='dinosaurs-list-action-button'
                            title={t('edit_password_confirm')}
                            onClick={ this._handleOpenDialog(user.id) }
                            onClose={ this._handleCloseDialog }
                        >
                            <EditIcon className='dinosaurs-list-action-button-icon'/>
                        </GeneralButton>
                    </div>
                ),
                activated: (
                    <div>
                        <CustomSwitch
                            color='default'
                            className='toggle-style'
                            checked={ user.activated }
                            disabled={user.isMasterAdmin}
                            onClick={ this._handleUpdateUser(user.id, {activated: !user.activated}) }
                        >
                        </CustomSwitch>
                    </div>
                ),
                isAdmin: (
                    <div>
                        <CustomSwitch
                            className='toggle-style'
                            checked={ user.isAdmin }
                            disabled={user.isMasterAdmin}
                            onClick={ this._handleUpdateUser(user.id, {isAdmin: !user.isAdmin, functionalitiesAccess: true}) }
                        >
                        </CustomSwitch>
                    </div>
                ),
                functionalitiesAccess: (
                    <div>
                        <CustomSwitch
                            className='toggle-style'
                            checked={ user.isAdmin || user.functionalitiesAccess }
                            disabled={user.isAdmin}
                            onClick={ this._handleUpdateUser(user.id, {functionalitiesAccess: !user.functionalitiesAccess}) }
                        >
                        </CustomSwitch>
                    </div>
                ),
                cities: (
                    <div className='dinosaurs-list-actions'>
                        <GeneralButton
                            className='dinosaurs-list-action-button'
                            title={t('edit_cities')}
                            onClick={ this._handleOpenDialog2(user.id, user) }
                            onClose={ this._handleCloseDialog }
                            disabled={user.isMasterAdmin || user.country !== 'ro'}
                        >
                            <EditIcon className='dinosaurs-list-action-button-icon'/>
                        </GeneralButton>
                    </div>
                )
            })
        });
    };

    _handleUpdateUser = (userId, data) => (e) => {
        const {dispatch} = this.props;
        data = {...data, id: userId}
        dispatch(updateUser(data));
    } 

    _handleOpenDialog = (userId) => (e) => {
        this.setState({
            showDialog: true,
            editedUserId: userId
        });
    }

    _handleOpenDialog2 = (userId, user) => (e) => {
        this.setState({
            user: user,
            showDialog2: true,
            editedUserId: userId
        });
    }
    _handleCloseDialog2 = () => (e) => {
        this.setState({
            showDialog2: false,
            editedUserId: ''
        });
    }

    _handleCloseDialog = () => (e) => {
        this.setState({
            showDialog: false,
            editedUserId: ''
        });
    }

    _deactivateColumns = () => () => {
        this.setState((prevState) => ({
            deactivateColumns: !prevState.deactivateColumns,
            tableHeaders: !prevState.deactivateColumns === true ? 
                        getItemFromStorage('isAdmin') === 'true' ? this.tableHeaders2.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities") : getItemFromStorage('isMasterAdmin') === 'false' ? this.tableHeaders2.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities" && el.id !== "state" && el.id !== "job") : this.tableHeaders2 : 
                        getItemFromStorage('isAdmin') === 'true' ? this.tableHeaders.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities") : getItemFromStorage('isMasterAdmin') === 'false' ? this.tableHeaders.filter(el => el.id !== 'actions' && el.id !== 'isAdmin' && el.id !== "cities" && el.id !== "state" && el.id !== "job") : this.tableHeaders
        }))
        
    }

    _updateCity = () => (e) => {
        const { states } = this.state;
        let allStates = [];

        states.forEach(state => {
            if(state.city === e.target.value) {
                allStates.push({
                    city: state.city,
                    checked: !state.checked
                })
            }
            else {
                allStates.push({
                    city: state.city,
                    checked: state.checked
                })
            }
        })

        this.setState({
            city: " ",
            states: allStates,
            country: 'ro'
        })
    }
    
    _renderCountiesList = () => {
        const { states } = this.state;
        const { users } = this.props;
        let thisUser = {};

        users.users.forEach(user => {
            if (user.id === getItemFromStorage('userId')) {
                thisUser = user;
            }
        })

        return states?.map((state) =>  { 
            let disableState = true
            thisUser.cities?.forEach(city => {
                if (state.city === city.county && city.selected === true) {
                    disableState = false
                }
            })

            if (getItemFromStorage('isMasterAdmin') === 'true') { 
                disableState = false;
            }

            return  <option
			            style={state.checked ? {backgroundColor:'green'} : null}
                        key={ state.city }
                        disabled={disableState}
                        value={ state.city }>
                        { state.city }
                    </option>
        })
    }

    _updateCountry = () => (e) => {
        this.setState({
            country: e.target.value,
        })
    }
    
    _renderCountriesList = () => {
        return countryCodes?.map((country) =>  { 
            return  <option
                        key={ country.value }
                        value={ country.value }>
                        { country.label }
                    </option>
        })
    }

    render() {
        const { redirect, loggedUserRole, tableHeaders, showDialog, editedUserId, deactivateColumns, showDialog2, user, city, states, country } = this.state;
        const { users, t } = this.props;
        let activatedFilter = false, thisUser;

        states?.forEach(state => {
            if(state.checked === true) {
                activatedFilter = true;
            }
        })

        users.users?.forEach(user => {
            if (user.id === getItemFromStorage('userId')) {
                thisUser = user;
            }
        })

        if (redirect) {
            return <Redirect to={ '/' }/>
        }

        return (
            <>
                <Card className='general-card'>
                    <div className='dinosaurs-list-title-wrapper'>
                        <Typography
                            className="rubrik-font"
                            variant="h4"
                            component="h1">
                            { t('manage_users') }
                        </Typography>
                       
                        <div className='searchAndButton'>
                            <div className='searchAndButton'>
                                { loggedUserRole === 'masterAdmin' && <div className="center-button margin-10"><DownloadUsers/></div> }
                                <div className="margin-10">
                                {states !== undefined && thisUser?.country === 'ro'? 
                                    <CustomSelect
                                        label={ 'Judet' }
                                        options={ this._renderCountiesList() }
                                        value={ city }
                                        readOnly={ country !== 'ro' }
                                        onChange={ this._updateCity() }/>
                                    :null}
                                </div>
                                <div className="margin-10">
                                {countryCodes !== undefined && getItemFromStorage('isMasterAdmin') === 'true' && thisUser?.country === 'ro'? 
                                    <CustomSelect
                                        label={ 'Tara' }
                                        options={ this._renderCountriesList() }
                                        value={ country }
                                        readOnly = {activatedFilter}
                                        onChange={ this._updateCountry() }/>
                                    :null}
                                </div>
                            </div>
                            <div className='compactTable'>
                                <span className="margin-5 items-center">
                                    {t('less_table_cols')}
                                </span> 
                                <CustomSwitch
                                    color='default'
                                    className='toggle-style'
                                    checked={ deactivateColumns }
                                    onClick={ this._deactivateColumns() }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="ml-30 mr-30">
                        <CustomTable
                            t={t}
                            stickyHeaderProp = {true}
                            WrapperComponent={ Card }
                            defaultOrderBy='nr'
                            tableHeaders={ tableHeaders }
                            data={ this._mapUsersList() }/>
                    </div>
                </Card>
                { showDialog &&
                <ChangePassDialog
                    open={ showDialog }
                    userId={ editedUserId }
                    title={ t('change_password') }
                    agreeText={ t('save_password') }
                    disagreeText={ t('back') }
                    onClose={ this._handleCloseDialog() }
                />
                }
                { showDialog2 &&
                <ChangeCities
                    open={ showDialog2 }
                    userId={ editedUserId }
                    user={ user }
                    title={ t('change_county') }
                    agreeText={ t('save_county') }
                    disagreeText={ t('back') }
                    onClose={ this._handleCloseDialog2() }
                />
                }
            </>
        );
    }
}

const mapStateToProps = store => ({
    users: store.users,
});

export default withTranslation()(connect(mapStateToProps)(UsersList));