import React, {PureComponent} from 'react';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import { sendDoubleStructuredSystemsData, sendSystemsData, sendConsumptionsData, sendAllowedPlatesData, getAllowedPlates, importProducts, getUploads, sendPlatingSystemsData, sendSpecialWalls, sendCeilingData  } from '../../actions/importsActions.js';
import UploadExcel from './UploadExcel.jsx';
import CustomAlert from "../Templates/CustomAlert";
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import { Card, Collapse, Grid, List, ListItem, ListItemIcon, ListItemText, Typography} from '@material-ui/core';
import { ExpandLess, ExpandMore} from '@material-ui/icons';
import moment from 'moment';
import {getItemFromStorage} from "../../utils/utils";
import {Redirect} from "react-router-dom";
import PublishIcon from '@material-ui/icons/Publish';
import CachedIcon from '@material-ui/icons/Cached';
import { getUser } from '../../actions/usersActions.js';

class ExcelImport extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            files: '',
            fileErrors: [],
            importName: "0",
            importDateTime: '-',
            importSource: '-',
            importUser: '-',
            openConsumuri: false,
            openSisteme: false,
            openPlaciPermise: false,
            openProducts: false,
            openPlacari: false,
            openCeiling: false,
            redirect: false,
            dropped: false,
        }
    }
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getAllowedPlates());
        dispatch(getUploads());

        let hasAccess = false;
        if (getItemFromStorage('isAdmin') === 'true') {
            hasAccess = true;
        }
        if (getItemFromStorage('isMasterAdmin') === 'true') {
            hasAccess = true;
        }
        if (!hasAccess) {
            this.setState({
                redirect: true
            });
        }
    }

    _handleClickConsumuri = () => () => {
        this.setState(prevState => ({
            openConsumuri: !prevState.openConsumuri,
            importName: prevState.importName.includes("Consumuri") ? "0" : prevState.importName
        }))
    };

    _handleClickSisteme = () => () => {
        this.setState(prevState => ({
            openSisteme: !prevState.openSisteme,
            importName: prevState.importName.includes("Sisteme") ? "0" : prevState.importName
        }))
    };

    _handleClickPlacari = () => () => {
        this.setState(prevState => ({
            openPlacari: !prevState.openPlacari,
            importName: prevState.importName.includes("Sisteme") ? "0" : prevState.importName
        }))
    };

    _handleClickCeiling = () => () => {
        this.setState(prevState => ({
            openCeiling: !prevState.openCeiling,
            importName: prevState.importName.includes("Sisteme") ? "0" : prevState.importName
        }))
    };

    _handleClickPlaciPermise = () => () => {
        this.setState(prevState => ({
            openPlaciPermise: !prevState.openPlaciPermise,
            importName: prevState.importName.includes("PlaciPermise") ? "0" : prevState.importName
        }))
    };

    _handleClickProducts = () => () => {
        this.setState(prevState => ({
            openProducts: !prevState.openProducts,
            importName: prevState.importName.includes("Produse") ? "0" : prevState.importName
        }))
    };

    _handleClick = name => () => {
        const {uploads} = this.props.imports;
        let country = localStorage.getItem('language') || 'ro';
        let upload = uploads.find(upload => upload.importName === name && upload.language === country);

        let importDateTime = '-';
        let importSource = '-';
        let importFileName = '-';
        if (upload) {
            let date = new Date(upload.createdAt);
            importDateTime = moment(date).format('YYYY-MM-DD HH:mm');
            if (upload.sourceFileName) {
                importSource = upload.sourceFileName;
            }
            if (upload.fileName) {
                importFileName = upload.fileName;
            }
        }

        const { dispatch } = this.props;
        if (upload?.user) {
            dispatch(getUser(upload?.user, () => {
                const { users } = this.props;
                this.setState({
                    importName: name,
                    importDateTime: importDateTime,
                    importSource: importSource,
                    importUser: users?.user?.lastName ? users.user.lastName + " " + users.user.firstName : null ,
                    importFileName: importFileName,
                    dropped: false,
                })
            }))
        }
        else {
            this.setState({
                importName: name,
                importDateTime: importDateTime,
                importSource: importSource,
                importFileName: importFileName,
                dropped: false,
            })
        }
    }

    _onDrop = setFieldValue => acceptedFiles => {
        this.setState({
            fileErrors: [],
            dropped: true,
        })
        setFieldValue('file', acceptedFiles[0]);
    };

    _handleSubmit = values => {
        const {dispatch} = this.props;
        const {importName} = this.state;
        this.setState({
            files: values.file
        });
        if (importName.includes("Consumuri - Plafoane")) {
            dispatch(sendConsumptionsData({...values, importName}));
        } else if (importName.includes("Plafoane")) {
            dispatch(sendCeilingData({...values, importName}));
        }
        else {
            if (importName.includes("Placi Permise")) {
                dispatch(sendAllowedPlatesData({...values, importName}));
            }
            else {
                if (importName.includes('Produse')) {
                    dispatch(importProducts({...values, importName}));
                }
                else {
                    if (importName.includes("Consumuri")) {
                        dispatch(sendConsumptionsData({...values, importName}));
                    }
                    else {
                        if(importName.includes("Pereti Smart")) {
                            dispatch(sendSystemsData({...values, importName}));
                        }
                        else {
                            if(importName.includes("Pereti Separativi")) {
                                dispatch(sendSpecialWalls({...values, importName}));
                            } else {
                                if(importName.includes("Noisy") || importName.includes("Pereti")) {
                                    dispatch(sendDoubleStructuredSystemsData({...values, importName}));
                                }
                                else {
                                    if(importName.includes("Placari")) {
                                        dispatch(sendPlatingSystemsData({...values, importName}));
                                    }
                                    else {
                                        if (importName.includes("Sisteme")) {
                                            dispatch(sendSystemsData({...values, importName}));
                                        }
                                        else {
                                            if (importName.includes("Consumuri")) {
                                                dispatch(sendConsumptionsData({...values, importName}));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    _onDropRejected = reason => {
        const {t} = this.props;

        let newState = {
            fileErrors: [],
        };
        if (reason[0].errors[0].code === 'file-too-large') {
            newState = {
                fileErrors: [...newState.fileErrors, t('file_too_large')]
            };
        }
        if (reason[0].errors[0].code === 'file-invalid-type') {
            newState = {
                fileErrors: [...newState.fileErrors, t('file_wrong_file_type_spreadsheet')]
            };
        }

        this.setState(newState);
    };

    _handleDownloadLastUploaded = (value) => () => {
        if (value) {
            setTimeout(() => {
                window.open(`${process.env.REACT_APP_PUBLIC_UPLOADS}/${value}`);
            }, 100);
        }
    }

    _renderOption = () => {
        const { imports, t } = this.props;
        const { fileErrors, importName, importDateTime, importSource, importUser } = this.state;
        console.log(imports?.importedFile)

        return (
            <div className="text-import-file">
                {importName === "0"
                    ?
                    null
                    :
                    <div>
                        <div>
                            {t('attach_file_for')} <strong>{importName}</strong>
                        </div>
                        <div>
                            {t('attach_file_by')} <strong>{importUser}</strong>
                        </div>
                        {imports ? <>
                                <div>
                                    {t('attach_file_last_timestamp').replace(`__file__`, `${t(importName)}`)} <strong>{importDateTime}</strong>
                                </div>
                                <div>
                                {t('attach_file_last_file')} <strong>{importSource}</strong>
                                </div>
                            </>
                            : null
                        }
                        <Formik
                            onSubmit={this._handleSubmit}
                            initialValues={{
                                file: this.state.files
                            }}
                        >
                            {({setFieldValue, values, handleSubmit}) => {
                                return (
                                    <Grid
                                        className="imports-buttons-wrapper"
                                        container>
                                        <UploadExcel
                                            prefix={(<PublishIcon className="mr-5"/>)}
                                            src={values.file}
                                            onDrop={this._onDrop}
                                            onDropRejected={this._onDropRejected}
                                            setFieldValue={setFieldValue}
                                            t={this.props.t}/>
                                        <div>
                                            <GeneralButton
                                                prefix={(<CachedIcon className="mr-5"/>)}
                                                className="imports-button pr-17 pl-17"
                                                loading={ this.props.imports.importingFile }
                                                disabled={ !this.state.dropped || this.props.imports.importingFile }
                                                onClick={handleSubmit}
                                                type='submit'>
                                                {this.props.t('import_file')}
                                            </GeneralButton>
                                        </div>
                                        {this.state.importFileName !== '-' &&
                                        <div>
                                            <GeneralButton
                                                prefix={(<PublishIcon className="rotate-180deg mr-5"/>)}
                                                className="imports-button pr-20 pl-20"
                                                onClick={this._handleDownloadLastUploaded(this.state.importFileName)}
                                                type='submit'>
                                                {this.props.t('download_file')}
                                            </GeneralButton>
                                        </div>
                                        }
                                        { imports.importingFileError ?
                                            <CustomAlert
                                                color='primaryColorIcons'
                                                severity='error'
                                                message={ imports.importingFileError }/>
                                            :
                                            imports.importedFile ?
                                                <CustomAlert
                                                    severity='success'
                                                    message={ t('imported_file') }/>
                                                :
                                                null
                                        }
                                        { fileErrors.length ?
                                            <CustomAlert
                                                color='primaryColorIcons'
                                                severity='error'
                                                message={ fileErrors[0] }/>
                                            : null
                                        }
                                    </Grid>
                                )
                            }}

                        </Formik>
                    </div>
                }
            </div>
        );
    };

    render() {
        const { openConsumuri, openSisteme, openPlaciPermise, openProducts, importName, openPlacari, openCeiling, redirect } = this.state;
        const { imports, t } = this.props;

        if (redirect) {
            return <Redirect to={ '/' } />
        }

        const country = localStorage.getItem('country');

        if (country && country !== 'ro') {
            return (
                <Card className='general-card small-left'>
                    <div className='import-title-wrapper'>
                        <Typography
                            className="rubrik-font"
                            variant="h4"
                            component="h1">
                            {t('choose_import') }
                        </Typography>
                    </div>
                    <List>
                        <ListItem button onClick={this._handleClickProducts()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('products')}`} className="bold" inset="true"/>
                            {openProducts ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openProducts} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Produse")}>
                                    <ListItemText primary={t('price_list')} />
                                </ListItem>
                                { importName === 'Produse' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                    </List>
                </Card>
            );

        } else {
            return (
                <Card className='general-card small-left'>
                    <div className='import-title-wrapper'>
                        <Typography
                            className="rubrik-font"
                            variant="h4"
                            component="h1">
                            {t('choose_import') }
                        </Typography>
                    </div>
                    <List>
                        <ListItem button onClick={this._handleClickConsumuri()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('materials')}`} className="bold" inset="true"/>
                            {openConsumuri ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openConsumuri} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Consumuri - Simplu Placat")}>
                                    <ListItemText primary={t('walls_s')} />
                                </ListItem>
                                { importName === 'Consumuri - Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Dublu Placat")}>
                                    <ListItemText primary={t('walls_d')} />
                                </ListItem>
                                { importName === 'Consumuri - Dublu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Triplu Placat")}>
                                    <ListItemText primary={t('walls_t')} />
                                </ListItem>
                                { importName === 'Consumuri - Triplu Placat' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Simplu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Dublu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_d')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Dublu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Triplu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_t')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Triplu Placat' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Asimetrici")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_asimetric')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Asimetrici' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Dublu Intermediar")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_intermediar_d')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Dublu Intermediar' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri Separativi - Triplu Intermediar")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_intermediar_t')}`} />
                                </ListItem>
                                { importName === 'Consumuri Separativi - Triplu Intermediar' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri - Placari Simple")}>
                                    <ListItemText primary={t('linnings_s')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Duble")}>
                                    <ListItemText primary={t('linnings_d')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Triple")}>
                                    <ListItemText primary={t('linnings_t')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Triple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Cvadruple")}>
                                    <ListItemText primary={t('linnings_q')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Cvadruple' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri - Placari Lipire")}>
                                    <ListItemText primary={t('linnings_p')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Lipire' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri - Placari Noisy Duble")}>
                                    <ListItemText primary={t('linnings_noisy_double')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Noisy Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Noisy Triple")}>
                                    <ListItemText primary={t('linnings_noisy_triple')} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Noisy Triple' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Simple")}>
                                    <ListItemText primary={t('ceilings_plates_s')} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Duble")}>
                                    <ListItemText primary={t('ceilings_plates_d')} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Triple")}>
                                    <ListItemText primary={t('ceilings_plates_t')} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Triple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Cvadruple")}>
                                    <ListItemText primary={t('ceilings_plates_q')} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Cvadruple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Pereti Smart Simplu Placat")}>
                                    <ListItemText primary={`${t('pereti_smart')} ${t('walls_s')}`} />
                                </ListItem>
                                { importName === 'Consumuri - Pereti Smart Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Pereti Smart Dublu Placat")}>
                                    <ListItemText primary={`${t('pereti_smart')} ${t('walls_d')}`} />
                                </ListItem>
                                { importName === 'Consumuri - Pereti Smart Dublu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Smart Simple")}>
                                    <ListItemText primary={"Placari Smart Simple"} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Smart Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Placari Smart Duble")}>
                                    <ListItemText primary={"Placari Smart Duble"} />
                                </ListItem>
                                { importName === 'Consumuri - Placari Smart Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Smart Simple")}>
                                    <ListItemText primary={"Plafoane Smart Simple"} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Smart Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Consumuri - Plafoane Smart Duble")}>
                                    <ListItemText primary={"Plafoane Smart Duble"} />
                                </ListItem>
                                { importName === 'Consumuri - Plafoane Smart Duble' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                        <ListItem button onClick={this._handleClickSisteme()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('walls')}`} className="bold" inset="true"/>
                            {openSisteme ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openSisteme} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Sisteme - Simplu Placat")}>
                                    <ListItemText primary={t('walls_s')} />
                                </ListItem>
                                { importName === 'Sisteme - Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Dublu Placat")}>
                                    <ListItemText primary={t('walls_d')} />
                                </ListItem>
                                { importName === 'Sisteme - Dublu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Triplu Placat")}>
                                    <ListItemText primary={t('walls_t')} />
                                </ListItem>
                                { importName === 'Sisteme - Triplu Placat' ? this._renderOption(this.state, imports) : null }

                                <ListItem button onClick={this._handleClick("Pereti Separativi - Simplu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Separativi - Dublu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_d')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Dublu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Separativi - Triplu Placat")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_t')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Triplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Separativi - Asimetrici")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_asimetric')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Asimetrici' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Separativi - Dublu Intermediar")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_intermediar_d')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Dublu Intermediar' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Separativi - Triplu Intermediar")}>
                                    <ListItemText primary={`${t('separative')} ${t('walls_s_intermediar_t')}`} />
                                </ListItem>
                                { importName === 'Pereti Separativi - Triplu Intermediar' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Smart - Simplu Placat")}>
                                    <ListItemText primary={`${t('pereti_smart')} ${t('walls_s')}`} />
                                </ListItem>
                                { importName === 'Pereti Smart - Simplu Placat' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Pereti Smart - Dublu Placat")}>
                                    <ListItemText primary={`${t('pereti_smart')} ${t('walls_d')}`} />
                                </ListItem>
                                { importName === 'Pereti Smart - Dublu Placat' ? this._renderOption(this.state, imports) : null }

                            </List>
                        </Collapse>
                        <ListItem button onClick={this._handleClickPlacari()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('linnings')}`} className="bold" inset="true"/>
                            {openPlacari ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openPlacari} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Simple")}>
                                    <ListItemText primary={t('linnings_s')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Duble")}>
                                    <ListItemText primary={t('linnings_d')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Triple")}>
                                    <ListItemText primary={t('linnings_t')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Triple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Cvadruple")}>
                                    <ListItemText primary={t('linnings_q')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Cvadruple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Lipire")}>
                                    <ListItemText primary={t('linnings_p')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Lipire' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Noisy Duble")}>
                                    <ListItemText primary={t('linnings_noisy_double')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Noisy Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Noisy Triple")}>
                                    <ListItemText primary={t('linnings_noisy_triple')} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Noisy Triple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Smart Simple")}>
                                    <ListItemText primary={"Placari Smart Simple"} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Smart Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Placari Smart Duble")}>
                                    <ListItemText primary={"Placari Smart Duble"} />
                                </ListItem>
                                { importName === 'Sisteme - Placari Smart Duble' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                        <ListItem button onClick={this._handleClickCeiling()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('ceilings')}`} className="bold" inset="true"/>
                            {openCeiling ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openCeiling} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Simple")}>
                                    <ListItemText primary={t('ceilings_plates_s')} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Duble")}>
                                    <ListItemText primary={t('ceilings_plates_d')} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Duble' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Triple")}>
                                    <ListItemText primary={t('ceilings_plates_t')} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Triple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Cvadruple")}>
                                    <ListItemText primary={t('ceilings_plates_q')} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Cvadruple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Smart Simple")}>
                                    <ListItemText primary={"Plafoane Smart Simple"} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Smart Simple' ? this._renderOption(this.state, imports) : null }
                                <ListItem button onClick={this._handleClick("Sisteme - Plafoane Smart Duble")}>
                                    <ListItemText primary={"Plafoane Smart Duble"} />
                                </ListItem>
                                { importName === 'Sisteme - Plafoane Smart Duble' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                        <ListItem button onClick={this._handleClickPlaciPermise()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('allowed_plates')}`} className="bold" inset="true"/>
                            {openPlaciPermise ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openPlaciPermise} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Placi Permise")}>
                                    <ListItemText primary={t('allowed_plates')} />
                                </ListItem>
                                { importName === 'Placi Permise' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                        <ListItem button onClick={this._handleClickProducts()}>
                            <ListItemIcon>
                                <PublishIcon className="primaryColorIcons"/>
                            </ListItemIcon>
                            <ListItemText primary={`${t('import')} ${t('products')}`} className="bold" inset="true"/>
                            {openProducts ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openProducts} timeout="auto" unmountOnExit>
                            <List className="choice-import-file" component="div" disablePadding>
                                <ListItem button onClick={this._handleClick("Produse")}>
                                    <ListItemText primary={t('price_list')} />
                                </ListItem>
                                { importName === 'Produse' ? this._renderOption(this.state, imports) : null }
                            </List>
                        </Collapse>
                    </List>
                </Card>
            );
        }
    }
}

const mapStateToProps = store => ({
    imports: store.imports,
    users: store.users,
});

export default withTranslation()(connect(mapStateToProps)(ExcelImport));
