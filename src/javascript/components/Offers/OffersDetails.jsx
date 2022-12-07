import React, { PureComponent } from 'react';
import { Card, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getOffer, getSessions, updateSavedOffer, saveSession } from '../../actions/offerActions.js';
import SaveOfferButton from './SaveOfferButton.jsx';
import BackToOffersButton from './BackToOffersButton.jsx';
import { getSession, updateOffersSession } from '../../actions/sessionActions.js'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Offer3DImage from "./Offer3DImage";
import ExternalLinks from "./ExternalLinks";
import { roundNumber } from '../../utils/utils.js';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { colours } from '../../utils/colours.js';
import CustomSwitch from '../Templates/CustomSwitch.jsx';
import PageLoader from '../../components/Templates/PageLoader.jsx';
import SessionModal from './SessionModal.jsx';
import { translationsDetails } from '../../utils/constants.js';

class OffersDetails extends PureComponent {

    constructor(props) {
        super(props);

        const { t, parentMatch } = props;

        this.tableHeaders = [
            { id: 'nr', label: t('nr') },
            { id: 'sap', label: t('sap_code') },
            { id: 'productName', label: t('product_name') },
            { id: 'amount', label: `${t('amount')} / ${t('square_meter')}`, align: 'right' },
            { id: 'amountSurface', label: `${t('amount')} / ${t('surface')}`, align: 'right' },
            { id: 'unitPrice', label: `${t('price')} / ${t('unit_of_measure')}`, align: 'right' },
            { id: 'price', label: `${t('price')} / ${t('square_meter')}`, align: 'right' },
            { id: 'priceSurface', label: `${t('price')} / ${t('surface')}`, align: 'right' },
        ];

        this.tableHeaders2 = [
            { id: 'nr', label: t('nr') },
            { id: 'productName', label: t('product_name') },
            { id: 'amount', label: `${t('amount')} / ${t('surface')}`, align: 'right' },
            { id: 'priceSurface', label: `${t('price')} / ${t('surface')}`, align: 'right' },
        ];

        this.state = {
            deleteDialogOpen: false,
            offers: [],
            caractTehnici: [],
            systemType: 0,
            surface: 1,
            jointLength: 1,
            excelName: '',
            helperText: '',
            deactivateColumns: false,
            tableHeaders: this.tableHeaders,
            error: false,
            isEdit: parentMatch.path.indexOf('/edit-offer') !== -1,
            isEditSession: parentMatch.path.indexOf('/session/edit') !== -1,
            isNewOfferEditSession: parentMatch.path.indexOf('/session/edit') !== -1 && parentMatch.path.indexOf('/new-offer') !== -1,
            isCreateNewOffer: parentMatch.path.indexOf('/create-new-offer') !== -1,
            consumptions: [],
            openModal: false,
        };
    }

    _deactivateColumns = () => () => {
        this.setState((prevState) => ({
            deactivateColumns: !prevState.deactivateColumns,
            tableHeaders: !prevState.deactivateColumns === true ? this.tableHeaders2 : this.tableHeaders
        }))
    }

    _saveConsumptions = () => {
        const { offer } = this.props;
        this.setState({
            consumptions: offer.offer.consumption
        })
    }

    componentDidMount() {
        const { dispatch, match, parentMatch } = this.props;
        const { isCreateNewOffer } = this.state;

        window.addEventListener('resize', this._changeColumns);

        let promises = [];

        promises.push(dispatch(getSessions()));

        if (parentMatch.path.indexOf('/view') !== -1) {
            promises.push(dispatch(getSession(parentMatch.params.id, parentMatch.path.indexOf('/view') !== -1, match?.params?.offerDetailsId, this._prelucrateData)));
        }
        else {
            if (isCreateNewOffer === false) {
                promises.push(dispatch(getSession(parentMatch.params.id, parentMatch.path.indexOf('/view') !== -1, match?.params?.offerDetailsId)));
            }
            promises.push(dispatch(getOffer(match?.params?.offerDetailsId, this._prelucrateData)));
        }

        return Promise.all(promises).then(() => {
        });
    }

