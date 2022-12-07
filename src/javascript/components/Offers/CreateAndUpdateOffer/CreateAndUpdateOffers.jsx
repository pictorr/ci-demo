import React, { PureComponent } from 'react';
import { Card } from '@material-ui/core';
import { Formik } from 'formik';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CustomSelect from '../../Templates/CustomSelect.jsx';
import Typography from '@material-ui/core/Typography';
import {
    makeOptions,
    getTheGoodOffers,
    generateAllOffers,
    generateSystemCode,
    generateSystemCodePlating,
    generateSystemCodeNoisyPlating,
    generateSystemCodeSpecialWalls,
    generateSystemCodeCeiling,
    sortNumbers,
    getItemFromStorage,
} from '../../../utils/utils.js';
import GeneralButton from '../../Templates/Buttons/GeneralButton.jsx';

import SecondaryButton from '../../Templates/Buttons/SecondaryButton.jsx';
import { saveOffer, updateSavedOffer, deleteOffers, getCurrentOffer, getSystemCode, updateSavedPlatingOffer, savePlatingOffer } from '../../../actions/offerActions.js';
import { getSoundInsulationValues, getAllowedPlates, getImportedSystems, getImportedConsumptions, getProducts, getImportedPlatingSystems, getImportedNoisyPlatingSystems, getImportedSpecialWalls, getSystemsInfo } from '../../../actions/importsActions.js';
import { getSession } from '../../../actions/sessionActions.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import TabPanel from './TabPanel.jsx'
import _ from 'lodash';
import PageLoader from '../../../components/Templates/PageLoader.jsx';
import { withStyles } from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import { translations } from '../../../utils/constants.js';

const CssTextField = withStyles((theme) => ({
	root: {
	  '& label.Mui-focused': {
		color: '#A61F7D',
	  },
	  '& .MuiInput-underline:after': {
		borderBottomColor: '#A61F7D',
	  },
	  '& .MuiOutlinedInput-root': {
		'&:hover fieldset': {
		  borderColor: '#A61F7D',
		},
		'&.Mui-focused fieldset': {
		  borderColor: '#A61F7D',
		},
        '& .MuiTextField-root': {
            margin: 'margin-text-field',
            width: 200,
        },
	  },
	},
  }))(TextField);


const styles = {
    root: {
        backgroundColor: "#A61F7D",
    },
  };

class CreateAndUpdateoffers extends PureComponent {

    constructor(props) {
		super(props);

        const { parentMatch } = props;

        this.state = {
			imageErrors: [],
            isCreateNewOffer: parentMatch.path.indexOf('/create-new-offer') !== -1,
            isEdit: parentMatch.path.indexOf('/edit-offer') !== -1,
			isEditSession: parentMatch.path.indexOf('/session/edit') !== -1 && parentMatch.path.indexOf('/edit-offer') !== -1,
            isNewOfferEditSession: parentMatch.path.indexOf('/session/edit') !== -1 && parentMatch.path.indexOf('/new-offer') !== -1,
            fireResistanceOptions: [],
            profileTypeOptions: [],
            moistureResistanceOptions: [],
            burglaryResistanceOptions: [],
            soundInsulationOptions: ['Oricare', "Nu", "Da"],
            supportOptions: ["Planseu beton armat", "Tabla cutata de acoperis"],
            ceilingSupportOptions: ["Oricare", "Brida", "Tirant", "Nonius", "Tija M8", "Racord lemn", "Brida AC"],
            allCeilingSupportOptions: ["Oricare", "Brida", "Tirant", "Nonius", "Tija M8", "Racord lemn", "Brida AC"],
            soundInsulationValueOptions: ["Oricare"],
            allSoundInsulationValueOptions: ["Oricare"],
            finishingOptions: ["Oricare", "Nu", "Da"],
            thicknessOptions: ["Oricare", "12.5", "15"],
            protectionSenseOptions: ["Oricare", "1", "2", "3"],
            allProtectionSenseOptions:  ["Oricare", "1", "2", "3"],
            interaxSustineriOptions: [],
            allSecondaryInteraxOptions: [],
            basedPlatesOptions: [],
            openSystems: false,
            tabValue: "",
            tabSubTabValue: "",
            submitButton: false,
            typeName: "0",
            maxHeight: 0,
            thickness: '',
            afterFetch: true,
            hasAccess: false,
            xsColumns: 4,
            soundInsulationMaxSaved: 0,
            soundInsulationMinSaved: 0
		};
    }

    componentDidMount() {
        const { dispatch, parentMatch } = this.props;
        const { isEditSession } = this.state;

        this.setState({
            mainTabValue: 'nida',
        });

        window.addEventListener('resize', this._changeXsColumns);

        dispatch({ type: 'GET_CURRENT_OFFER'});

        let hasAccess = false;

        if (getItemFromStorage('isMasterAdmin') === 'true' || getItemFromStorage('isAdmin') === 'true') {
            hasAccess = true;
        }

        this.setState({
            hasAccess: hasAccess
        });

        dispatch(getSystemsInfo());

        if (isEditSession) {
            dispatch(getSession(parentMatch.params.id, this._getSessionOffer))
        }
        else {
            if(parentMatch.params.offerId) {
                dispatch(getCurrentOffer(parentMatch.params.offerId, this._setInitialValues))
            }
        }

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._changeXsColumns)
    }

    _changeXsColumns = () => {
        if (window.innerWidth <= 750) {
            this.setState({
                xsColumns: 6,
            })

        }
        else {
            this.setState({
                xsColumns: 4,
            })
        }
    }

    /**
     * Get the offer session
     * @returns -
     */
    _getSessionOffer = () => {
        const { session, parentMatch, dispatch } = this.props;
        let promises = [];
        session.session.session.forEach(item => {
            if (item._id === parentMatch.params.offerId) {
                promises.push(dispatch({
					type: 'GET_CURRENT_OFFER_FULFILLED',
					payload: { offerList: {savedOffer: item} }
				}));
            }
        })

        return Promise.all(promises).then(() => {
            const { offer } = this.props;
            this._setInitialValues(offer)
        });
    }

    /**
     * Find the maximum height from the system selected
     * The ceilings and platings have more than 1 type of systems, thats why we need to find for the specific category
     * @param {*} typeName
     * @returns
     */
    _findMaxHeight = typeName => {
        let max = 0;
        const { imports } = this.props;
        imports.importedSystems.forEach(system => {
            if (system.conditions.heightMax) {
                if (system.conditions.heightMax > max && (system.conditions.conditionType === 'profileTypeAndInterax' || system.conditions.conditionType === 'all')) {
                    if (typeName.includes("Plafoane")) {
                        if (typeName.includes("Suspendate") && system.conditions.ceilingType === '1') {
                            max = system.conditions.heightMax;
                        }
                        if (typeName.includes("Autoportant") && system.conditions.ceilingType === '0') {
                            max = system.conditions.heightMax;
                        }
                    }
                    else {
                        if (typeName.includes("Placari")) {
                            if (typeName.includes("ixari") && (system.conditions.interaxSustineri === '125' ||  system.conditions.interaxSustineri === '250')) {
                                max = system.conditions.heightMax;
                            }
                            if (typeName.includes("ndependente") && system.conditions.interaxSustineri === '0') {
                                max = system.conditions.heightMax;
                            }
                            if (typeName.includes("UU") && system.conditions.interaxSustineri === '1') {
                                max = system.conditions.heightMax;
                            }
                            if (typeName.includes("ipire")) {
                                max = system.conditions.heightMax;
                            }
                            if (typeName.includes("iniare") && (system.conditions.interaxSustineri === '2' ||  system.conditions.interaxSustineri === '2.5')) {
                                max = system.conditions.heightMax;
                            }
                        }
                        else {
                            max = system.conditions.heightMax;
                        }
                    }
                }
            }
        })
        return max;
    }

    /**
     * Find all the different fire resistents from the imported systems
     * @returns
     */
    _getAllFireResistancesFromSystems = () => {
        let allFireResistances = []
        const { imports } = this.props;
        allFireResistances.push("Oricare");
        imports.importedSystems.forEach(system => {
            if (system.conditions.conditionType === 'fireResistance' || system.conditions.conditionType === 'all') {
                allFireResistances.push(system.conditions.fireResistance + (system.conditions.conditionType === 'all' ? 'm' : ''))
            }
        })
        return sortNumbers(_.uniqBy(allFireResistances));
    }