    _prelucrateData = (offer) => {
        const { match } = this.props;
        const { session, t } = this.props;
        let allCaracteristiciTehnice = [], nrD = 0, nrOfPlates, profileType = 0, excelNameBefore = '';
        session?.session?.session.map(item => {
            if (item._id === match.params.offerId) {
                excelNameBefore = item.excelName || '';
            }
        })
        console.log(offer.offer);
        if (offer?.offer?.systemName) {
            const [primaryInterax, secondaryInterax] = offer.offer.interax.split('/')

            if (offer.offer.systemName.includes("Plafoane")) {
                let totalWeight = 0, izolatie = '', principalStructure = t('unspecified'), secondaryStructure = t('unspecified'), parameterStructure = t('unspecified');

                offer.offer.consumption.forEach(consumption => {
                    console.log(consumption)
                    if (consumption.codSap && consumption.codSap.includes('cod') === false && consumption.amount !== 0) {
                        totalWeight = totalWeight + parseFloat(parseFloat(consumption.weight) * parseFloat(consumption.amount));
                    }
                    if (consumption?.productName?.includes('Mineral')) {
                        izolatie = consumption?.productName;
                    }
                    if (offer.offer.systemName?.includes("Suspendate")) {
                        if ((consumption?.productName?.includes("CD") || consumption?.productName?.includes("UA")) && consumption?.productName?.includes("Profil")) {
                            principalStructure = consumption?.productName;
                        }
                        if (consumption?.productName?.includes("CD") && consumption?.productName?.includes("Profil")) {
                            secondaryStructure = consumption?.productName;
                        }
                        if (consumption?.productName?.includes("UD") && consumption?.productName?.includes("Profil")) {
                            parameterStructure = consumption?.productName;
                        }
                    }
                    else {
                        if ((consumption?.productName?.includes("CW") || consumption?.productName?.includes("UA")) && consumption?.productName?.includes("Profil")) {
                            principalStructure = consumption?.productName;
                        }
                        if (consumption?.productName?.includes("UW") && consumption?.productName?.includes("Profil") && consumption?.productName?.includes("Prelungire") === false) {
                            parameterStructure = consumption?.productName;
                        }
                    }
                })
                let fResistance = offer.offer.fireResistance;
                if (offer.offer.fireResistance.includes('minutes')) {
                    fResistance = offer.offer.fireResistance.slice(0, -8) + ' ' + t('minute')
                } else {
                    if (offer.offer.fireResistance.includes('m') === true) {
                        fResistance = offer.offer.fireResistance.slice(0, -1) + ' ' + t('minute')
                    }
                }
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('fire_resistance'),
                    valori: offer.offer.fireResistance === '0' || fResistance === "0 minute" ? t("unspecified") : "El = " + fResistance
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('protection_direction'),
                    valori: offer.offer.fireResistance === '0' || fResistance === "0 minute" ? t("unspecified") : (offer.offer.protectionSense === "1" ? t("direction_1") : offer.offer.protectionSense === "2" ? t("direction_2") : offer.offer.protectionSense === "3" ? t("direction_3") : offer.offer.protectionSense)
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('moisture_resistance'),
                    valori: offer.offer.moistureResistance === '0' ? t('unspecified') : t('cu_rezistenta')
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('sound_insulation_label'),
                    valori: "Rw = " + offer.offer.izolareAcustica + ' dB'
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('ceilings_distance'),
                    valori: "max " + offer.offer.height + ' cm'
                });
                if (offer.offer.systemName.includes("Suspendate")) {
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('structure_type'),
                        valori: offer.offer.ceilingSupport + '@ max ' + offer.offer.interaxSustineri + ' cm',
                    });
                }
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('sistem_weight'),
                    valori: totalWeight.toFixed(0) + ' kg'
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('principal_structure'),
                    valori: primaryInterax === '0' || principalStructure === 'unspecified' ? t('unspecified') : (principalStructure ? principalStructure + ' @  ' + primaryInterax : t('unspecified'))
                });
                if (offer.offer.systemName.includes("Suspendate")) {
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('secondary_structure'),
                        valori: secondaryStructure ? secondaryStructure + ' @  ' + secondaryInterax : t('unspecified')
                    });
                }
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('parameter_structure'),
                    valori: parameterStructure ? parameterStructure : t('unspecified')
                });
                let arrayOfPlatesA;
                if (offer?.offer?.plate?.face1?.plate3) {
                    arrayOfPlatesA = [offer?.offer?.plate?.face1?.plate3];
                }
                else {
                    arrayOfPlatesA = [];
                }
                if (offer?.offer?.plate?.face1?.plate2?.length > 0) {
                    arrayOfPlatesA.push(offer.offer.plate.face1.plate2);
                }
                if (offer?.offer?.plate?.face1?.plate1?.length > 0) {
                    arrayOfPlatesA.push(offer.offer.plate.face1.plate1);
                }
                let arrayOfPlatesB = [offer?.offer?.plate?.face2?.plate1];
                if (offer?.offer?.plate?.face2?.plate2?.length > 0) {
                    arrayOfPlatesB.push(offer.offer.plate.face2.plate2);
                }
                if (offer?.offer?.plate?.face2?.plate3?.length > 0) {
                    arrayOfPlatesB.push(offer.offer.plate.face2.plate3);
                }
                if (offer?.offer?.plate?.face2?.plate4?.length > 0) {
                    arrayOfPlatesB.push(offer.offer.plate.face2.plate4);
                }

                let stringOfPlatesA = '';
                let countsA = {};
                arrayOfPlatesA.forEach(function (x) { countsA[x] = (countsA[x] || 0) + 1; });
                for (const [key, value] of Object.entries(countsA)) {
                    stringOfPlatesA += `${value}x ${key}, `;
                }
                stringOfPlatesA = stringOfPlatesA.slice(0, -2);
                let stringOfPlatesB = '';
                let countsB = {};
                arrayOfPlatesB.forEach(function (x) { countsB[x] = (countsB[x] || 0) + 1; });
                for (const [key, value] of Object.entries(countsB)) {
                    stringOfPlatesB += `${value}x ${key}, `;
                }
                stringOfPlatesB = stringOfPlatesB.slice(0, -2);
                if (offer.offer.systemName.includes("Autoportante")) {
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('plating_type_upper_face'),
                        valori: stringOfPlatesA.length > 3 ? stringOfPlatesA : t('unspecified')
                    });
                }
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('plating_type_lower_face'),
                    valori: stringOfPlatesB
                });
                allCaracteristiciTehnice.push({
                    caracteristiciTehnici: t('wool_type'),
                    valori: izolatie || t('unspecified')
                });
                this.setState({
                    caractTehnici: allCaracteristiciTehnice,
                    systemType: offer.offer.systemName.includes("Placat") ? 'Pereti' : "Noisy" + nrOfPlates / 2,
                    surface: offer.offer.surface.toFixed(2),
                    jointLength: offer?.offer?.jointLength?.toFixed(2) || (1 / offer.offer.height).toFixed(2),
                    excelName: excelNameBefore || offer.offer.excelName,
                    jointLength: (1 / offer.offer.height).toFixed(2),
                })
            }
            else {
                if (offer.offer.plate && offer.offer.plate.face2 && offer.offer.plate.face2.plate1) {
                    if (offer.offer.plate.face2.plate3) {
                        nrOfPlates = 6;

                    } else {
                        if (offer.offer.plate.face2.plate2) {
                            nrOfPlates = 4;
                        } else {
                            nrOfPlates = 2;
                        }
                    }
                    if (offer.offer.systemName.includes("UU")) {
                        nrOfPlates /= 2;
                    }

                    if (offer.offer.profileType.includes("60")) {
                        profileType = 60;
                    }

                    if (offer.offer.profileType.includes("50")) {
                        profileType = 50;
                    }

                    if (offer.offer.profileType.includes("75")) {
                        profileType = 75;
                    }

                    if (offer.offer.profileType.includes("100")) {
                        profileType = 100;
                    }
                    if (offer.offer.systemName.includes("UU")) {
                        let thicknessPlate1 = offer.offer.plate.face1.plate1.includes(12.5) ? 12.5 : 15;
                        let thicknessPlate2 = offer.offer.plate.face2.plate1.includes(12.5) ? 12.5 : 15;

                        nrD = (thicknessPlate1 > thicknessPlate2 ? thicknessPlate1 : thicknessPlate2) * nrOfPlates + profileType;
                    } else {
                        if (offer.offer.plate.face1.plate1.includes(12.5)) {
                            nrD = 12.5 * nrOfPlates + profileType;
                        } else {
                            nrD = 15 * nrOfPlates + profileType;
                        }
                    }
                    if (offer.offer.systemName.includes("Noisy") && offer.offer.systemName.includes("UU") === false) {
                        const [profileType1, profileType2] = offer.offer.profileType.split('/')
                        nrD += parseFloat(profileType2.replace('C', '').replace('W', '').replace('D', '').replace('U', ''));
                        nrD += 10;
                    }
                    let totalWeight = 0, ghidajInf = '', ghidajSup = '', izolatie = '', profilName = '';
                    offer.offer.consumption.forEach(consumption => {
                        if (consumption.codSap && consumption.codSap.includes('cod') === false && consumption.amount !== 0) {
                            totalWeight = totalWeight + parseFloat(parseFloat(consumption.weight) * parseFloat(consumption.amount));
                        }
                        if (consumption?.productName?.includes('UW') && consumption?.productName?.includes('prelungire') === false) {
                            if (consumption?.productName.includes('UW' + profileType)) {
                                if (consumption?.productName?.includes("montanti") === false) {
                                    ghidajInf = consumption.productName;
                                }
                            } else {
                                if (consumption?.productName?.includes("montanti") === false) {
                                    ghidajSup = consumption.productName;
                                }
                            }
                        }
                        if (consumption?.productName?.includes('CW') || (consumption?.productName?.includes('UW') && profilName.includes("CW") === false)) {
                            if (consumption?.productName.includes("montanti") === false) {
                                profilName = consumption.productName;
                            }
                        }
                        if (consumption?.productName?.includes('Mineral')) {
                            izolatie = consumption.productName;
                        }
                    })
                    let fResistance = offer.offer.fireResistance;
                    if (offer.offer.fireResistance.includes('minutes')) {
                        fResistance = offer.offer.fireResistance.slice(0, -8) + ' ' + t('minute')
                    } else {
                        if (offer.offer.fireResistance.includes('m') === true) {
                            fResistance = offer.offer.fireResistance.slice(0, -1) + ' ' + t('minute')
                        }
                    }
                    let rezUmid = t('unspecified');
                    switch (offer.offer.moistureResistance) {
                        case '1':
                            rezUmid = t('face') + ' A';
                            break;
                        case '1e':
                            rezUmid = t('face') + ' A ' + t('exterior');
                            break;
                        case '2':
                            rezUmid = t('face') + ' A ' + t('and') + ' ' + t('face') + ' B';
                            break;
                        case '2e':
                            rezUmid = t('face') + ' A ' + t('exterior') + ' ' + t('and') + ' ' + t('face') + ' B ' + t('exterior');
                            break;
                    }
                    // plates A

                    let arrayOfPlatesA;
                    if (offer?.offer?.plate?.face1?.plate3) {
                        arrayOfPlatesA = [offer?.offer?.plate?.face1?.plate3];
                    }
                    else {
                        arrayOfPlatesA = [];
                    }
                    if (offer?.offer?.plate?.face1?.plate2?.length > 0) {
                        arrayOfPlatesA.push(offer.offer.plate.face1.plate2);
                    }
                    if (offer?.offer?.plate?.face1?.plate1?.length > 0) {
                        arrayOfPlatesA.push(offer.offer.plate.face1.plate1);
                    }
                    let stringOfPlatesA = '';
                    let countsA = {};
                    arrayOfPlatesA.forEach(function (x) { countsA[x] = (countsA[x] || 0) + 1; });
                    for (const [key, value] of Object.entries(countsA)) {
                        stringOfPlatesA += `${value}x ${key}, `;
                    }
                    stringOfPlatesA = stringOfPlatesA.slice(0, -2);
                    // plates B
                    let arrayOfPlatesB = [offer?.offer?.plate?.face2?.plate1];
                    if (offer?.offer?.plate?.face2?.plate2?.length > 0) {
                        arrayOfPlatesB.push(offer.offer.plate.face2.plate2);
                    }
                    if (offer?.offer?.plate?.face2?.plate3?.length > 0) {
                        arrayOfPlatesB.push(offer.offer.plate.face2.plate3);
                    }
                    let stringOfPlatesB = '';
                    let countsB = {};
                    arrayOfPlatesB.forEach(function (x) { countsB[x] = (countsB[x] || 0) + 1; });
                    for (const [key, value] of Object.entries(countsB)) {
                        stringOfPlatesB += `${value}x ${key}, `;
                    }
                    stringOfPlatesB = stringOfPlatesB.slice(0, -2);
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('fire_resistance'),
                        valori: offer.offer.fireResistance === '0' || fResistance === "0 minute" ? t("unspecified") : "El = " + fResistance
                    });
                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('moisture_resistance'), valori: rezUmid });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('sound_proof'),
                        valori: "Rw = " + offer.offer.izolareAcustica + ' dB'
                    });
                    if (offer.offer.systemName.includes("Placat")) {
                        allCaracteristiciTehnice.push({
                            caracteristiciTehnici: t('burglary_resistance'),
                            valori: offer.offer.burglaryResistance === 0 || offer.offer.burglaryResistance === '0' ? t("unspecified") : "RC" + offer.offer.burglaryResistance
                        });
                    }
                    else {
                        if (offer.offer.systemName.includes("Autoportante") === false && offer.offer?.interaxSustineri) {
                            let inter = '';
                            if (offer.offer.interaxSustineri === '250') {
                                inter = '250/' + t('vinclu');
                            }
                            if (offer.offer.interaxSustineri === '125') {
                                inter = '125/' + t('bride');
                            }
                            if (offer.offer.interaxSustineri === '0' || offer.offer.interaxSustineri === '1') {
                                inter = t('Fara') + ' ';
                            }
                            allCaracteristiciTehnice.push({
                                caracteristiciTehnici: t('interaxSustineri'),
                                valori: inter + " max " + offer.offer.interaxSustineri + 'm',
                            });
                        }
                    }
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('height'),
                        valori: "max " + offer.offer.height + (offer.offer.systemName.includes("Plafoane") ? ' cm' : ' m')
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('sistem_weight'),
                        valori: totalWeight.toFixed(0) + ' Kg/mp'
                    });
                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('thickness'), valori: (offer.offer.thickness || offer.offer.thicknessSystem) + ' mm' });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('beam_type'),
                        valori: profilName ? profilName + ' @  ' + offer.offer.interax : t('unspecified')
                    });
                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('lower_guiding'), valori: ghidajInf || t('unspecified') });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('upper_guiding'),
                        valori: ghidajSup || ghidajInf || t('unspecified')
                    });
                    if (offer.offer.systemName.includes("Autoportante") === false) {
                        allCaracteristiciTehnice.push({
                            caracteristiciTehnici: t('plating_type_face_a'),
                            valori: stringOfPlatesA
                        });
                    }
                    if (offer.offer.intermediatePlate) {
                        allCaracteristiciTehnice.push({
                            caracteristiciTehnici: t('type_intermediate_plate'),
                            valori: offer.offer.intermediatePlate
                        });
                    }
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('plating_type_face_b'),
                        valori: stringOfPlatesB
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('upper_support'),
                        valori: t(offer.offer.support)
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('wool_type'),
                        valori: izolatie || t('unspecified')
                    });
                    this.setState({
                        caractTehnici: allCaracteristiciTehnice,
                        systemType: offer.offer.systemName.includes("Placat") ? 'Pereti' : "Noisy" + nrOfPlates / 2,
                        surface: offer.offer.surface.toFixed(2),
                        excelName: excelNameBefore || offer.offer.excelName,
                        jointLength: offer?.offer?.jointLength?.toFixed(2) || (1 / offer.offer.height).toFixed(2),
                    })
                } else {
                    if (offer.offer.profileType.includes("30")) {
                        profileType = 30;
                    }

                    if (offer.offer.profileType.includes("50")) {
                        profileType = 50;
                    }

                    if (offer.offer.profileType.includes("60")) {
                        profileType = 60;
                    }

                    if (offer.offer.profileType.includes("75")) {
                        profileType = 75;
                    }

                    if (offer.offer.profileType.includes("100")) {
                        profileType = 100;
                    }
                    if (offer.offer.platingPlates.plate1.includes("12.5")) {
                        nrD += 12.5;
                        nrOfPlates = 1;
                    } else {
                        if (offer.offer.platingPlates.plate1) {
                            nrD += 15;
                            nrOfPlates = 1;
                        }
                    }
                    if (offer.offer.platingPlates.plate2 && offer.offer.platingPlates.plate2.includes("12.5")) {
                        nrD += 12.5;
                        nrOfPlates = 2;
                    } else {
                        if (offer.offer.platingPlates.plate2) {
                            nrD += 15;
                            nrOfPlates = 2;
                        }
                    }

                    if (offer.offer.platingPlates.plate3 && offer.offer.platingPlates.plate3.includes("12.5")) {
                        nrD += 12.5;
                        nrOfPlates = 3;
                    } else {
                        if (offer.offer.platingPlates.plate3) {
                            nrD += 15;
                            nrOfPlates = 3;
                        }
                    }
                    if (offer.offer.platingPlates.plate4 && offer.offer.platingPlates.plate4.includes("12.5")) {
                        nrD += 12.5;
                        nrOfPlates = 4;
                    } else {
                        if (offer.offer.platingPlates.plate4) {
                            nrD += 15;
                            nrOfPlates = 4;
                        }
                    }

                    nrD += profileType;
                    let totalWeight = 0, ghidajInf = '', ghidajSup = '', izolatie = '', profilName = '';
                    offer.offer.consumption.forEach(consumption => {
                        if (consumption.codSap && consumption.codSap.includes('cod') === false && consumption.amount !== 0) {
                            totalWeight = totalWeight + parseFloat(parseFloat(consumption.weight) * parseFloat(consumption.amount));
                        }

                        if ((consumption?.productName?.includes('UW') || consumption?.productName?.includes('UD')) && consumption?.productName?.includes('prelungire') === false) {
                            if (consumption?.productName === 'Profil NIDA Metal UW' + profileType || consumption?.productName === 'Profil NIDA Metal UD' + profileType) {
                                ghidajInf = consumption?.productName;
                            } else {
                                ghidajSup = consumption?.productName
                            }
                        }

                        if (consumption?.productName?.includes('Profil NIDA Metal') && consumption?.productName?.includes('UW') === false && consumption?.productName?.includes('UD') === false) {
                            profilName = consumption?.productName;
                        }

                        if ((consumption?.productName?.includes('UD')) && profilName.includes('CD')) {
                            ghidajInf = consumption?.productName;
                        }

                        if (consumption?.productName?.includes('Mineral')) {
                            izolatie = consumption?.productName;
                        }
                    })
                    let fResistance = offer.offer.fireResistance;
                    if (offer.offer.fireResistance.includes('minutes')) {
                        fResistance = offer.offer.fireResistance.slice(0, -8) + ' ' + t('minute')
                    } else {
                        if (offer.offer.fireResistance.includes('m') === true) {
                            fResistance = offer.offer.fireResistance.slice(0, -1) + ' ' + t('minute')
                        }
                    }
                    let rezUmid = t('unspecified');
                    switch (offer.offer.moistureResistance) {
                        case '1':
                            rezUmid = t('face') + ' A';
                            break;
                        case '1e':
                            rezUmid = t('face') + ' A ' + t('exterior');
                            break;
                        case '2':
                            rezUmid = t('face') + ' A si ' + t('face') + ' B';
                            break;
                        case '2e':
                            rezUmid = t('face') + ' A ' + t('exterior') + ' ' + t('and') + ' ' + t('face') + ' B ' + t('exterior');
                            break;
                    }
                    // plates
                    let arrayOfPlates = [offer?.offer?.platingPlates?.plate1];
                    if (offer?.offer?.platingPlates?.plate2?.length > 0) {
                        arrayOfPlates.push(offer.offer.platingPlates.plate2);
                    }
                    if (offer?.offer?.platingPlates?.plate3?.length > 0) {
                        arrayOfPlates.push(offer.offer.platingPlates.plate3);
                    }
                    if (offer?.offer?.platingPlates?.plate4?.length > 0) {
                        arrayOfPlates.push(offer.offer.platingPlates.plate4);
                    }
                    let stringOfPlates = '';
                    let counts = {};
                    arrayOfPlates.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
                    for (const [key, value] of Object.entries(counts)) {
                        stringOfPlates += `${value}x ${key}, `;
                    }
                    stringOfPlates = stringOfPlates.slice(0, -2);
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('fire_resistance'),
                        valori: offer.offer.fireResistance === '0' || offer.offer.fireResistance === '0m' ? t("unspecified") : "El = " + fResistance
                    });

                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('moisture_resistance'), valori: rezUmid });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('sound_proof'),
                        valori: "Rw = " + offer.offer.izolareAcustica + ' dB'
                    });
                    if (offer.offer?.interaxSustineri) {
                        let inter = '';
                        if (offer.offer.interaxSustineri === '250') {
                            inter = `250/${t('vinclu')}`;
                        }
                        if (offer.offer.interaxSustineri === '125') {
                            inter = `'125/${t('bride')}'`;
                        }
                        if (offer.offer.interaxSustineri === '0' || offer.offer.interaxSustineri === '1') {
                            inter = t('Fara') + ' ';
                        }
                        allCaracteristiciTehnice.push({
                            caracteristiciTehnici: t('interaxSustineri'),
                            valori: inter,
                        });
                    }

                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('height'),
                        valori: "max " + offer.offer.height + ' m'
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('sistem_weight'),
                        valori: totalWeight.toFixed(0) + ' Kg/mp'
                    });
                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('thickness'), valori: offer.offer.interaxSustineri === '125' ? nrD - profileType + 30 + ' mm' : nrD + ' mm' });
                    allCaracteristiciTehnice.push({

                        caracteristiciTehnici: t('beam_type'),
                        valori: profilName ? profilName + ' @  ' + offer.offer.interax : t('unspecified'),
                    });
                    allCaracteristiciTehnice.push({ caracteristiciTehnici: t('lower_guiding'), valori: ghidajInf || t('unspecified') });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('upper_guiding'),
                        valori: ghidajSup || ghidajInf || t('unspecified')
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('plating_types'),
                        valori: stringOfPlates
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('upper_support'),
                        valori: t(offer.offer.support)
                    });
                    allCaracteristiciTehnice.push({
                        caracteristiciTehnici: t('wool_type'),
                        valori: izolatie || t('unspecified')
                    });

                    this.setState({
                        caractTehnici: allCaracteristiciTehnice,
                        systemType: 'Placari' + nrOfPlates,
                        surface: offer.offer.surface.toFixed(2),
                        excelName: excelNameBefore || offer.offer.excelName,
                        jointLength: offer?.offer?.jointLength?.toFixed(2) || (1 / offer.offer.height).toFixed(2),
                    })
                }
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._changeColumns)
    }

    _changeColumns = () => {
        if (window.innerWidth <= 1250) {
            this.setState({
                deactivateColumns: true,
                tableHeaders: this.tableHeaders2
            })
        }
    }

    _changeConsumption = (offer, type, surfaceValue, jointValue) => {
        let surface;
        const { t } = this.props;
        if (type === 'interior' && surfaceValue < 1) {
            surface = 1.00;
        } else if (type === 'interior') {
            surface = surfaceValue;
        }
        if (type === 'exterior' && jointValue < 1) {
            surface = 1.00;
        } else if (type === 'exterior') {
            surface = jointValue;
        }

        let consumptions = [],
            consumptionList = type === 'interior' ? offer.offer?.consumption : offer.offer?.consumptionExterior,
            totalPrice = 0, totalWeight = 0;
        if (consumptionList) {

            let index = 0;
            let surfaceParsed = parseFloat(surface);
            consumptionList?.forEach(consumption => {
                console.log(consumption)
                if (consumption?.codSap && consumption?.codSap?.includes('cod') === false && consumption?.amount !== 0) {
                    index++;
                    consumptions.push({
                        nr: index,
                        sap: consumption.codSap,
                        productName: consumption.productName,
                        amount: consumption.amount.toFixed(2),
                        amountSurface: (consumption.amount * surfaceParsed).toFixed(2),
                        unitPrice: consumption.price.toFixed(2),
                        price: roundNumber(consumption.amount * consumption.price).toFixed(2),
                        priceSurface: (roundNumber(consumption.amount * consumption.price) * surfaceParsed).toFixed(2),
                        weight: consumption.weight,
                        totalWeight: consumption.weight * consumption.amount,
                    });
                    totalPrice = totalPrice + roundNumber(parseFloat((consumption.amount * consumption.price)));
                    totalWeight = totalWeight + parseFloat((consumption.weight * consumption.amount));
                }
            });

            consumptions.push({
                sap: "-",
                productName: "-",
                amount: "-",
                amountSurface: "-",
                unitPrice: "Total",
                price: totalPrice.toFixed(2) + ' ' + t('RON'),
                priceSurface: (totalPrice * surfaceParsed).toFixed(2) + ' ' + t('RON'),
            })
        }
        return consumptions?.map(cons => {
            return ({
                ...cons,
                specificTableCellClassName: [{
                    id: "price",
                    className: "offer-list-number-cell"
                }, {
                    id: "productName",
                    className: "offer-list-name-cell"
                }, {
                    id: "amount",
                    className: "offer-list-number-cell"
                }, {
                    id: "amountSurface",
                    className: "offer-list-number-cell"
                }, {
                    id: "unitPrice",
                    className: "offer-list-number-cell"
                }, {
                    id: "priceSurface",
                    className: "offer-list-number-cell"
                }],
            })
        });
    }

    _makeStructure = (face) => {
        if (face.plate4) {
            return {
                plate1: face.plate1,
                plate2: face.plate2,
                plate3: face.plate3,
                plate4: face.plate4,
            }
        }
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

    _onClick = (newSession) => {
        const { dispatch, match, offer } = this.props;
        const { surface, jointLength, excelName } = this.state;

        let data;
        let offerId = match.params.offerId || match.params.offerDetailsId;

        if (offer.offer.plate && offer.offer.plate.face2 && offer.offer.plate.face2.plate1) {

            let face1Structure = this._makeStructure(offer.offer.plate.face1);
            let face2Structure = this._makeStructure(offer.offer.plate.face2);

            data = {
                // _id: match.params.id,
                status: 'saved',
                savedOfferId: offerId,
                ceilingSupport: offer.offer.ceilingSupport || '-',
                profileType: offer.offer.profileType,
                protectionSense: offer?.offer?.protectionSense || '-',
                thicknessSystem: offer.offer.thicknessSystem?.toString(),
                thickness: offer.offer.thickness?.toString(),
                intermediatePlate: offer.offer.intermediatePlate?.toString(),
                fireResistance: offer.offer.fireResistance.includes('m') ? offer.offer.fireResistance : offer.offer.fireResistance + 'm',
                moistureResistance: offer.offer.moistureResistance,
                burglaryResistance: offer.offer.burglaryResistance || '',
                soundInsulation: offer.offer.soundInsulation,
                interaxSustineri: offer.offer.interaxSustineri,
                height: offer.offer.height,
                systemCode: offer.offer.systemCode,
                systemCodeTable: offer.offer.systemCodeTable,
                support: offer.offer.support || '-',
                finishing: offer.offer.finishing,
                interax: offer.offer.interax,
                price: (offer.offer.price / offer.offer.surface * surface).toFixed(2),
                izolareAcustica: offer.offer.izolareAcustica,
                consumption: offer.offer.consumption,
                consumptionExterior: offer.offer.consumptionExterior,
                face1: face1Structure,
                face2: face2Structure,
                initialFace1: offer.offer.initialPlate.face1,
                initialFace2: offer.offer.initialPlate.face2,
                systemName: offer.offer.systemName,
                surface: surface * 1,
                jointLength: jointLength * 1,
                excelName: excelName?.replaceAll(' ', '_'),
            }
        } else {
            data = {
                // _id: match.params.id,
                status: 'saved',
                savedOfferId: offerId,
                profileType: offer.offer.profileType,
                protectionSense: offer?.offer?.protectionSense || '-',
                thicknessSystem: offer.offer.systemName.includes("Lipire") ? "12.5" : offer.offer.thicknessSystem?.toString(),
                thickness: offer.offer.thickness?.toString(),
                fireResistance: offer.offer.fireResistance.includes('m') ? offer.offer.fireResistance : offer.offer.fireResistance + 'm',
                moistureResistance: offer.offer.moistureResistance,
                burglaryResistance: offer.offer.burglaryResistance || '',
                interaxSustineri: offer.offer.interaxSustineri,
                soundInsulation: offer.offer.soundInsulation,
                height: offer.offer.height,
                support: offer.offer.support,
                finishing: offer.offer.finishing,
                interax: offer.offer.interax,
                systemCode: offer.offer.systemCode,
                systemCodeTable: offer.offer.systemCodeTable,
                price: (offer.offer.price / offer.offer.surface * surface).toFixed(2),
                izolareAcustica: offer.offer.izolareAcustica,
                consumption: offer.offer.consumption,
                consumptionExterior: offer.offer.consumptionExterior,
                platingPlates: offer.offer.platingPlates,
                platingInitialPlates: offer.offer.platingInitialPlates,
                systemName: offer.offer.systemName,
                surface: surface * 1,
                jointLength: jointLength * 1,
                excelName: excelName?.replaceAll(' ', '_'),
            }
        }

        this._getSessionOffer(data);
        dispatch(updateSavedOffer(offerId, data, newSession === true ? null : this._onClickCallback));

    }

    _getSessionOffer = (data) => {
        const { session, match, dispatch } = this.props;
        const { isEditSession, sessionId, isCreateNewOffer } = this.state;
        let thisSession = [];
        let ok = 0;
        session?.session?.session.map(item => {
            if (item._id === match.params.offerId || item._id === match.params.offerDetailsId) {
                thisSession.push({ ...data, _id: item._id, createdAt: item.createdAt })
                ok = 1;
            }
            else {
                thisSession.push({
                    createdAt: item.createdAt,
                    _id: item._id,
                    status: 'saved',
                    savedOfferId: match.params.offerId,
                    profileType: item.profileType,
                    ceilingSupport: item.ceilingSupport,
                    protectionSense: item.protectionSense,
                    thicknessSystem: item.thicknessSystem,
                    fireResistance: item.fireResistance,
                    moistureResistance: item.moistureResistance,
                    burglaryResistance: item.burglaryResistance,
                    soundInsulation: item.soundInsulation,
                    height: item.height,
                    systemCode: item.systemCode,
                    systemCodeTable: item.systemCodeTable,
                    support: item.support,
                    finishing: item.finishing,
                    interaxSustineri: item.interaxSustineri,
                    interax: item.interax,
                    price: item.price,
                    izolareAcustica: item.izolareAcustica,
                    consumption: item.consumption,
                    consumptionExterior: item.consumptionExterior,
                    face1: item?.plate?.face1 ? this._makeStructure(item.plate.face1) : [],
                    face2: item?.plate?.face2 ? this._makeStructure(item.plate.face2) : [],
                    initialFace1: item?.initialPlate.face1,
                    initialFace2: item?.initialPlate.face2,
                    platingPlates: item?.platingPlates,
                    platingInitialPlates: item?.platingInitialPlates,
                    systemName: item.systemName,
                    surface: item.surface,
                    jointLength: item.jointLength,
                    excelName: item.excelName?.replaceAll(' ', '_'),
                });
            }
        })
        if (ok === 0 && (isEditSession || isCreateNewOffer)) {
            thisSession.push({ ...data, createdAt: new Date() });
        }

        dispatch(updateOffersSession(thisSession, isCreateNewOffer ? sessionId : match.params.id));
    }

    _onClickCallback = () => {
        const { match } = this.props;
        const { isEditSession, isCreateNewOffer, sessionId } = this.state;
        window.location.href =  isCreateNewOffer ? `/private/sessions/session/edit/${sessionId}/offers` :
                                isEditSession ? `/private/sessions/session/edit/${match.params.id}/offers` : `/private/sessions/session/${match.params.id}/offers`;
    }

    _handleSurfaceChange = (e) => {
        const { offer } = this.props;
        if (e.target.value < 1) {
            this.setState({
                surface: e.target.value,
                jointLength: (1 / offer.offer.height * e.target.value).toFixed(2),
                helperText: 'Invalid format',
                error: true
            });
        } else {
            this.setState({
                surface: e.target.value,
                jointLength: (1 / offer.offer.height * e.target.value).toFixed(2),
                helperText: '',
                error: false
            });
        }
    }

    _handleJointLengthChange = (e) => {
        if (e.target.value < 1) {
            this.setState({
                jointLength: e.target.value,
                helperText: 'Invalid format',
                error: true
            });
        } else {
            this.setState({
                jointLength: e.target.value,
                helperText: '',
                error: false
            });
        }
    }

    _handleExcelNameChange = (e) => {
        this.setState({ excelName: e.target.value });
    }

    _onClickBack = () => {
        const { parentMatch } = this.props;
        const { isEditSession, isNewOfferEditSession, isEdit } = this.state;
        window.location.href = isNewOfferEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers` :
                               isEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers` :
                               isEdit ? `/private/sessions/session/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers`
                               : `/private/sessions/session/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers`
    }

    _onClickSaveNewOffer = () => () => {
        const { openModal } = this.state;
        this.setState({
            openModal: !openModal
        })
    }

    _changeSessionId = (e) => () => {
        const { offer } = this.props;
        let id;
        offer.sessions.forEach(session => {
            if (session.data.objective.includes(e.target.value) ) {
                id = session._id;
            }
        })
        this.setState({
            sessionId: id
        })
    }

    _onClickConfirm = (newSession) => () => {
        const { dispatch, parentMatch, match } = this.props;
        const { openModal, } = this.state;

        if (newSession === true) {
            dispatch(saveSession((sessionId) => {
                const { history } = this.props;

                this.setState({
                    sessionId: sessionId,
                })

                dispatch(getSession(sessionId, parentMatch.path.indexOf('/view') !== -1, match?.params?.offerDetailsId, () => {
                    this._onClick(newSession)
                    this.setState({
                        openModal: !openModal
                    })
                }));

                history.push(`/private/sessions/session/edit/${sessionId}`);
            }))
        }
        else {
            const { sessionId } = this.state;
            dispatch(getSession(sessionId, parentMatch.path.indexOf('/view') !== -1, match?.params?.offerDetailsId, () => {
                this._onClick()
                this.setState({
                    openModal: !openModal
                })
            }));
        }
    }

    render() {
        const { offer, sessionId, t } = this.props;
        const { caractTehnici, systemType, surface, jointLength, excelName, helperText, error, deactivateColumns, tableHeaders, isCreateNewOffer, openModal } = this.state;
        console.log('caracteristici tehnice',caractTehnici)
        if (offer.fetchingSavedOffer) {
            return (
                <PageLoader />
            );
        }
        else
            return (
                <ThemeProvider theme={createTheme({
                    palette: {
                        primary: {
                            main: colours.purple,
                            light: colours.purple
                        },
                        secondary: {
                            main: colours.purple
                        },
                    },
                })}>
                    <Card className='general-card'>
                        <div className="title-buttons ws-nowrap">
                            <div className="ml-30">
                                <Typography
                                    className="rubrik-font"
                                    variant="h4"
                                    component="h1">
                                    {t('offer_details')}
                                </Typography>
                            </div>
                            <div className="mr-30 buttonsSeparation ml-buttons">
                                {isCreateNewOffer === false ?
                                <BackToOffersButton t={t} onClick={this._onClickCallback} className="no-padding pb-10" />
                                :null}
                                <div className='flex-col full-width margins-boq'>
                                    <TextField
                                        // className="big-boq"
                                        label={t('boq_code')}
                                        type="string"
                                        value={excelName}
                                        onChange={this._handleExcelNameChange}
                                    />
                                    {offer?.offer?.systemName &&
                                        <Typography>
                                            {t('systemType')}: {t(translationsDetails[offer?.offer?.systemName])}
                                        </Typography>
                                    }
                                </div>
                                <SaveOfferButton className="no-padding" disabled={error} t={t} onClick={isCreateNewOffer === false ? this._onClick : this._onClickSaveNewOffer()} />
                            </div>
                        </div>
                        {openModal ?
                            <SessionModal
                                open={ openModal }
                                t={ t }
                                sessionId={ sessionId }
                                session={ offer.sessions }
                                onChange={ this._changeSessionId }
                                onClickConfirm={ this._onClickConfirm }
                                onClickCancel={ this._onClickSaveNewOffer }>
                            </SessionModal>
                            :null}
                        <div className="ml-30 mb-1r">
                            {t('systemCode')}: {offer.offer.systemCodeTable}
                        </div>
                        {/* Caracteristici Tehnice */}
                        {caractTehnici ?
                            <div className='caractImage ml-30 mr-30'>
                                <div>
                                    <TableContainer component={Paper} className='caractTehnici'>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{t('technical_characteristics')}</TableCell>
                                                    <TableCell>{t('value')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {caractTehnici.map((row) => (
                                                    <TableRow key={row.caracteristiciTehnici}>
                                                        <TableCell scope="row">
                                                            {row.caracteristiciTehnici}
                                                        </TableCell>
                                                        <TableCell>{row.valori}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                {/* Aici Poze */}
                                <div className='ml-image mt-image'>
                                    {offer?.offer?.height !== 0 &&
                                        <>
                                            <Offer3DImage
                                                offer={offer.offer}
                                            />
                                            <ExternalLinks
                                                t={ t }
                                                offer={offer.offer}
                                            />
                                        </>
                                    }
                                </div>
                            </div> : null}
                        <div className="pt-5 ml-30 mr-30">
                            <Typography
                                variant="h4"
                                component="h1">
                                {t('consumuri')}
                            </Typography>
                            <Toolbar className='dinosaurs-list-toolbar'>
                                <Grid
                                    className='dinosaurs-list-toolbar-grid'
                                    spacing={2}
                                    container>
                                    <Grid item>
                                        <TextField
                                            label={`${t('surface')} (mp)`}
                                            type="number"
                                            value={surface}
                                            onChange={this._handleSurfaceChange}
                                            helperText={helperText}
                                            error={error}
                                            onBlur={() => {
                                                this.setState((prevState) => ({
                                                    surface: parseFloat(prevState.surface).toFixed(2).replace(/,/g, '.'),
                                                }))
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Toolbar>
                            <div className='compact-toggle-details items-center mb-16'>
                                <span className="margin-5">
                                    {t('less_table_cols')}
                                </span>
                                <CustomSwitch
                                    color='default'
                                    className='toggle-style'
                                    checked={deactivateColumns}
                                    onClick={this._deactivateColumns()}
                                >
                                </CustomSwitch>
                            </div>
                            <CustomTable
                                t={t}
                                hidePaginaton
                                WrapperComponent={Card}
                                defaultOrderBy='species'
                                tableHeaders={tableHeaders}
                                data={this._changeConsumption(offer, 'interior', surface, jointLength)}
                            />
                        </div>
                        {((systemType && systemType.includes('Pereti') && offer.offer?.fireResistance !== "0 minutes" && offer.offer?.fireResistance !== "0m" && (offer.offer?.height > 5 || (offer.offer?.height <= 5 && offer.offer?.support.includes('Tabla'))))
                            || offer.offer?.consumptionExterior?.length > 3) ?
                            <div className="pt-5 ml-30 mr-30">
                                <Typography
                                    variant="h4"
                                    component="h1">
                                    {t('prindere_superioara')}
                                </Typography>
                                <Toolbar className='dinosaurs-list-toolbar'>
                                    <Grid
                                        className='dinosaurs-list-toolbar-grid'
                                        spacing={2}
                                        container>
                                        <Grid item>
                                            <TextField
                                                label={`${t('joint_length')} (m)`}
                                                type="number"
                                                value={jointLength}
                                                onChange={this._handleJointLengthChange}
                                                helperText={helperText}
                                                onBlur={() => {
                                                    this.setState((prevState) => ({
                                                        jointLength: parseFloat(prevState.jointLength).toFixed(2).replace(/,/g, '.')
                                                    }))
                                                }}
                                                error={error}
                                            />
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                                <CustomTable
                                    t={t}
                                    hidePaginaton
                                    WrapperComponent={Card}
                                    defaultOrderBy='species'
                                    tableHeaders={tableHeaders}
                                    data={this._changeConsumption(offer, 'exterior', surface, jointLength)}
                                />
                            </div>
                            : null}
                    </Card>
                </ThemeProvider>
            );
    }
}

const mapStateToProps = store => ({
    offer: store.offer,
    session: store.session,
});

export default withTranslation()(connect(mapStateToProps)(OffersDetails));