/**
     * Find all the different profile types from the imported systems
     * @returns
     */
    _getAllProfileTypesFromSystems = (systemName, t) => {
        let allProfileTypes = []
        const { imports } = this.props;
        allProfileTypes.push("Oricare");
        imports.importedSystems.forEach(system => {
            if (systemName.includes("Plafoane")) {
                if (systemName.includes("Suspendate") && system.conditions.ceilingType === '1') {
                    allProfileTypes.push(system.conditions.profileType)
                }
                if (systemName.includes("Autoportant") && system.conditions.ceilingType === '0') {
                    allProfileTypes.push(system.conditions.profileType)
                }
            }
            else {
                allProfileTypes.push(system.conditions.profileType)
            }
        })
        return sortNumbers(_.uniqBy(allProfileTypes))
    }

    /**
     * Find all the different plates from the imported systems
     * @returns
     */
    _getAllPlatesFromSystems = (systemName) => {
        let allPlates = [];
        const { imports } = this.props;
        const { typeName } = this.state;
        allPlates.push("Oricare");
        imports.importedSystems.forEach(system => {
            if (systemName.includes("Plafoane")) {
                system.plates.forEach(plate => {
                    allPlates.push(plate.face2.plate1);
                })
            }
            else {
                if (systemName.includes("Pereti")) {
                    system.plates.forEach(plate => {
                        allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                        allPlates.push(plate.face2.plate1);
                    })
                }
                else {
                    if (systemName.includes("Noisy")) {
                        system.plates.forEach(plate => {
                            if (typeName.includes("ixari") && (system.conditions.interaxSustineri === '125' ||  system.conditions.interaxSustineri === '250')) {
                                allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                            }
                            if (typeName.includes("ndependente") && system.conditions.interaxSustineri === '0') {
                                allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                            }
                            if (typeName.includes("UU") && system.conditions.interaxSustineri === '1') {
                                allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                            }
                            if (typeName.includes("ipire")) {
                                allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                            }
                            if (typeName.includes("iniare") && (system.conditions.interaxSustineri === '2' ||  system.conditions.interaxSustineri === '2.5')) {
                                allPlates.push(plate.face1.plate3 || plate.face1.plate2 || plate.face1.plate1);
                            }
                        })
                    }
                    else {
                        if (systemName.includes("Placari")) {
                            system.plates.forEach(plate => {
                                if (typeName.includes("ixari") && (system.conditions.interaxSustineri === '125' ||  system.conditions.interaxSustineri === '250')) {
                                    allPlates.push(plate.plate1);
                                }
                                if (typeName.includes("ndependente") && system.conditions.interaxSustineri === '0') {
                                    allPlates.push(plate.plate1);
                                }
                                if (typeName.includes("UU") && system.conditions.interaxSustineri === '1') {
                                    allPlates.push(plate.plate1);
                                }
                                if (typeName.includes("ipire")) {
                                    allPlates.push(plate.plate1);
                                }
                                if (typeName.includes("iniare") && (system.conditions.interaxSustineri === '2' ||  system.conditions.interaxSustineri === '2.5')) {
                                    allPlates.push(plate.plate1);
                                }
                            })
                        }
                    }
                }
            }
        })
        return _.uniqBy(allPlates);
    }

    /**
     * Find all the different interaxes from the imported systems
     * @returns
     */
    _getAllInteraxFromSystems = () => {
        let allInteraxes = []
        const { imports } = this.props;
        allInteraxes.push("Oricare");
        imports.importedSystems.forEach(system => {
            allInteraxes.push(system.conditions.interax)
        })
        return _.uniqBy(allInteraxes);
    }

    /**
     * Find all the different secondary interaxes from the imported systems (just for ceilings)
     * @returns
     */
    _getAllSecondaryInteraxFromSystems = () => {
        let allInteraxes = []
        const { imports } = this.props;
        const { typeName } = this.state;
        allInteraxes.push("Oricare");
        if (typeName.includes('Autoportant')) {
            allInteraxes.push("0")
        }
        else {
            imports.importedSystems.forEach(system => {
                const [primaryInterax, secondaryInterax] = system.conditions.interax.split('/');
                if ((system.conditions.ceilingType === '1' && typeName.includes('Suspendate')) || (system.conditions.ceilingType === '0' && typeName.includes('Autoportant'))) {
                    allInteraxes.push(secondaryInterax);
                }
            })
        }
        return sortNumbers(_.uniqBy(allInteraxes));
    }

    /**
     * Find all the different interaxes from the imported systems
     * @returns
     */
    _getAllInteraxSustineriFromSystems = () => {
        let allInteraxSustineri = []
        const { imports } = this.props;
        allInteraxSustineri.push("Oricare");
        imports.importedSystems.forEach(system => {
            allInteraxSustineri.push(system.conditions.interaxSustineri)
        })
        return _.uniqBy(allInteraxSustineri);
    }

    /**
     * Find all the different moisture resistences from the imported systems
     * @returns
     */
    _getAllMoistureResistancesFromSystems = () => {
        let allMoistureResistances = []
        const { imports } = this.props;
        allMoistureResistances.push("Oricare");
        imports.importedSystems.forEach(system => {
            allMoistureResistances.push(system.conditions.moistureResistance)
        })
        return sortNumbers(_.uniqBy(allMoistureResistances));
    }

    /**
     * Find all the different Burglary Resistances from the imported systems
     * @returns
     */
    _getAllBurglaryResistanceFromSystems = () => {
        let allBurglaryResistance = []
        const { imports } = this.props;
        allBurglaryResistance.push("Oricare");
        imports.importedSystems.forEach(system => {
            allBurglaryResistance.push(system.conditions.burglaryResistance)
        })
        return sortNumbers(_.uniqBy(allBurglaryResistance));
    }

    /**
     * Checking if the system code exits
     * @param {*} systemName
     * @param {*} offer
     * @param {*} thickness
     * @param {*} thisSoundInsulation
     * @param {*} systemCode
     * @returns
     */
    _checkSystemCode = (systemName, offer, thickness, thisSoundInsulation, systemCode) => {
        let check = false, code = '';

        if (systemName === 'Pereti' || systemName.includes('Pereti Smart')) {
            code = generateSystemCode({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation})
            check = systemCode[code];
        }
        else {
            if (systemName.includes('Noisy')) {
                code = generateSystemCodeNoisyPlating({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation})
                check = systemCode[code];
            }
            else {
                if (systemName.includes('Pereti S')) {
                    code = generateSystemCodeSpecialWalls({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, tab: systemName})
                    check = systemCode[code];
                }
                else {
                    if (systemName.includes('Placari')) {
                        code = generateSystemCodePlating({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation})
                        check = systemCode[code];
                    }
                    else {
                        const { allCeilingSupportOptions } = this.state;
                        if (systemName.includes("Suspendate")) {
                            allCeilingSupportOptions.forEach(support => {
                                code = generateSystemCodeCeiling({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, tab: systemName, ceilingSupport: support})
                                if (systemCode[code]) {
                                    check = true;
                                }
                            })
                        }
                        else {
                            code = generateSystemCodeCeiling({...offer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, tab: systemName})
                            check = systemCode[code];
                        }
                    }
                }
            }
        }

        return check;
    }

    /**
     * Getting all the different plates from the generated offers
     * @param {*} generatedOffers
     * @param {*} systemName
     * @param {*} thicknessSystem
     * @returns
     */
    _getAllPlates = (generatedOffers, systemName, thicknessSystem) => {
        const { imports, offer } = this.props;
        const { systemCode } = offer;
        // console.log(systemName)

        let allPlates = [], allSoundInsulations = [];

        allPlates.push("Oricare");

        if (systemName.includes("Noisy") || systemName.includes("Pereti S")) {
			if (systemName === 'Pereti SLA'){
				allSoundInsulations = ['Da, cu 4 straturi'];
			}
			else {
				allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Da, cu 3 straturi', 'Nu']
			}
		}
		else {
			if (systemName.includes('Plafoane')) {
			    allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Nu']
            }
            else {
			    allSoundInsulations = ['Da', 'Nu']
            }
		}

        generatedOffers.forEach(thisOffer => {
            allSoundInsulations.forEach(thisSoundInsulation => {
                (imports?.importedThicknesses?.length > 0 ? imports?.importedThicknesses : ['12.5']).forEach(thickness => {
                    let condition = false;
                    if (thicknessSystem === 'Oricare' || thicknessSystem === '' || parseFloat(thicknessSystem) === thickness) {
                        condition = this._checkSystemCode(systemName, thisOffer, thickness, thisSoundInsulation, systemCode)
                        if (condition) {
                            if (systemName.includes("Plafoane")) {
                                allPlates.push(thisOffer.plate.face2.plate1);
                            }
                            else {
                                if (systemName.includes("Pereti") || systemName.includes("Noisy") || systemName.includes("Pereti Smart")) {
                                    allPlates.push(thisOffer.plate.face1.plate3 || thisOffer.plate.face1.plate2 || thisOffer.plate.face1.plate1);
                                    allPlates.push(thisOffer.plate.face2.plate1);
                                }
                                else {
                                    if (systemName.includes("Placari")) {
                                        allPlates.push(thisOffer.plate.plate1);
                                    }
                                }
                            }
                        }
                    }
                })
            })
        })
        return _.uniqBy(allPlates);
    }

    /**
     * Get all the fire resistences from the systems
     * @returns
     */
    _getAllFireResistances = () => {
        const { offer } = this.props;
        const { systemCode } = offer;
        let allFireResistances = [];

        allFireResistances.push('Oricare')

        Object.keys(systemCode).forEach(function(key) {
            allFireResistances.push(offer.systemCode[key].fireResistance + 'm');
        });

        allFireResistances = _.uniqBy(allFireResistances);
        return _.uniqBy(allFireResistances);
    }

    /**
     * Get all the profile types from the systems
     * @returns
     */
    _getAllProfileTypes = () => {
        const { offer } = this.props;
        const { systemCode } = offer;
        let allProfileTypes = [];

        allProfileTypes.push('Oricare')

        Object.keys(systemCode).forEach(function(key) {
            allProfileTypes.push(offer.systemCode[key].profileType);
        });

        allProfileTypes = _.uniqBy(allProfileTypes);
        return _.uniqBy(allProfileTypes);
    }

    /**
     * Get all the moisture resistances from the systems
     * @returns
     */
    _getAllMoistureResistances = () => {
        const { offer } = this.props;
        const { systemCode } = offer;
        let allMoistureResistances = [];

        allMoistureResistances.push('Oricare')

        Object.keys(systemCode).forEach(function(key) {
            allMoistureResistances.push(offer.systemCode[key].moistureResistance);
        });

        allMoistureResistances = _.uniqBy(allMoistureResistances);
        return _.uniqBy(allMoistureResistances);
    }

    /**
     * Get all the burglary resistance from the systems
     * @returns
     */
    _getAllBurglaryResistance = () => {
        const { offer } = this.props;
        const { systemCode } = offer;
        let allBurglaryResistance = [];

        allBurglaryResistance.push('Oricare')

        Object.keys(systemCode).forEach(function(key) {
            allBurglaryResistance.push(offer.systemCode[key].burglaryResistance);
        });

        allBurglaryResistance = _.uniqBy(allBurglaryResistance);
        return _.uniqBy(allBurglaryResistance);
    }

    /**
     * Get all the system types
     * @returns
     */
    _findSystemType = (system) => {
        let res = 'Lipire';
        if (system.includes("Cvadruple")) {
            res = "Cvadruple";
        }
        if (system.includes("Triple")) {
            res = "Triple";
        }
        if (system.includes("Triplu")) {
            res = "Triplu";
        }
        if (system.includes("Duble")) {
            res = "Duble";
        }
        if (system.includes("Dublu")) {
            res = "Dublu";
        }
        if (system.includes("Simple")) {
            res = "Simple";
        }
        if (system.includes("Simplu")) {
            res = "Simplu";
        }
        if (system.includes("Asimetrici")) {
            res = "Asimetrici";
        }
        if (system.includes("Dublu Intermediar")) {
            res = "Dublu Intermediar";
        }
        if (system.includes("Triplu Intermediar")) {
            res = "Triplu Intermediar";
        }
        if(system.includes("Smart") && system.includes("Simplu") && system.includes("Pereti")) {
            res = "Pereti Smart Simplu";
        }
        if(system.includes("Smart") && system.includes("Dublu") && system.includes("Pereti")) {
            res = "Pereti Smart Dublu";
        }
        return res;
    }

    /**
     * Find the system name
     * @returns
     */
    _findSystem = (system) => {
        let res = 'Lipire';
        if (system.includes("Suspendate")) {
            res = "Plafoane Suspendate";
        }
        if (system.includes("Autoportant")) {
            res = "Plafoane Autoportante";
        }
        if (system.includes("fixari")) {
            res = "Placari cu fixari";
        }
        if (system.includes("independente")) {
            res = "Placari independente";
        }
        if (system.includes("Noisy cu fixari")) {
            res = "Placari Noisy cu fixari";
        }
        if (system.includes("Noisy independente")) {
            res = "Placari Noisy independente";
        }
        if (system.includes("UU")) {
            res = "Placari Noisy UU";
        }
        if (system.includes("liniare")) {
            res = "Placari liniare";
        }
        if (system.includes("Lipire")) {
            res = "Placari lipire";
        }
        if (system.includes("Pereti")) {
            res = "Pereti";
        }
        if (system.includes("Pereti S")) {
            res = "Pereti S";
        }
        if (system.includes("Pereti SS")) {
            res = "Pereti SS";
        }
        if (system.includes("Pereti SL")) {
            res = "Pereti SL";
        }
        if (system.includes("Pereti SLA")) {
            res = "Pereti SLA";
        }
        if (system.includes("Pereti Smart")) {
            res = "Pereti Smart"
        }
        return res;
    }

    /**
     * In this function we set all the initial values from the offer that was created before.
     * If the user generates offers and goes back to this page, the fields selected before will be completed
     * @param {*} offer
     * @returns
     */
    _setInitialValues = (offer) => {
        const { dispatch } = this.props;

        if (offer.savedOffer.systemName) {
            let systemNameFunction = this._findSystemType(offer.savedOffer.systemName);
            let subTab = this._findSystem(offer.savedOffer.systemName);
            // console.log(subTab)
            if (offer.savedOffer.systemName.includes("Plafoane")) {
                this.setState({
                    mainTabValue: 'nida',
                    tabValue: 'Plafoane',
                    tabSubTabValue: subTab,
                    typeName: offer.savedOffer.systemName
                })
            }
            else
            if (offer.savedOffer.systemName.includes("Noisy")) {
                this.setState({
                    mainTabValue: 'nida',
                    tabValue: 'Placari',
                    tabSubTabValue: subTab,
                    typeName: offer.savedOffer.systemName

                })
            }
            else {
                if (offer.savedOffer.systemName.includes("Placari")) {
                    this.setState({
                        mainTabValue: 'nida',
                        tabValue: 'Placari',
                        tabSubTabValue: subTab,
                        typeName: offer.savedOffer.systemName
                    })
                }
                else {
                    if (!offer.savedOffer.systemName.includes("Smart")){
                        this.setState({
                            mainTabValue: 'nida',
                            tabValue: 'Pereti',
                            tabSubTabValue: subTab,
                            typeName: offer.savedOffer.systemName
                        })
                    } else {
                        this.setState({
                            mainTabValue: 'smart',
                            tabValue: 'Pereti Smart',
                            tabSubTabValue: subTab,
                            typeName: offer.savedOffer.systemName
                        })
                    }
                }
            }

            let promises = [
                dispatch(deleteOffers()),
                dispatch(getProducts()),
                dispatch(getAllowedPlates()),
                dispatch(subTab.includes('Plafoane') ? getImportedConsumptions('Plafoane ' + systemNameFunction) : offer.savedOffer.systemName.includes("Noisy") ? getImportedConsumptions('Noisy ' + systemNameFunction) : offer.savedOffer.systemName.includes("Pereti Smart") ? getImportedConsumptions(systemNameFunction) : offer.savedOffer.systemName.includes("Pereti S") ? getImportedConsumptions('Separativi ' + systemNameFunction) : getImportedConsumptions(systemNameFunction)),
                subTab.includes('Plafoane') ? dispatch(getImportedSystems('Plafoane ' + systemNameFunction)) : offer.savedOffer.systemName.includes("Noisy") ? dispatch(getImportedNoisyPlatingSystems(systemNameFunction)) : subTab === 'Pereti' ? dispatch(getImportedSystems(systemNameFunction))
                : offer.savedOffer.systemName.includes('Smart') ? dispatch(getImportedSystems(systemNameFunction, subTab)) : offer.savedOffer.systemName.includes('Pereti S') ? dispatch(getImportedSpecialWalls(systemNameFunction, subTab)) : dispatch(getImportedPlatingSystems(systemNameFunction)),
                // dispatch(getAllThicknesses({systemName: offer.savedOffer.systemName, height: offer.savedOffer.height}, subTab)),
                dispatch(getSoundInsulationValues({systemName: offer.savedOffer.systemName, height: offer.savedOffer.height}, subTab)),
            ];

            return Promise.all(promises).then(() => {
                if(offer.savedOffer.height > 0) {

                    const { tabValue, tabSubTabValue, thickness } = this.state;
                    const { imports } = this.props;
                    let interaxSustineriOptions;

                    let data = {
                        height: offer.savedOffer.height,
                        fireResistance: offer.savedOffer.fireResistance,
                        moistureResistance: offer.savedOffer.moistureResistance,
                        interaxSustineri: offer.savedOffer.interaxSustineri,
                        burglaryResistance: offer.savedOffer.burglaryResistance,
                        soundInsulation: offer.savedOffer.soundInsulation,
                        ceilingSupport: '',
                        support: offer.savedOffer.support,
                        finishing: offer.savedOffer.finishing,
                        profileType: offer.savedOffer.profileType,
                        protectionSense: offer.savedOffer.protectionSense || '',
                        soundInsulationMax: offer.savedOffer.soundInsulationMax,
                        soundInsulationMin: offer.savedOffer.soundInsulationMin,
                        basedPlates: offer.savedOffer.basedPlates,
                        thickness: thickness || 'Oricare',
                        thicknessSystem: offer.savedOffer.thicknessSystem || 'Oricare',
                    };

                    if (tabValue === 'Pereti' || tabValue === 'Pereti Smart') {
                        systemNameFunction = this._findSystemType(offer.savedOffer.systemName);
                    }
                    else {
                        systemNameFunction = this._findSystemType(offer.savedOffer.systemName);
                        interaxSustineriOptions = this._getInteraxSustineri(offer.savedOffer.systemName);
                    }


                    let restructuredData = this._restructureData(data);
                    let genOffers2 = generateAllOffers(offer.savedOffer.systemName.includes('Noisy') ? 'Placari Noisy' : this.state.tabValue, restructuredData, this._getAllInteraxFromSystems(), interaxSustineriOptions, this._getAllProfileTypesFromSystems(offer.savedOffer.systemName), this._getAllFireResistancesFromSystems(), this._getAllMoistureResistancesFromSystems(), this._getAllBurglaryResistanceFromSystems(), imports.importedSystems, imports.consumptions, systemNameFunction, imports.products)();

                    let promises2 = [];
                    promises2.push(dispatch({ type: 'RESET_SYSTEM_CODE' }));
                    const { typeName } = this.state;
                    promises2.push(dispatch(getSystemCode({ceilingSupport: data.ceilingSupport, burglaryResistance: data.burglaryResistance, structureLink: this.state.tabSubTabValue, thickness: data.thicknessSystem, profileType: data.profileType, moistureResistance: data.moistureResistance, fireResistance: data.fireResistance, height: data.height, thicknessSystem: data.thicknessSystem, protectionSense: data.protectionSense || 'Oricare', soundInsulationValue: {min: 0, max: 90} || 'Oricare', systemName: typeName})));

                    return Promise.all(promises2).then(() => {
                        const { offer, imports } = this.props;
                        const { allCeilingSupportOptions, allProtectionSenseOptions } = this.state;

                        let valuesSound = this._getValuesSound(imports?.soundInsulationValues?.min, imports?.soundInsulationValues?.max, offer.systemCode);

                        data.soundInsulationMin = valuesSound?.soundInsulationMin;
                        data.soundInsulationMax = valuesSound?.soundInsulationMax;

                        this.setState({
                            soundInsulationMinSaved: valuesSound?.soundInsulationMin,
                            soundInsulationMaxSaved: valuesSound?.soundInsulationMax,
                            afterFetch: false,
                            submitButton: false,
                            basedPlatesOptions: this._getAllPlates(genOffers2, tabSubTabValue, data.thicknessSystem),
                            allSecondaryInteraxOptions: this._getAllSecondaryInteraxFromSystems(),
                            soundInsulationOptions: this._getAllSoundInsulations(genOffers2, tabSubTabValue.includes('Noisy') || tabValue.includes('Noisy') ? 'Placari Noisy' : tabSubTabValue, restructuredData.soundInsulationValue || 'Oricare'),
                            supportOptions:
                                systemNameFunction.includes('Lipire') ? ["Beton", "Zidarie", "Tencuieli", "Altele"] :
                                tabValue === 'Placari' ? this._getAllSupportOptions(genOffers2, tabSubTabValue, data.thicknessSystem) :
                                tabSubTabValue.includes('Pereti S') ? this._getAllSupportOptions(genOffers2, tabSubTabValue, data.thicknessSystem) :
                                tabValue === 'Pereti' ? this._getAllSupportOptions(genOffers2, tabSubTabValue, data.thicknessSystem) :
                                ["Planseu beton armat", "Tabla cutata de acoperis"],
                            interaxSustineriOptions: interaxSustineriOptions,
                            typeName: offer.savedOffer.systemName.includes('Creare oferta - ') === false ? 'Creare oferta - ' + offer.savedOffer.systemName: offer.savedOffer.systemName,
                            fireResistanceOptions: this._getAllFireResistances(),
                            profileTypeOptions: this._getAllProfileTypes(),
                            moistureResistanceOptions: this._getAllMoistureResistances(),
                            burglaryResistanceOptions: this._getAllBurglaryResistance(),
                            ceilingSupportOptions: offer.savedOffer.systemName.includes('Plafoane') ? this._getAllCeilingSupportOptions(genOffers2) : allCeilingSupportOptions,
                            protectionSenseOptions: offer.savedOffer.systemName.includes('Plafoane') ? this._getProtectionSenseOptions() : allProtectionSenseOptions,
                            maxHeight: this._findMaxHeight(offer.savedOffer.systemName),
                        })
                    })
                }
            });
        }
        else {
            this.setState({
                afterFetch: false
            })
        }
    }

    /**
     * Restructuring the data before generating the offers
     * @param {} values
     * @returns
     */
    _restructureData = (values) => {
        return {
			height: values.height.toString(),
            fireResistance: values.fireResistance === "-" ? "" : values.fireResistance,
            profileType: values.profileType === "-" ? "" : values.profileType,
            moistureResistance: values.moistureResistance === "-" ? "" : values.moistureResistance,
            burglaryResistance: values.burglaryResistance === "-" ? "" : values.burglaryResistance,
            soundInsulation: values.soundInsulation === "-" ? "" : values.soundInsulation,
            support: values.support === "-" ? "" : values.support,
            ceilingSupport: values.ceilingSupport === "-" ? "" : values.ceilingSupport || "",
            thickness: "",
            finishing: values.finishing === "-" ? "" : values.finishing,
            protectionSense: values.protectionSense === "-" ? "" : values.protectionSense,
            soundInsulationValue: values.soundInsulationValue === "-" ? "" : values.soundInsulationValue,
            basedPlates: values.basedPlates === "-" ? "" : values.basedPlates,
            soundInsulationMin: values.soundInsulationMin === "-" ? "" : values.soundInsulationMin,
            soundInsulationMax: values.soundInsulationMax === "-" ? "" : values.soundInsulationMax,
        };
    }

    _getInteraxSustineri = (name) => {
        let interax = [];
        if (name.includes('fixari')) {
            interax = ['125', '250']
        }
        if (name.includes('independente')) {
            interax = ['0']
        }
        if (name.includes('liniare')) {
            interax = ['2', '2.5']
        }
        if (name.includes('UU')) {
            interax = ['1']
        }
        return interax;
    }

    /**
     * Handle click on the menu for selecting a type of system
     * @param {*} setFieldValue
     * @param {*} name
     * @returns
     */
    _handleClick = (setFieldValue, name) => () => {
        const { dispatch } = this.props;
        const { tabValue, tabSubTabValue } = this.state;

        let systemNameFunction = this._findSystemType(name);

        if (tabValue === 'Pereti Smart') {
            let promises = [
                dispatch(deleteOffers()),
                dispatch(getProducts('Produse - Pereti')),
                dispatch(getAllowedPlates()),
                dispatch(getImportedConsumptions(systemNameFunction)),
                dispatch(getImportedSystems(systemNameFunction)),
            ];

            return Promise.all(promises).then(() => {
                setFieldValue('height', '')
                this.setState({
                    typeName: name,
                    fireResistanceOptions: ['Oricare'],
                    moistureResistanceOptions: ['Oricare'],
                    burglaryResistanceOptions: ['Oricare'],
                    maxHeight: this._findMaxHeight(name)
                })
            });
        }

        if (tabValue === 'Pereti') {
            let promises = [
                dispatch(deleteOffers()),
                dispatch(getProducts('Produse - Pereti')),
                dispatch(getAllowedPlates()),
                dispatch(tabSubTabValue.includes("Pereti S") ? getImportedConsumptions('Separativi ' + systemNameFunction) : getImportedConsumptions(systemNameFunction)),
                tabSubTabValue === 'Pereti' ? dispatch(getImportedSystems(systemNameFunction)) : dispatch(getImportedSpecialWalls(systemNameFunction, tabSubTabValue)) ,
            ];

            return Promise.all(promises).then(() => {
                setFieldValue('height', '')
                this.setState({
                    typeName: name,
                    fireResistanceOptions: ['Oricare'],
                    moistureResistanceOptions: ['Oricare'],
                    burglaryResistanceOptions: ['Oricare'],
                    maxHeight: this._findMaxHeight(name)
                })
            });
        }

        if (tabValue === 'Placari') {
            let interaxSustineriOptions = this._getInteraxSustineri(name);

            let promises = [
                dispatch(deleteOffers()),
                dispatch(getProducts('Produse - Placari')),
                dispatch(getAllowedPlates()),
                name.includes("Noisy") ? dispatch(getImportedNoisyPlatingSystems(systemNameFunction)) : dispatch(getImportedPlatingSystems(systemNameFunction)),
                dispatch(name.includes("Noisy") ? getImportedConsumptions('Noisy ' + systemNameFunction) : getImportedConsumptions(systemNameFunction)),
            ];

            return Promise.all(promises).then(() => {
                setFieldValue('height', '')

                this.setState({
                    typeName: name,
                    interaxSustineriOptions: interaxSustineriOptions,
                    fireResistanceOptions: ['Oricare'],
                    moistureResistanceOptions: ['Oricare'],
                    maxHeight: this._findMaxHeight(name)
                })
            });
        }

        if (tabValue === 'Plafoane') {
            let promises = [
                dispatch(deleteOffers()),
                dispatch(getProducts()),
                dispatch(getAllowedPlates()),
                dispatch(getImportedConsumptions('Plafoane ' + systemNameFunction)),
                dispatch(getImportedSystems('Plafoane ' + systemNameFunction)),
            ];

            return Promise.all(promises).then(() => {
                setFieldValue('height', '')
                this.setState({
                    typeName: name,
                    fireResistanceOptions: ['Oricare'],
                    moistureResistanceOptions: ['Oricare'],
                    burglaryResistanceOptions: ['Oricare'],
                    maxHeight: this._findMaxHeight(name)
                })
            });
        }
    }

    _handleClickSisteme = (event, value) => {
        this.setState({
            tabValue: value,
            tabSubTabValue: '',
            typeName: "0"
        })
    };

    _handleClickCategory = (event, value) => {
        this.setState({
            mainTabValue: value,
            tabValue: '',
            tabSubTabValue: '',
            typeName: "0"
        })
    };

    /**
     * Handle click on a subcategory of the systems
     * @param {*} event
     * @param {*} value
     */
    _handlClickTabs = (event, value) => {
        this.setState({
            tabSubTabValue: value,
            typeName: "0"
        })
    };

    _getAllSoundInsulationValues = (soundInsulation) => {
        const { allSoundInsulationValueOptions } = this.state;
        if (soundInsulation === '' || soundInsulation === '-' || soundInsulation === 'Oricare') {
            return allSoundInsulationValueOptions;
        }
        if (soundInsulation.includes("Da")) {
            return allSoundInsulationValueOptions.filter(value => value === 'Oricare' || value.includes("Cu") === true);
        }
        if (soundInsulation.includes("Nu")) {
            return allSoundInsulationValueOptions.filter(value => value === 'Oricare' || value.includes("Fara") === true);
        }
    }

    /**
     * Getting all the sound insulation values from the generated offers
     * @param {*} genOffers
     * @param {*} systemName
     * @param {*} soundInsulationValue
     * @returns
     */
    _getAllSoundInsulations = (genOffers, systemName, soundInsulationValue) => {
        const { offer, imports } = this.props;
        let arraySoundInsulation = [];

        arraySoundInsulation.push('Oricare')

        // console.log(imports);
        // console.log(systemName);

        // console.log(genOffers);

        genOffers.forEach(genOffer => {
            imports?.importedThicknesses?.forEach(thickness => {
                let generatedCodeYes, generatedCodeNo, generatedCodeYes2;
                if (systemName.includes('Pereti S') && !systemName.includes('Pereti Smart')) {
                    generatedCodeYes = generateSystemCodeSpecialWalls({...genOffer, thicknessSystem: thickness, soundInsulation: 'Da, cu 1 strat', tab: systemName})
                    if(offer.systemCode[generatedCodeYes]) {
                        arraySoundInsulation.push('Da')
                    }
                    generatedCodeYes = generateSystemCodeSpecialWalls({...genOffer, thicknessSystem: thickness, soundInsulation: 'Da, cu 2 strat', tab: systemName})
                    if(offer.systemCode[generatedCodeYes]) {
                        arraySoundInsulation.push('Da')
                    }
                    generatedCodeYes = generateSystemCodeSpecialWalls({...genOffer, thicknessSystem: thickness, soundInsulation: 'Da, cu 3 strat', tab: systemName})
                    if(offer.systemCode[generatedCodeYes]) {
                        arraySoundInsulation.push('Da')
                    }
                    generatedCodeYes = generateSystemCodeSpecialWalls({...genOffer, thicknessSystem: thickness, soundInsulation: 'Da, cu 4 strat', tab: systemName})
                    generatedCodeNo = generateSystemCodeSpecialWalls({...genOffer, thicknessSystem: thickness, soundInsulation: 'Nu', tab: systemName})
                }
                else {
                    if (systemName.includes('Pereti') || systemName.includes('Pereti Smart')) {
                        generatedCodeYes = generateSystemCode({...genOffer, soundInsulation: 'Da', thicknessSystem: thickness});
                        generatedCodeNo = generateSystemCode({...genOffer, soundInsulation: 'Nu', thicknessSystem: thickness});
                    }
                    else {
                        if (systemName.includes('Noisy')) {
                            generatedCodeYes = generateSystemCodeNoisyPlating({...genOffer, soundInsulation: 'Da, cu 1 strat', thicknessSystem: thickness});
                            generatedCodeYes2 = generateSystemCodeNoisyPlating({...genOffer, soundInsulation: 'Da, cu 2 straturi', thicknessSystem: thickness});
                            generatedCodeNo = generateSystemCodeNoisyPlating({...genOffer, soundInsulation: 'Nu', thicknessSystem: thickness});
                            if(offer.systemCode[generatedCodeYes2]) {
                                arraySoundInsulation.push('Da')
                            }
                        }
                        else {
                            if (systemName.includes('Placari')) {
                                generatedCodeYes = generateSystemCodePlating({...genOffer, soundInsulation: 'Da', thicknessSystem: thickness});
                                generatedCodeNo = generateSystemCodePlating({...genOffer, soundInsulation: 'Nu', thicknessSystem: thickness});
                            }
                            else {
                                if (systemName.includes("Suspendate")) {
                                    const { allCeilingSupportOptions } = this.state;

                                    allCeilingSupportOptions.forEach(support => {
                                        generatedCodeYes2 = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Da, cu 2 straturi', tab: systemName, thicknessSystem: thickness, ceilingSupport: support});
                                        if(offer.systemCode[generatedCodeYes2]) {
                                            arraySoundInsulation.push('Da')
                                        }
                                        generatedCodeYes = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Da, cu 1 strat', tab: systemName, thicknessSystem: thickness, ceilingSupport: support});
                                        generatedCodeNo = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Nu', tab: systemName, thicknessSystem: thickness, ceilingSupport: support});
                                        if(offer.systemCode[generatedCodeYes]) {
                                            arraySoundInsulation.push('Da')
                                        }
                                        if(offer.systemCode[generatedCodeNo]) {
                                            arraySoundInsulation.push('Nu')
                                        }
                                    })
                                }
                                else {
                                    generatedCodeYes = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Da', tab: systemName, thicknessSystem: thickness});
                                    generatedCodeNo = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Nu', tab: systemName, thicknessSystem: thickness});
                                    if(offer.systemCode[generatedCodeYes]) {
                                        arraySoundInsulation.push('Da')
                                    }
                                    if(offer.systemCode[generatedCodeNo]) {
                                        arraySoundInsulation.push('Nu')
                                    }
                                }
                            }
                        }
                    }
                }
                if(offer.systemCode[generatedCodeYes]) {
                    arraySoundInsulation.push('Da')
                }
                if(offer.systemCode[generatedCodeNo]) {
                    arraySoundInsulation.push('Nu')
                }
            })
        })

        arraySoundInsulation = _.uniqBy(arraySoundInsulation);

        if (soundInsulationValue !== 'Oricare' && soundInsulationValue !== '') {
            if (soundInsulationValue.includes("Cu")) {
                arraySoundInsulation = arraySoundInsulation.filter(sound => sound === 'Oricare' || sound.includes("Da"))
            }
            if (soundInsulationValue.includes("Fara")) {
                arraySoundInsulation = arraySoundInsulation.filter(sound => sound === 'Oricare' || sound.includes("Nu"))
            }
        }
        return arraySoundInsulation;
    }

    /**
     * Getting all the support values from the generated offers
     * @param {*} genOffers
     * @param {*} systemName
     * @param {*} soundInsulationValue
     * @returns
     */
    _getAllSupportOptions = (generatedOffers, systemName, thicknessSystem) => {
        const { offer, imports } = this.props;
        const { systemCode } = offer;
        let arraySupportOptions = []
        let allSoundInsulations = [];
        // console.log(systemName)
        if (systemName.includes("Noisy") || systemName.includes("Pereti S")) {
			if (systemName === 'Pereti SLA'){
				allSoundInsulations = ['Da, cu 4 straturi'];
			}
			else {
				allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Da, cu 3 straturi', 'Nu']
			}
		}
		else {
			if (systemName.includes('Plafoane')) {
			    allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Nu']
            }
            else {
			    allSoundInsulations = ['Da', 'Nu']
            }
		}

        generatedOffers.forEach(thisOffer => {
            allSoundInsulations.forEach(thisSoundInsulation => {
                imports.importedThicknesses.forEach(thickness => {
                    let code = '';
                    if (thicknessSystem === 'Oricare' || thicknessSystem === '' || parseFloat(thicknessSystem) === thickness) {
                        if (systemName === 'Pereti' || systemName === 'Pereti Smart') {
                            code = generateSystemCode({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "tabla"})
                            if (systemCode[code]) {
                                arraySupportOptions.push(1)
                            }
                            code = generateSystemCode({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "beton"})
                            if (systemCode[code]) {
                                arraySupportOptions.push(0)
                            }
                        }
                        else {
                            if (systemName.includes('Noisy')) {
                                code = generateSystemCodeNoisyPlating({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "tabla"})
                                if (systemCode[code]) {
                                    arraySupportOptions.push(1)
                                }
                                code = generateSystemCodeNoisyPlating({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "beton"})
                                if (systemCode[code]) {
                                    arraySupportOptions.push(0)
                                }
                            }
                            else {
                                if (systemName.includes('Pereti S')) {
                                    code = generateSystemCodeSpecialWalls({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, tab: systemName, support: "tabla"})
                                    if (systemCode[code]) {
                                        arraySupportOptions.push(1)
                                    }
                                    code = generateSystemCodeSpecialWalls({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, tab: systemName, support: "beton"})
                                    if (systemCode[code]) {
                                        arraySupportOptions.push(0)
                                    }
                                }
                                else {
                                    if (systemName.includes('Placari')) {
                                        code = generateSystemCodePlating({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "tabla"})
                                        if (systemCode[code]) {
                                            arraySupportOptions.push(1)
                                        }
                                        code = generateSystemCodePlating({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation, support: "beton"})
                                        if (systemCode[code]) {
                                            arraySupportOptions.push(0)
                                        }
                                    }
                                }
                            }
                        }

                    }
                })
            })
        })
        arraySupportOptions.sort();


        arraySupportOptions = _.uniqBy(arraySupportOptions);
        let options = [];

        arraySupportOptions.forEach(support => {
            if (support === 0) {
                options.push("Planseu beton armat");
            }
            if (support === 1) {
                options.push("Tabla cutata de acoperis");
            }
        })
        return options
    }

    /**
     * Getting all the ceiling support options from the generated offers
     * @param {*} genOffers
     * @returns
     */
    _getAllCeilingSupportOptions = (genOffers) => {
        const { offer, imports } = this.props;
        const { allCeilingSupportOptions } = this.state;
        let arraySupportOptions = [];

        arraySupportOptions.push('Oricare')

        genOffers.forEach(genOffer => {
            imports.importedThicknesses.forEach(thickness => {
                allCeilingSupportOptions.forEach(support => {
                    let generatedCode;
                    generatedCode = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Da, cu 1 strat', ceilingSupport: support, thicknessSystem: thickness});
                    if(offer.systemCode[generatedCode]) {
                        arraySupportOptions.push(support)
                    }
                    generatedCode = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Da, cu 2 straturi', ceilingSupport: support, thicknessSystem: thickness});
                    if(offer.systemCode[generatedCode]) {
                        arraySupportOptions.push(support)
                    }
                    generatedCode = generateSystemCodeCeiling({...genOffer, soundInsulation: 'Nu', ceilingSupport: support, thicknessSystem: thickness});
                    if(offer.systemCode[generatedCode]) {
                        arraySupportOptions.push(support)
                    }
                })
            })
        })

        arraySupportOptions = _.uniqBy(arraySupportOptions);

        return arraySupportOptions
    }

    /**
     *  Getting all the protection sense options from the systems from the database
     * @returns
     */
    _getProtectionSenseOptions = () => {
        const { offer } = this.props;
        let protectionOptions = [];

        protectionOptions.push('Oricare')

        Object.keys(offer.systemCode).forEach(function(key) {
            protectionOptions.push(offer.systemCode[key].protectionSense.toString());
        });

        protectionOptions = _.uniqBy(protectionOptions);


        return protectionOptions
    }

    /**
     * reseting all the fields
     * @param {} values
     * @param {*} setFieldValue
     * @param {*} setValues
     * @returns
     */
    _resetButton = (values, setFieldValue, setValues) => () => {
        this._updateHeight(values, setFieldValue, setValues)({target: {value: ''}});
    }

    /**
     * We use a separate function for height selection.
     * We are using setTimeout to let the user to enter the height
     * @param {*} values
     * @param {*} setFieldValue
     * @param {*} setValues
     * @returns
     */
    _updateHeight = (values, setFieldValue, setValues) => e => {
		setFieldValue('height', e.target.value);
        const newValues = {
            ...values,
            height: e.target.value,
        };

		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
		this.typingTimeout = setTimeout(() => this._updateInput(newValues, 'height', setFieldValue, setValues)(e), 500);
    }

    _updateSoundInsulationValue = (values, field, setFieldValue, setValues) => e => {
		setFieldValue(field, e.target.value);
        const newValues = {
            ...values,
            [field]: e.target.value,
        };

		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}
		this.typingTimeout = setTimeout(() => this._updateInput(newValues, field, setFieldValue, setValues)(e), 0);
    }

    /**
     * updating all the filters depending on what field is selected
     * @param {*} values
     * @param {*} field
     * @param {*} setFieldValue
     * @param {*} setValues
     * @returns
     */
    _updateInput = (values, field, setFieldValue, setValues) => e => {
        const { imports, dispatch } = this.props;
        const { profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, typeName, interaxSustineriOptions } = this.state;
        let newValues;

        this.setState({
            start: 1
        })

        let allValues = {...values};

        if (field !== 'height' && field !== 'soundInsulationMin' && field !== 'soundInsulationMax') {
            allValues = {
                ...allValues,
                [field]: e.target.value,
            }
        }

        /**
         * reseting all the fields if we reselect one of these fields
         */
        if (field === 'height' || field === 'thicknessSystem') {
            newValues = {
                ...values,
                [field]: e.target.value === 'Oricare' ? "" : e.target.value,
                fireResistance: "",
                profileType: "",
                moistureResistance: "",
                burglaryResistance: "",
                thicknessSystem: field === 'height' ? "Oricare" : e.target.value
            }
            if (field === 'height') {
                allValues = {
                    ...allValues,
                    thicknessSystem: "Oricare",
                }
            }
            allValues = {
                ...allValues,
                fireResistance: "Oricare",
                profileType: "Oricare",
                moistureResistance: "Oricare",
                burglaryResistance: "Oricare",
                secondaryInterax: "Oricare",
                basedPlates: "Oricare",
            }
        }
        else {
            newValues = {
                ...values,
                fireResistance: values.fireResistance === "Oricare" ? "" : values.fireResistance,
                moistureResistance: values.moistureResistance === "Oricare" ? "" : values.moistureResistance,
                profileType: values.profileType === "Oricare" ? "" : values.profileType,
                ceilingSupport: values.ceilingSupport === "Oricare" ? "" : values.ceilingSupport,
                burglaryResistance: values.burglaryResistance === "Oricare" ? "" : values.burglaryResistance,
                [field]: e.target.value === "Oricare" ? "" : e.target.value,
            }
        }

        setValues(allValues);

        let data = this._restructureData(newValues), systemNameFunction = this._findSystemType(typeName), genOffers = [], promises = [];
        /**
         * Generating all the offers for the fields selected
         */
        genOffers = generateAllOffers(this.state.tabSubTabValue.includes('Noisy') || this.state.tabValue.includes('Noisy') ? 'Placari Noisy' : this.state.tabValue, data, this._getAllInteraxFromSystems(), interaxSustineriOptions, this._getAllProfileTypesFromSystems(this.state.tabSubTabValue), this._getAllFireResistancesFromSystems(), this._getAllMoistureResistancesFromSystems(), this._getAllBurglaryResistanceFromSystems(), imports.importedSystems, imports.consumptions, systemNameFunction, imports.products)();
        // console.log(genOffers)
        if (field === "height") {
            promises.push(dispatch(getSoundInsulationValues({systemName: typeName, height: data.height}, this.state.tabSubTabValue)));
        }

        promises.push(dispatch({ type: 'RESET_SYSTEM_CODE' }));
        /**
         * getting all the system codes compatible with all the fields selected
         */
        promises.push(dispatch(getSystemCode({secondaryInterax: allValues.secondaryInterax, ceilingSupport: data.ceilingSupport, burglaryResistance: newValues.burglaryResistance, structureLink: this.state.tabSubTabValue, thickness: newValues.thicknessSystem, profileType: newValues.profileType, moistureResistance: newValues.moistureResistance, fireResistance: newValues.fireResistance, height: newValues.height, thicknessSystem: data.thicknessSystem, protectionSense: data.protectionSense || 'Oricare', soundInsulationValue: {min: 0, max: 90} || 'Oricare', systemName: typeName})));

        return Promise.all(promises).then(() => {
            const { tabSubTabValue, tabValue, allCeilingSupportOptions, allProtectionSenseOptions } = this.state;

            if (field !== 'soundInsulationMax' && field !== 'soundInsulationMin') {
                const { imports } = this.props;
                // Getting all the sound insulation min and max value
                let valuesSound = this._getValuesSound(imports?.soundInsulationValues?.min, imports?.soundInsulationValues?.max);
                setFieldValue("soundInsulationMin", valuesSound?.soundInsulationMin);
                setFieldValue("soundInsulationMax", valuesSound?.soundInsulationMax);
                data.soundInsulationMin = valuesSound?.soundInsulationMin;
                data.soundInsulationMax = valuesSound?.soundInsulationMax;
                this.setState({
                    soundInsulationMinSaved: valuesSound?.soundInsulationMin,
                    soundInsulationMaxSaved: valuesSound?.soundInsulationMax,
                })
            }

            // setting all the filters depending on the field selected
            this.setState({
                afterFetch: false,
                basedPlatesOptions: this._getAllPlates(genOffers, tabSubTabValue.includes('Noisy') || tabValue.includes('Noisy') ? 'Placari Noisy' : tabSubTabValue, newValues.thicknessSystem),
                allSecondaryInteraxOptions: this._getAllSecondaryInteraxFromSystems(),
                soundInsulationOptions: this._getAllSoundInsulations(genOffers, tabSubTabValue.includes('Noisy') || tabValue.includes('Noisy') ? 'Placari Noisy' : tabSubTabValue, data.soundInsulationValue || 'Oricare'),
                supportOptions:
                    tabSubTabValue.includes('lipire') || systemNameFunction.includes('Lipire') ? ["Beton", "Zidarie", "Tencuieli", "Altele"] :
                    tabValue === 'Placari' ? this._getAllSupportOptions(genOffers, tabSubTabValue.includes('Noisy') || tabValue.includes('Noisy') ? 'Placari Noisy' : tabValue, newValues.thicknessSystem) :
                    tabSubTabValue.includes('Pereti S') && !tabSubTabValue.includes('Pereti Smart') ? this._getAllSupportOptions(genOffers, tabSubTabValue, newValues.thicknessSystem) :
                    tabValue === 'Pereti' ? this._getAllSupportOptions(genOffers, 'Pereti', newValues.thicknessSystem) :
                    ["Planseu beton armat", "Tabla cutata de acoperis"],
                fireResistanceOptions: field !== 'fireResistance' || e.target.value === 'Oricare' || e.target.value === 'Oricare' ? this._getAllFireResistances() : fireResistanceOptions,
                profileTypeOptions: field !== 'profileType' || e.target.value === 'Oricare' ? this._getAllProfileTypes() : profileTypeOptions,
                moistureResistanceOptions: ((field !== 'moistureResistance' || e.target.value === 'Oricare')&& systemNameFunction.includes('Lipire') === false) ? this._getAllMoistureResistances() : moistureResistanceOptions,
                burglaryResistanceOptions: field !== 'burglaryResistance' || e.target.value === 'Oricare' ? this._getAllBurglaryResistance() : burglaryResistanceOptions,
                ceilingSupportOptions: tabSubTabValue.includes('Plafoane') ? this._getAllCeilingSupportOptions(genOffers) : allCeilingSupportOptions,
                protectionSenseOptions: tabSubTabValue.includes('Plafoane') ? this._getProtectionSenseOptions() : allProtectionSenseOptions,
                soundInsulationValueOptions: this._getAllSoundInsulationValues(data.soundInsulation),
            }, () => {
                const { soundInsulationOptions, profileTypeOptions, moistureResistanceOptions, burglaryResistanceOptions } = this.state;

                // if there is only one option available for a field, this will be auto-selected
                if (soundInsulationOptions.length === 1) {
                    setFieldValue('soundInsulation', soundInsulationOptions[0])
                }
                if (profileTypeOptions.length === 1) {
                    setFieldValue('profileType', profileTypeOptions[0])
                }
                if (moistureResistanceOptions.length === 1 && systemNameFunction.includes('Lipire') === false) {
                    setFieldValue('moistureResistance', moistureResistanceOptions[0])
                }
                if (burglaryResistanceOptions.length === 1) {
                    setFieldValue('burglaryResistance', burglaryResistanceOptions[0])
                }
                this.setState({
                    start: 2
                })
            })
        })
	};

    _getValuesSound = (minValue, maxValue) => {
        const { offer } = this.props;
        let min = maxValue, max = minValue;

        for(const [key, value] of Object.entries(offer.systemCode)) {
            if (value.valueSoundInsulation > max) {
                max = value.valueSoundInsulation
            }
            if (value.valueSoundInsulation < min) {
                min = value.valueSoundInsulation
            }
        }

        return {
            soundInsulationMin: min,
            soundInsulationMax: max
        }
    }

	_onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
    };

    _handleSubmit = values => {
        const { profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, typeName, tabValue, interaxSustineriOptions, isEdit, tabSubTabValue, isCreateNewOffer } = this.state;
        const { imports, offer, parentMatch, history, dispatch } = this.props;
        let promises = [];

        this.setState({
            submitButton: true
        })

        if (tabValue === 'Pereti' || tabSubTabValue.includes("Noisy") || tabValue.includes("Noisy") || tabValue.includes("Pereti Smart")) {
            let data = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance,
                profileType: values.profileType === 'Oricare' ? '' : values.profileType,
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance,
                burglaryResistance: values.burglaryResistance === 'Oricare' ? '' : values.burglaryResistance,
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation,
                interaxSustineri: values.interaxSustineri,
                support: values.support,
                finishing: values.finishing,
                thickness: values.thickness,
                thicknessSystem: values.thicknessSystem,
                basedPlates: values.basedPlates,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                face1: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
                face2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
            };
            // console.log(data)
            let systemNameFunction = this._findSystemType(typeName);
            // calculating all the 6 most cheap offers
            let currentOffers = getTheGoodOffers(tabSubTabValue.includes("Noisy") || tabValue.includes("Noisy") ? "Placari Noisy" : this.state.tabSubTabValue, data, this._getAllInteraxFromSystems(), interaxSustineriOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, imports.allowedPlates, imports.importedSystems, imports.consumptions, systemNameFunction, imports.products, imports.importedThicknesses, offer.systemCode);

            let savedOfferData = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance || '',
                profileType: values.profileType === 'Oricare' ? '' : values.profileType || '',
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance || '',
                burglaryResistance: values.burglaryResistance === 'Oricare' ? '' : values.burglaryResistance || '',
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation || '',
                interaxSustineri: values.interaxSustineri || '',
                support: values.support|| "",
                finishing: values.finishing || "",
                thicknessSystem: values.thicknessSystem,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                basedPlates: values.basedPlates,
                face1: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
                face2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
                initialFace1: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
                initialFace2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                },
                interax: '-',
                price: "0",
                consumption: [{}],
                consumptionExterior: [{}],
                systemName: typeName,
                surface: 1,
            };

            promises.push(dispatch(updateSavedOffer(parentMatch.params.offerId, savedOfferData)));

            currentOffers.forEach(thisOffer => {
                let currentOffer = {
                    soundInsulationMin: values.soundInsulationMin,
                    soundInsulationMax: values.soundInsulationMax,
                    intermediatePlate: thisOffer.intermediatePlate,
                    basedPlates: values.basedPlates,
                    thickness: thisOffer.thickness,
                    distance: thisOffer.distance,
                    thicknessSystem: thisOffer.thicknessSystem?.toString(),
                    savedOfferId: parentMatch.params.offerId,
                    height: thisOffer.height,
                    status: 'draft',
                    fireResistance: thisOffer.fireResistance,
                    profileType: thisOffer.profileType,
                    moistureResistance: thisOffer.moistureResistance,
                    burglaryResistance: thisOffer.burglaryResistance,
                    soundInsulation: thisOffer.soundInsulation,
                    support: thisOffer.support,
                    finishing: thisOffer.finishing,
                    interax: thisOffer.interax,
                    interaxSustineri: thisOffer.interaxSustineri,
                    systemCode: thisOffer.systemCode,
                    systemCodeTable: thisOffer.systemCodeTable,
                    codSap1: thisOffer.codSap1,
                    codSap2: thisOffer.codSap2,
                    codSap3: thisOffer.codSap3,
                    izolareAcustica: thisOffer.izolareAcustica,
                    index: thisOffer.index,
                    price: thisOffer.pret,
                    consumption: thisOffer.tablePrice,
                    consumptionExterior: thisOffer.tableExteriorPrice,
                    face1: {
                        plate1: thisOffer.plate.face1.plate1,
                        plate2: thisOffer.plate.face1.plate2,
                        plate3: thisOffer.plate.face1.plate3
                    },
                    face2: {
                        plate1: thisOffer.plate.face2.plate1,
                        plate2: thisOffer.plate.face2.plate2,
                        plate3: thisOffer.plate.face2.plate3,
                    },
                    initialFace1: {
                        plate1: thisOffer.plate.face1.plate1,
                        plate2: thisOffer.plate.face1.plate2,
                        plate3: thisOffer.plate.face1.plate3
                    },
                    initialFace2: {
                        plate1: thisOffer.plate.face2.plate1,
                        plate2: thisOffer.plate.face2.plate2,
                        plate3: thisOffer.plate.face2.plate3,
                    },
                    systemName: typeName,
                    surface: 1,
                };
                // console.log(currentOffer)
                promises.push(dispatch(saveOffer(currentOffer)))
            })
        }
        else
        if (tabValue === 'Placari') {
            let data = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance,
                profileType: values.profileType === 'Oricare' ? '' : values.profileType,
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance,
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation,
                support: values.support,
                finishing: values.finishing,
                thicknessSystem: values.thicknessSystem,
                basedPlates: values.basedPlates,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                plate: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                }
            };

            let systemNameFunction = this._findSystemType(typeName);
            let currentOffers = getTheGoodOffers(this.state.tabValue, data, this._getAllInteraxFromSystems(), interaxSustineriOptions, systemNameFunction === "Lipire" ? ['Oricare', ' '] : profileTypeOptions, systemNameFunction === "Lipire" ? ['Oricare', '0m'] : fireResistanceOptions, systemNameFunction === "Lipire" ? ['0', '1'] : moistureResistanceOptions, burglaryResistanceOptions, imports.allowedPlates, imports.importedSystems, imports.consumptions, systemNameFunction, imports.products, imports.importedThicknesses, offer.systemCode, systemNameFunction.includes("Lipire") ? "Placari Lipire" : "");

            let savedOfferData = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance || '',
                profileType: values.profileType === 'Oricare' ? '' : values.profileType || '',
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance || '',
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation || '',
                support: values.support|| "",
                finishing: values.finishing || "",
                thicknessSystem: values.thicknessSystem,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                basedPlates: values.basedPlates,
                platingPlates: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                },
                platingInitialPlates: {
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                },
                interax: '-',
                price: "0",
                consumption: [{}],
                consumptionExterior: [{}],
                systemName: typeName,
                surface: 1,
            };
            promises.push(dispatch(updateSavedPlatingOffer(parentMatch.params.offerId, savedOfferData)));

            currentOffers.forEach(thisOffer => {
                let currentOffer = {
                    soundInsulationMin: values.soundInsulationMin,
                    soundInsulationMax: values.soundInsulationMax,
                    basedPlates: values.basedPlates,
                    savedOfferId: parentMatch.params.offerId,
                    height: thisOffer.height,
                    thicknessSystem: thisOffer.thicknessSystem?.toString(),
                    status: 'draft',
                    fireResistance: thisOffer.fireResistance,
                    profileType: systemNameFunction === 'Lipire' ? '' : thisOffer.profileType,
                    moistureResistance: thisOffer.moistureResistance,
                    soundInsulation: thisOffer.soundInsulation,
                    interaxSustineri: thisOffer.interaxSustineri,
                    support: thisOffer.support,
                    finishing: thisOffer.finishing,
                    interax: thisOffer.interax,
                    index: thisOffer.index,
                    price: thisOffer.pret,
                    consumption: thisOffer.tablePrice,
                    consumptionExterior: thisOffer.tableExteriorPrice,
                    systemCode: thisOffer.systemCode,
                    systemCodeTable: thisOffer.systemCodeTable,
                    izolareAcustica: thisOffer.izolareAcustica,
                    codSap1: thisOffer.codSap1,
                    codSap2: thisOffer.codSap2,
                    codSap3: thisOffer.codSap3,
                    codSap4: thisOffer.codSap4,
                    platingPlates: {
                        plate1: thisOffer.plate.plate1,
                        plate2: thisOffer.plate.plate2,
                        plate3: thisOffer.plate.plate3,
                        plate4: thisOffer.plate.plate4,
                    },
                    platingInitialPlates:{
                        plate1: thisOffer.plate.plate1,
                        plate2: thisOffer.plate.plate2,
                        plate3: thisOffer.plate.plate3,
                        plate4: thisOffer.plate.plate4,
                    },
                    systemName: typeName,
                    surface: 1,
                };
                promises.push(dispatch(savePlatingOffer(currentOffer)))
            })
        }
        else
        if (tabValue === 'Plafoane') {
            let data = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance,
                profileType: values.profileType === 'Oricare' ? '' : values.profileType,
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance,
                burglaryResistance: values.burglaryResistance === 'Oricare' ? '' : values.burglaryResistance,
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation,
                ceilingSupport: values.ceilingSupport,
                finishing: values.finishing,
                thickness: values.thickness,
                protectionSense: values.protectionSense,
                thicknessSystem: values.thicknessSystem,
                basedPlates: values.basedPlates,
                secondaryInterax: values.secondaryInterax,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                face1: {
                    plate1: "",
                    plate2: "",
                },
                face2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                },
            };

            let systemNameFunction = this._findSystemType(typeName);

            let currentOffers = getTheGoodOffers(this.state.tabSubTabValue, data, this._getAllInteraxFromSystems(), interaxSustineriOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, imports.allowedPlates, imports.importedSystems, imports.consumptions, systemNameFunction, imports.products, imports.importedThicknesses, offer.systemCode);

            let savedOfferData = {
                savedOfferId: parentMatch.params.offerId,
                height: values.height,
                status: 'draft',
                fireResistance: values.fireResistance === 'Oricare' ? '' : values.fireResistance || '',
                profileType: values.profileType === 'Oricare' ? '' : values.profileType || '',
                moistureResistance: values.moistureResistance === 'Oricare' ? '' : values.moistureResistance || '',
                burglaryResistance: values.burglaryResistance === 'Oricare' ? '' : values.burglaryResistance || '',
                soundInsulation: values.soundInsulation === 'Oricare' ? '' : values.soundInsulation || '',
                ceilingSupport: values.ceilingSupport || "",
                protectionSense: values.protectionSense === 'Oricare' ? '' : values.protectionSense || '',
                finishing: values.finishing || "",
                thicknessSystem: values.thicknessSystem,
                soundInsulationMin: values.soundInsulationMin,
                soundInsulationMax: values.soundInsulationMax,
                basedPlates: values.basedPlates,
                face1: {
                    plate1: "",
                    plate2: "",
                },
                face2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                },
                initialFace1: {
                    plate1: "",
                    plate2: "",
                },
                initialFace2:{
                    plate1: "",
                    plate2: "",
                    plate3: "",
                    plate4: "",
                },
                interax: '-',
                price: "0",
                consumption: [{}],
                consumptionExterior: [{}],
                systemName: typeName,
                surface: 1,
            };

            promises.push(dispatch(updateSavedOffer(parentMatch.params.offerId, savedOfferData)));

            currentOffers.forEach(thisOffer => {
                let currentOffer = {
                    soundInsulationMin: values.soundInsulationMin,
                    soundInsulationMax: values.soundInsulationMax,
                    basedPlates: values.basedPlates,
                    thickness: thisOffer.thickness,
                    distance: thisOffer.distance,
                    thicknessSystem: thisOffer.thicknessSystem.toString(),
                    savedOfferId: parentMatch.params.offerId,
                    height: thisOffer.height,
                    status: 'draft',
                    fireResistance: thisOffer.fireResistance,
                    protectionSense: thisOffer.protectionSense,
                    profileType: thisOffer.profileType,
                    moistureResistance: thisOffer.moistureResistance,
                    burglaryResistance: thisOffer.burglaryResistance,
                    soundInsulation: thisOffer.soundInsulation,
                    ceilingSupport: thisOffer.ceilingSupport,
                    finishing: thisOffer.finishing,
                    interax: thisOffer.interax,
                    interaxSustineri: thisOffer.interaxSustineri,
                    systemCode: thisOffer.systemCode,
                    systemCodeTable: thisOffer.systemCodeTable,
                    codSap1: thisOffer.codSap1,
                    codSap2: thisOffer.codSap2,
                    codSap3: thisOffer.codSap3,
                    izolareAcustica: thisOffer.izolareAcustica,
                    index: thisOffer.index,
                    price: thisOffer.pret,
                    consumption: thisOffer.tablePrice,
                    consumptionExterior: thisOffer.tableExteriorPrice,
                    face1: {
                        plate1: thisOffer.plate.face1?.plate1,
                        plate2: thisOffer.plate.face1?.plate2,
                    },
                    face2: {
                        plate1: thisOffer.plate.face2?.plate1,
                        plate2: thisOffer.plate.face2?.plate2,
                        plate3: thisOffer.plate.face2?.plate3,
                        plate4: thisOffer.plate.face2?.plate4,
                    },
                    initialFace1: {
                        plate1: thisOffer.plate.face1?.plate1,
                        plate2: thisOffer.plate.face1?.plate2,
                    },
                    initialFace2: {
                        plate1: thisOffer.plate.face2?.plate1,
                        plate2: thisOffer.plate.face2?.plate2,
                        plate3: thisOffer.plate.face2?.plate3,
                        plate4: thisOffer.plate.face2?.plate4,
                    },
                    systemName: typeName,
                    surface: 1,
                };
                promises.push(dispatch(saveOffer(currentOffer)))
            })
        }

        const { isEditSession, isNewOfferEditSession } = this.state;

        return Promise.all(promises).then(() => { isCreateNewOffer ? history.push(`/private/create-new-offer/${ parentMatch.params.offerId }/generated-offers`) :
                                                  isNewOfferEditSession ? history.push(`/private/sessions/session/edit/${ parentMatch.params.id }/offers/new-offer/${ parentMatch.params.offerId }/generated-offers`) :
                                                  isEditSession ? history.push(`/private/sessions/session/edit/${ parentMatch.params.id }/offers/edit-offer/${ parentMatch.params.offerId }/generated-offers`) :
                                                  isEdit ? history.push(`/private/sessions/session/${ parentMatch.params.id }/offers/edit-offer/${ parentMatch.params.offerId }/generated-offers`)
                                                         : history.push(`/private/sessions/session/${ parentMatch.params.id }/offers/new-offer/${ parentMatch.params.offerId }/generated-offers`)});
	};

    _onBlur = (field, setFieldTouched) => () => {
		setFieldTouched(field);
	};

    render() {
        const { hasAccess, typeName, burglaryResistanceOptions, fireResistanceOptions, profileTypeOptions, ceilingSupportOptions, allCeilingSupportOptions, protectionSenseOptions, allProtectionSenseOptions, afterFetch, basedPlatesOptions,
            xsColumns, allSecondaryInteraxOptions, moistureResistanceOptions, soundInsulationOptions, supportOptions, finishingOptions, maxHeight, tabValue, tabSubTabValue, start, soundInsulationMaxSaved, soundInsulationMinSaved, mainTabValue } = this.state;
        const { offer, t, imports } = this.props;
        // console.log('system codes', offer.systemCode)
        if (offer.fetchingOffers || this.state.submitButton || afterFetch || !imports.fetchingInfo) {
            return (
                <PageLoader/>
			);
        }
        else
        return (
            <div>
            <Card className='general-card small-left'>
                <div className='offer-title-wrapper'>
                    <Typography
                        variant="h4"
                        component="h1">
                        {t('choose_system') }
                    </Typography>
                </div>
                <Formik
                    initialValues = {{
                        height: offer.savedOffer.height || "",
                        fireResistance: offer.savedOffer.fireResistance && offer.savedOffer.fireResistance.includes('minutes') ? offer.savedOffer.fireResistance.slice(0, -8) + 'm' : offer.savedOffer.fireResistance || "Oricare",
                        profileType: offer.savedOffer.profileType || "",
                        moistureResistance: offer.savedOffer.moistureResistance || "",
                        burglaryResistance: offer.savedOffer.burglaryResistance || "",
                        soundInsulation: offer.savedOffer.soundInsulation || soundInsulationOptions[0],
                        support: offer.savedOffer.support || supportOptions[0],
                        finishing: offer.savedOffer.finishing || finishingOptions[1],
                        thickness: offer.savedOffer.thickness || "",
                        thicknessSystem: offer.savedOffer.thicknessSystem || "",
                        protectionSense: offer.savedOffer?.protectionSense || '',
                        basedPlates: offer.savedOffer?.basedPlates || "Oricare",
                        secondaryInterax: '',
                        soundInsulationMin: soundInsulationMinSaved || 0,
                        soundInsulationMax: soundInsulationMaxSaved || 0,
                    }}
                    validationSchema = {
                        Yup.object().shape({
                            height: Yup.number()
                                .typeError(t('not_a_number'))
                                .nullable()
                                .test('testNumber', t('too_much'), (value) => parseFloat(value) <= parseFloat(maxHeight))
                                .test('testNumber', t('tooLittle'), (value) => parseFloat(value) > 0)
                                .required(t('required_field')),
                            fireResistance: Yup.string()
                                .oneOf(fireResistanceOptions),
                            profileType: Yup.string()
                                .oneOf(profileTypeOptions),
                            moistureResistance: Yup.string()
                                .oneOf(this._getAllMoistureResistancesFromSystems()),
                            finishing: Yup.string()
                                .oneOf(finishingOptions),
                            soundInsulationMin: Yup.number()
                                .typeError(t('not_a_number'))
                                .nullable()
                                .test('testNumber2', t('no_range'), (value) =>  {
                                    const { soundInsulationMinSaved, soundInsulationMaxSaved } = this.state;
                                    return parseFloat(value) >= parseFloat(soundInsulationMinSaved) && parseFloat(value) <= parseFloat(soundInsulationMaxSaved)
                                })
                                .required(t('required_field')),
                            soundInsulationMax: Yup.number()
                                .typeError(t('not_a_number'))
                                .nullable()
                                .test('testNumber3', t('no_range'), (value) => {
                                    const { soundInsulationMinSaved, soundInsulationMaxSaved } = this.state;
                                    return parseFloat(value) >= parseFloat(soundInsulationMinSaved) && parseFloat(value) <= parseFloat(soundInsulationMaxSaved)
                                })
                                .required(t('required_field')),
                        })
                    }
                    onSubmit={ this._handleSubmit }>
                { ({ getFieldProps, setFieldValue, setFieldTouched, values, errors, touched, handleSubmit, resetForm, setValues }) => {
                    return (
                        <form onSubmit={ handleSubmit }>
                            <Grid className = "mb-1r" >
                                <AppBar position="static" color='inherit' indicatorColor="inherit">
                                    <Tabs value = {mainTabValue} onChange={this._handleClickCategory} className={mainTabValue?.length > 0 ? "bar-style-after" : "bar-style"} TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                        <Tab value="nida" label={t('nida')}/>
                                        <Tab value="smart" label={t('smart')}/>
                                    </Tabs>
                                </AppBar>
                                {mainTabValue === "nida" ?
                                    <AppBar position="static" color='inherit' indicatorColor="inherit">
                                        <Tabs value = {tabValue} onChange={this._handleClickSisteme} className={tabValue?.length > 0 ? "bar-style-after" : "bar-style"} TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Pereti" label={t('walls')}/>
                                            <Tab value="Placari" label={t('linnings')}/>
                                            <Tab value="Plafoane" label={t('ceilings')}/>
                                        </Tabs>
                                    </AppBar> : null
                                }
                                {mainTabValue === "smart" ?
                                    <AppBar position="static" color='inherit' indicatorColor="inherit">
                                        <Tabs value = {tabValue} onChange={this._handleClickSisteme} className={tabValue?.length > 0 ? "bar-style-after" : "bar-style"} TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Pereti Smart" label={t("walls_smart")}/>
                                            {/* <Tab value="Placari Smart" label={t("linings_smart")}/>
                                            <Tab value="Plafoane Smart" label={t("ceilings_smart")}/> */}
                                        </Tabs>
                                    </AppBar> : null
                                }
                                {tabValue === 'Pereti' ?
                                    <AppBar position="static">
                                        <Tabs value = {tabSubTabValue} onChange={this._handlClickTabs} variant="scrollable" className="bar-style" TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Pereti" label={`${t('walls')} D`} />
                                            <Tab value="Pereti S" label={`${t('walls')} S`} />
                                            <Tab value="Pereti SL" label={`${t('walls')} SL`} />
                                            <Tab value="Pereti SLA" label={`${t('walls')} SLA`} />
                                        </Tabs>
                                    </AppBar>
                                    :null}
                                {tabValue === 'Pereti Smart' ?
                                    <AppBar position="static">
                                        <Tabs value = {tabSubTabValue} onChange={this._handlClickTabs} variant="scrollable" className="bar-style" TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Pereti Smart" label={`${t('walls')}`} />
                                        </Tabs>
                                    </AppBar>
                                    :null}
                                <TabPanel typeName={typeName} current={'walls_smart_simple'} value={tabSubTabValue} index={'Pereti Smart'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti Smart - Simplu Placat")}>
                                    {t('walls_s') +' (EI=' + imports?.systemsInformation['Pereti Smart - Simplu Placat'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Smart - Simplu Placat BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Smart - Simplu Placat Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current={'walls_smart_double'} value={tabSubTabValue} index={'Pereti Smart'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti Smart - Dublu Placat")}>
                                    {t('walls_d') + '  (EI=' + imports?.systemsInformation['Pereti Smart - Dublu Placat'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Smart - Dublu Placat BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Smart - Dublu Placat Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current={'walls_d_simple'} value={tabSubTabValue} index={'Pereti'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti D - Simplu Placat")}>
                                    {t('walls_s') + '  (EI=' + imports?.systemsInformation['Sisteme - Simplu Placat'] + ')' + '  (RC=' + imports?.systemsInformation['Sisteme - Simplu Placat BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Simplu Placat Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_d_double' value={tabSubTabValue} index={'Pereti'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti D - Dublu Placat")}>
                                    {t('walls_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Dublu Placat'] + ')' + '  (RC=' + imports?.systemsInformation['Sisteme - Dublu Placat BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Dublu Placat Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_d_triple' value={tabSubTabValue} index={'Pereti'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti D - Triplu Placat")}>
                                    {t('walls_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Triplu Placat'] + ')' + '  (RC=' + imports?.systemsInformation['Sisteme - Triplu Placat BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Triplu Placat Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_s_double' value={tabSubTabValue} index={'Pereti S'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti S - Dublu Placat")}>
                                    {t('walls_d') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat S'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat S BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat S Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_s_triple' value={tabSubTabValue} index={'Pereti S'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti S - Triplu Placat")}>
                                    {t('walls_t') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat S'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat S BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat S Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_s_asimetric' value={tabSubTabValue} index={'Pereti S'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti S - Asimetrici")}>
                                    {t('walls_s_asimetric') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Asimetrici '] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Asimetrici  BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Asimetrici  Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_s_double_intermediate' value={tabSubTabValue} index={'Pereti S'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti S - Dublu Intermediar")}>
                                    {t('walls_s_intermediar_d') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Dublu Intermediar '] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Dublu Intermediar  BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Dublu Intermediar  Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_s_triple_intermediate' value={tabSubTabValue} index={'Pereti S'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti S - Triplu Intermediar")}>
                                    {t('walls_s_intermediar_t') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Triplu Intermediar '] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Triplu Intermediar  BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Triplu Intermediar  Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_sl_simple' value={tabSubTabValue} index={'Pereti SL'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti SL - Simplu Placat")}>
                                    {t('walls_s') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Simplu Placat SL'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Simplu Placat SL BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Simplu Placat SL Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_sl_double' value={tabSubTabValue} index={'Pereti SL'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti SL - Dublu Placat")}>
                                    {t('walls_d') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat SL'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat SL BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Dublu Placat SL Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_sl_triple' value={tabSubTabValue} index={'Pereti SL'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti SL - Triplu Placat")}>
                                    {t('walls_t') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SL'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SL BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SL Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='walls_sla_triple' value={tabSubTabValue} index={'Pereti SLA'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Pereti SLA - Triplu Placat")}>
                                    {t('walls_t') + '  (EI=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SL'] + ')' + '  (RC=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SLA BurglaryInfo'] + ')' + '  (H<=' + imports?.systemsInformation['Pereti Separativi - Triplu Placat SLA Inaltime'] + ')'}
                                </TabPanel>
                                {tabValue === 'Placari' ?
                                    <AppBar position="static">
                                        <Tabs value = {tabSubTabValue} onChange={this._handlClickTabs } variant="scrollable" className="bar-style" TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Placari cu fixari" label={t('linnings_f')}/>
                                            <Tab value="Placari independente" label={t('linnings_i')}/>
                                            <Tab value="Placari liniare" label={t('linnings_l')}/>
                                            <Tab value="Placari lipire" label={t('linnings_p')}/>
                                            <Tab value="Placari Noisy cu fixari" label={t('linnings_nf')}/>
                                            <Tab value="Placari Noisy independente" label={t('linnings_ni')}/>
                                            <Tab value="Placari Noisy UU" label={t('linnings_nuu')}/>
                                        </Tabs>
                                    </AppBar>
                                    :null}
                                {tabValue === 'Placari Smart' ?
                                  <AppBar position="static">
                                      <Tabs value = {tabSubTabValue} onChange={this._handlClickTabs } variant="scrollable" className="bar-style" TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                          <Tab value="Placari cu fixari Smart" label={t('linnings_f')}/>
                                          <Tab value="Placari independente Smart" label={t('linnings_i')}/>
                                          <Tab value="Placari liniare Smart" label={t('linnings_l')}/>
                                      </Tabs>
                                  </AppBar>
                                  :null}
                                <TabPanel typeName={typeName} current={t('linnings_f')} value={tabSubTabValue} index={'Placari cu fixari Smart'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Smart - Simple")}>
                                    {t('linnings_s') +' (EI=' + imports?.systemsInformation['Sisteme - Placari Smart Simple Fixari'] + ')' +'  (H<=' + imports?.systemsInformation['Sisteme - Placari Smart Simple Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current={t('linnings_f')} value={tabSubTabValue} index={'Placari cu fixari Smart'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Smart - Duble")}>
                                    {t('linnings_d') +' (EI=' + imports?.systemsInformation['Sisteme - Placari Smart Duble Fixari'] + ')' +'  (H<=' + imports?.systemsInformation['Sisteme - Placari Smart Duble Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current={'plating_fix_simple'} value={tabSubTabValue} index={'Placari cu fixari'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari cu fixari - Simple")}>
                                    {t('linnings_s') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Simple Fixari'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Simple Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_fix_double' value={tabSubTabValue} index={'Placari cu fixari'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari cu fixari - Duble")}>
                                    {t('linnings_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Duble Fixari'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Duble Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_fix_triple' value={tabSubTabValue} index={'Placari cu fixari'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari cu fixari - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Triple Fixari'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Triple Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_fix_quadruple' value={tabSubTabValue} index={'Placari cu fixari'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari cu fixari - Cvadruple")}>
                                    {t('linnings_q') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Fixari'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_indep_simple' value={tabSubTabValue} index={'Placari independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari independente - Simple")}>
                                    {t('linnings_s') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Simple Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Simple Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_indep_double' value={tabSubTabValue} index={'Placari independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari independente - Duble")}>
                                    {t('linnings_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Duble Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Duble Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_indep_triple' value={tabSubTabValue} index={'Placari independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari independente - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Triple Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Triple Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_indep_quadruple' value={tabSubTabValue} index={'Placari independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari independente - Cvadruple")}>
                                    {t('linnings_q') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_liniar_double' value={tabSubTabValue} index={'Placari liniare'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari liniare - Duble")}>
                                    {t('linnings_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Duble Liniare'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Duble Liniare Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_liniar_triple' value={tabSubTabValue} index={'Placari liniare'} onClick = {this._handleClick(setFieldValue,"Creare oferta - Placari liniare - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Triple Liniare'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Triple Liniare Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_liniar_quadruple' value={tabSubTabValue} index={'Placari liniare'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari liniare - Cvadruple")}>
                                    {t('linnings_q') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Liniare'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Cvadruple Liniare Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='plating_sticking' value={tabSubTabValue} index={'Placari lipire'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Lipire")}>
                                    {t('linnings_p')}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='noisy_plating_fix_triple' value={tabSubTabValue} index={'Placari Noisy cu fixari'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Noisy cu fixari - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple Fixari'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple Fixari Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='noisy_plating_indep_double' value={tabSubTabValue} index={'Placari Noisy independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Noisy independente - Duble")}>
                                    {t('linnings_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Noisy Duble Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Noisy Duble Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='noisy_plating_indep_triple' value={tabSubTabValue} index={'Placari Noisy independente'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Noisy independente - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple Independente'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple Independente Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='noisy_plating_uu_double' value={tabSubTabValue} index={'Placari Noisy UU'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Noisy UU - Duble")}>
                                    {t('linnings_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Noisy Duble UU'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Noisy Duble UU Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='noisy_plating_uu_triple' value={tabSubTabValue} index={'Placari Noisy UU'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Placari Noisy UU - Triple")}>
                                    {t('linnings_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple UU'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Placari Noisy Triple UU Inaltime'] + ')'}
                                </TabPanel>
                                <TabPanel value={tabValue} current={t('Plafoane')} index={2} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Suspendate")} disabled>
                                    Plafoane
                                </TabPanel>
                                {tabValue === 'Plafoane' ?
                                    <AppBar position="static">
                                        <Tabs value = {tabSubTabValue} onChange={this._handlClickTabs} variant="scrollable" className="bar-style" TabIndicatorProps={{style: {backgroundColor: "white"}}}>
                                            <Tab value="Plafoane Suspendate" label={t('ceilings_s')}/>
                                            {hasAccess ? <Tab value="Plafoane Autoportante" label={t('ceilings_ss')}/> : null}
                                        </Tabs>
                                    </AppBar>
                                    :null}
                                <TabPanel typeName={typeName} current='ceiling_suspended_simple' value={tabSubTabValue} index={'Plafoane Suspendate'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Suspendate - Simple")}>
                                    {t('ceilings_plates_s') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Simple1'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Simple1 Inaltime'] + ') (' + t('ceilings_plates_s_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_suspended_double' value={tabSubTabValue} index={'Plafoane Suspendate'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Suspendate - Duble")}>
                                    {t('ceilings_plates_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Duble1'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Duble1 Inaltime'] + ') (' + t('ceilings_plates_d_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_suspended_triple' value={tabSubTabValue} index={'Plafoane Suspendate'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Suspendate - Triple")}>
                                    {t('ceilings_plates_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Triple1'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Triple1 Inaltime'] + ') (' + t('ceilings_plates_t_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_suspended_quadruple' value={tabSubTabValue} index={'Plafoane Suspendate'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Suspendate - Cvadruple")}>
                                    {t('ceilings_plates_q') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Cvadruple1'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Cvadruple1 Inaltime'] + ') (' + t('ceilings_plates_q_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_autoport_simple' value={tabSubTabValue} index={'Plafoane Autoportante'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Autoportante - Simple")}>
                                    {t('ceilings_plates_s') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Simple0'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Simple0 Inaltime'] + ') (' + t('ceilings_plates_s_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_autoport_double' value={tabSubTabValue} index={'Plafoane Autoportante'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Autoportante - Duble")}>
                                    {t('ceilings_plates_d') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Duble0'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Duble0 Inaltime'] + ') (' + t('ceilings_plates_d_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_autoport_triple' value={tabSubTabValue} index={'Plafoane Autoportante'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Autoportante - Triple")}>
                                    {t('ceilings_plates_t') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Triple0'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Triple0 Inaltime'] + ') (' + t('ceilings_plates_t_tooltip') + ')'}
                                </TabPanel>
                                <TabPanel typeName={typeName} current='ceiling_autoport_quadruple' value={tabSubTabValue} index={'Plafoane Autoportante'} onClick = {this._handleClick(setFieldValue, "Creare oferta - Plafoane Autoportante - Cvadruple")}>
                                    {t('ceilings_plates_q') + '  (EI=' + imports?.systemsInformation['Sisteme - Plafoane Cvadruple0'] + ')' + '  (H<=' + imports?.systemsInformation['Sisteme - Plafoane Cvadruple0 Inaltime'] + ') (' + t('ceilings_plates_q_tooltip') + ')'}
                                </TabPanel>
                            </Grid>
                            {typeName !== "0" ?
                                <div className='offer-title-wrapper'>
                                    <Typography
                                        variant="h4"
                                        component="h1">
                                        { t(translations[typeName]) }
                                    </Typography>
                                </div>
                            : null}
                        {typeName !== "0" ?
                            <div className={`${start === 1 ? 'loader' : null}`}>
                            <Grid
                                spacing={ 5 }
                                className='manage-offer-fields'
                                container>
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CssTextField
                                        { ...getFieldProps('height') }
                                        variant="outlined"
                                        autoComplete='off'
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        fullWidth
                                        label={ tabSubTabValue.includes("Plafoane") && tabSubTabValue.includes("Suspendate") ? t('ceilings_distance') + " (0.1cm - " + maxHeight + "cm)" : tabSubTabValue.includes("Plafoane")  ? t('max_opening') + " (0.1cm - " + maxHeight + "cm)" : t('height') + "(0.1m, " + maxHeight + "m)" }
                                        helperText={ values.height !== '' ? errors.height : null }
                                        onChange={ this._updateHeight(values, setFieldValue, setValues) }
                                        onBlur={ this._onBlur('height', setFieldTouched) }
                                        error={values.height !== '' ? errors.height : null}
                                    />
                                </Grid>
                                {tabSubTabValue.includes("lipire") === false ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('thicknessSystem') }
                                        readOnly = { values.height === ''}
                                        hideEmpty
                                        label={ `${t('thickness_system')} (mm)` }
                                        options={ makeOptions([...imports.importedThicknesses || [], 'Oricare'], [...imports.importedThicknesses || [], 'Oricare'], t, "thicknessSystem") }
                                        onChange={ this._updateInput(values, 'thicknessSystem', setFieldValue, setValues) }/>
                                </Grid> : null}
                                {tabValue === 'Pereti' || tabValue === 'Pereti Smart' || tabValue === 'Plafoane' || (tabValue === 'Placari' && tabSubTabValue.includes("lipire") === false) ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('fireResistance') }
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        hideEmpty
                                        label={ t('fire_resistance') }
                                        options={ makeOptions(this._getAllFireResistancesFromSystems(), fireResistanceOptions, t, "fire") }
                                        onChange={ this._updateInput(values, 'fireResistance', setFieldValue, setValues) }/>
                                </Grid> : null}
                                {tabValue === 'Pereti' || tabValue === 'Pereti Smart' ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('burglaryResistance') }
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        hideEmpty
                                        label={ t('burglary_resistance') }
                                        options={ makeOptions(this._getAllBurglaryResistanceFromSystems(), burglaryResistanceOptions, t, "burglaryResistance") }
                                        onChange={ this._updateInput(values, 'burglaryResistance', setFieldValue, setValues) }/>
                                </Grid> : null}
                                { tabSubTabValue === 'Plafoane Suspendate' ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('ceilingSupport') }
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        hideEmpty
                                        label={ t('ceilings_support') }
                                        options={ makeOptions(allCeilingSupportOptions, ceilingSupportOptions, t, "support_type") }
                                        onChange={ this._updateInput(values, 'ceilingSupport', setFieldValue, setValues) }/>
                                </Grid> : null}
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('moistureResistance') }
                                        readOnly = { values.height === '' || values.thicknessSystem === ' ' }
                                        hideEmpty
                                        label={ t('moisture_resistance') }
                                        options={ makeOptions(this._getAllMoistureResistancesFromSystems(), tabSubTabValue.includes("lipire") === false ? moistureResistanceOptions : this._getAllMoistureResistancesFromSystems(), t, "moistureResistance") }
                                        onChange={ this._updateInput(values, 'moistureResistance', setFieldValue, setValues) }/>
                                </Grid>
                                {tabValue === 'Pereti' || tabValue === 'Pereti Smart' || tabValue === 'Plafoane' || (tabValue === 'Placari' && tabSubTabValue.includes("lipire") === false) ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('profileType') }
                                        readOnly = { values.height === '' || values.thicknessSystem === ' ' }
                                        hideEmpty
                                        label={ t('profile_type') }
                                        options={ makeOptions(this._getAllProfileTypesFromSystems(tabSubTabValue), profileTypeOptions, t, "profileType", tabSubTabValue) }
                                        onChange={ this._updateInput(values, 'profileType', setFieldValue, setValues) }/>
                                </Grid> : null}
                                { tabValue !== 'Plafoane' ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('support') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ t('support') }
                                        options={ makeOptions(supportOptions, supportOptions, t) }
                                        onChange={ this._updateInput(values, 'support', setFieldValue, setValues) }/>
                                </Grid> : null}
                                {tabValue === 'Pereti' || tabValue === 'Pereti Smart' || (tabValue === 'Placari' && tabSubTabValue.includes("lipire") === false) || tabValue === 'Plafoane' ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('soundInsulation') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' ' }
                                        label={ t('sound_insulation') }
                                        options={ makeOptions(['Oricare', 'Nu', 'Da'], soundInsulationOptions, t, "soundInsulation") }
                                        onChange={ this._updateInput(values, 'soundInsulation', setFieldValue, setValues) }/>
                                </Grid> : null}
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('finishing') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ t('finishing') }
                                        options={ makeOptions(finishingOptions, finishingOptions, t, "finishing") }
                                        onChange={ this._updateInput(values, 'finishing', setFieldValue, setValues) }/>
                                </Grid>
                                { tabValue === 'Plafoane' ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('protectionSense') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ t('protection_direction') }
                                        options={ makeOptions(allProtectionSenseOptions, protectionSenseOptions, t, 'protectionSense') }
                                        onChange={ this._updateInput(values, 'protectionSense', setFieldValue, setValues) }/>
                                </Grid> : null}
                                {typeName.includes("Plafoane") && typeName.includes("Simple") && typeName.includes("Suspendate") ?
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('secondaryInterax') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ t('interax_secondary') }
                                        options={ makeOptions(allSecondaryInteraxOptions, allSecondaryInteraxOptions, t) }
                                        onChange={ this._updateInput(values, 'secondaryInterax', setFieldValue, setValues) }/>
                                </Grid> : null}
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CustomSelect
                                        { ...getFieldProps('basedPlates') }
                                        hideEmpty
                                        readOnly = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ `${t('based_plates')}` }
                                        options={ makeOptions(this._getAllPlatesFromSystems(tabSubTabValue), basedPlatesOptions, t) }
                                        onChange={ this._updateInput(values, 'basedPlates', setFieldValue, setValues) }
                                        onBlur={ this._onBlur('basedPlates', setFieldTouched) }/>
                                </Grid>
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CssTextField
                                        { ...getFieldProps('soundInsulationMin') }
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                        fullWidth
                                        disabled = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ `${t('sound_insulation_label')} (min - ${soundInsulationMinSaved || 0} dB)` }
                                        helperText={ values.height !== '' ? errors.soundInsulationMin : null }
                                        onChange={ this._updateSoundInsulationValue(values, 'soundInsulationMin', setFieldValue, setValues) }
                                        onBlur={ this._onBlur('soundInsulationMin', setFieldTouched) }
                                        error={values.soundInsulationMin !== '' ? errors.soundInsulationMin : null}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={ xsColumns }>
                                    <CssTextField
                                        { ...getFieldProps('soundInsulationMax') }
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                        disabled = { values.height === '' || values.thicknessSystem === ' '}
                                        label={ `${t('sound_insulation_label')} (${t('max')} - ${soundInsulationMaxSaved || 0} dB)` }
                                        helperText={ values.height !== '' ? errors.soundInsulationMax : null }
                                        onChange={ this._updateSoundInsulationValue(values, 'soundInsulationMax', setFieldValue, setValues) }
                                        onBlur={ this._onBlur('soundInsulationMax', setFieldTouched) }
                                        error={values.soundInsulationMax !== '' ? errors.soundInsulationMax : null}
                                    />
                                </Grid>
                            </Grid>
                            <div container className='generate-buttons mt-30'>
                                <SecondaryButton className="imports-button pl-b pr-b"
                                    prefix={(<CancelIcon className="mr-5"/>)}
                                    onClick = {this._resetButton(values, setFieldValue, setValues)}>
                                    { t('reset_offer') }
                                </SecondaryButton>
                                    <GeneralButton className="imports-button pl-17 pr-20"
                                        prefix={(<CachedIcon className="mr-5"/>)}
                                        onClick = {handleSubmit}
                                        loading={ this.state.submitButton }
                                        type='submit'>
                                        { t('generate_offers') }
                                    </GeneralButton>
                            </div>

                        </div>: null }
                    </form>
                    );
                }}
                </Formik>
            </Card>
            </div>

        );
    }
}

const mapStateToProps = store => ( {
    offer: store.offer,
    session: store.session,
    imports: store.imports,
} );

export default withTranslation()(connect(mapStateToProps)(withStyles(styles)(CreateAndUpdateoffers)));
