import React, {PureComponent} from 'react';
import {Card} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CustomTable from '../Templates/Table/CustomTable.jsx';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';
import {getOffers, updateOffer} from '../../actions/offerActions.js';
import {getAllowedPlates, getImportedConsumptions, getProducts} from '../../actions/importsActions.js';
import {
  getAllowedPlatesForFilters,
  updatePrices,
  makeOptionsForPlates,
  getItemFromStorage
} from '../../utils/utils.js';
import CustomSelect from '../Templates/CustomSelect.jsx';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CustomSwitch from '../Templates/CustomSwitch.jsx';
import CustomOfferModal from './CustomOfferModals.jsx'

class OffersList extends PureComponent {

  constructor(props) {
    super(props);

    const {t, parentMatch} = props;

    this.tableHeadersPlafoaneMobile = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPeretiMobile = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlacariMobile = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersTripluIntermediar = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face1Plate3', label: t('face1Plate3'), align: 'right'},
      {id: 'intermediatePlate', label: t('intermediate_plate'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersDubluIntermediar = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'intermediatePlate', label: t('intermediate_plate'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneCvadruple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'face2Plate4', label: t('face2Plate4'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneTriple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneDuble = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneSimple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneCvadruple2 = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'face2Plate4', label: t('face2Plate4'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneTriple2 = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneDuble2 = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlafoaneSimple2 = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('ceilings_distance')} (cm)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'ceilingSupport', label: t('ceilings_support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersNoisyTriple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face1Plate3', label: t('face1Plate3'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersNoisyDuble = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersTripluPlacat = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face1Plate3', label: t('face1Plate3'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'face2Plate3', label: t('face2Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersDubluPlacat = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'face2Plate2', label: t('face2Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersSimpluPlacat = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'distance', label: `${t('distance')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: 'face2Plate1', label: t('face2Plate1'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'burglaryResistance', label: t('burglary_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlatingCvadruple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face1Plate3', label: t('face1Plate3'), align: 'right'},
      {id: 'face1Plate4', label: t('face1Plate4'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlatingTriple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'face1Plate3', label: t('face1Plate3'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlatingDuble = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: `face1Plate2`, label: t('face1Plate2'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.tableHeadersPlatingSimple = [
      {id: 'nr', label: t('nr'), align: 'right'},
      {id: 'height', label: `${t('height')} (m)`, align: 'right'},
      {id: 'thickness', label: `${t('thickness_system')} (mm)`, align: 'right'},
      {id: 'face1Plate1', label: t('face1Plate1'), align: 'right'},
      {id: 'profileType', label: t('profile_type'), align: 'right'},
      {id: 'interax', label: t('interax'), align: 'right'},
      {id: 'interaxSustineri', label: t('interaxSustineri'), align: 'right'},
      {id: 'fireResistance', label: `${t('fire_resistance')} (${t('minute')})`, align: 'right'},
      {id: 'moistureResistance', label: t('moisture_resistance'), align: 'right'},
      {id: 'izolareAcustica', label: t('sound_insulation_value'), align: 'right'},
      {id: 'soundInsulation', label: t('sound_insulation'), align: 'right'},
      {id: 'support', label: t('support'), align: 'right'},
      {id: 'surface', label: `${t('surface')} (mp)`, align: 'right'},
      {id: 'price', label: t('price'), align: 'right'},
      {id: 'actions', label: t('actions'), align: 'center'},
    ];

    this.state = {
      isCreateNewOffer: parentMatch.path.indexOf('/create-new-offer') !== -1,
      isEdit: parentMatch.path.indexOf('/edit-offer') !== -1,
      isEditSession: parentMatch.path.indexOf('/session/edit') !== -1 && parentMatch.path.indexOf('/edit-offer') !== -1,
      isNewOfferEditSession: parentMatch.path.indexOf('/session/edit') !== -1 && parentMatch.path.indexOf('/new-offer') !== -1,
      deleteDialogOpen: false,
      offers: [],
      face1Plate1: [],
      face1Plate2: [],
      face1Plate3: [],
      face2Plate1: [],
      face2Plate2: [],
      face2Plate3: [],
      plate1: [],
      plate2: [],
      plate3: [],
      plate4: [],
      initialPlates: [],
      sums: [],
      openCustomSelect: [],
      ok: 0,
      systemName: '',
      deactivateColumns: false,
      openDialog: localStorage.getItem('openModal'),
    };
  }

  _deactivateColumns = () => () => {
    let mobileHeader = null;
    const {deactivateColumns, ok} = this.state;
    if (deactivateColumns === false) {
      if (ok === 1) {
        mobileHeader = this.tableHeadersPeretiMobile;
      } else {
        if (ok === 2) {
          mobileHeader = this.tableHeadersPlacariMobile;
        } else {
          mobileHeader = this.tableHeadersPlafoaneMobile;
        }
      }
    }
    this.setState((prevState) => ({
      deactivateColumns: !prevState.deactivateColumns,
      tableHeaderMobile: mobileHeader
    }))
  }

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
    return res;
  }

  componentDidMount() {
    const {parentMatch, dispatch} = this.props;

    let promises = [
      dispatch(getOffers(parentMatch.params.offerId)),
      dispatch(getAllowedPlates()),
    ]

    return Promise.all(promises).then(() => {
      const {offer} = this.props;

      if (offer.offers[0].plate && offer.offers[0].plate.face2 && offer.offers[0].plate.face2.plate1) {

        let systemName = this._findSystemType(offer.offers[0].systemName);

        if (offer.offers[0].systemName.includes("Noisy")) {
          dispatch(getImportedConsumptions('Noisy ' + systemName));
        } else if (offer.offers[0].systemName.includes("Pereti S")) {
          dispatch(getImportedConsumptions('Separativi ' + systemName));
        } else if (offer.offers[0].systemName.includes("Plafoane")) {
          dispatch(getImportedConsumptions('Plafoane ' + systemName));
        } else if (offer.offers[0].systemName.includes("Pereti S")) {
          dispatch(getImportedConsumptions('Separativi ' + systemName));
        } else {
          dispatch(getImportedConsumptions(systemName));
        }

        dispatch(getProducts('Produse - Pereti'));


        let initialPlatesArray = [], sumsArray = [], openCustomSelectArray = [];
        let face1Plate1Array = [], face1Plate2Array = [], face1Plate3Array = [], face2Plate1Array = [],
          face2Plate2Array = [], face2Plate3Array = [], face2Plate4Array = [], ok2 = false;

        offer.offers.forEach(thisOffer => {
          if (thisOffer.systemName.includes("Plafoane")) {
            if (thisOffer.plate.face1.plate1 && thisOffer.plate.face1.plate2) {
              ok2 = true;
            }
          }
          face1Plate1Array.push(thisOffer.plate.face1.plate1)
          face1Plate2Array.push(thisOffer.plate.face1.plate2)
          face1Plate3Array.push(thisOffer.plate.face1.plate3)
          face2Plate1Array.push(thisOffer.plate.face2.plate1)
          face2Plate2Array.push(thisOffer.plate.face2.plate2)
          face2Plate3Array.push(thisOffer.plate.face2.plate3)
          face2Plate4Array.push(thisOffer.plate.face2.plate4)
          initialPlatesArray.push(thisOffer.initialPlate);
          sumsArray.push(thisOffer.price);
          if (thisOffer.status === 'draftOffer') {
            openCustomSelectArray.push(false);
          } else {
            openCustomSelectArray.push(true);
          }
        })

        this.setState({
          initialPlates: initialPlatesArray,
          face1Plate1: face1Plate1Array,
          face1Plate2: face1Plate2Array,
          face1Plate3: face1Plate3Array,
          face2Plate1: face2Plate1Array,
          face2Plate2: face2Plate2Array,
          face2Plate3: face2Plate3Array,
          face2Plate4: face2Plate4Array,
          sums: sumsArray,
          systemName: systemName,
          ok: offer.offers[0].systemName.includes("Plafoane") ? 3 : 1,
          ok2: ok2,
          openCustomSelect: openCustomSelectArray
        })

      } else {
        let systemNameFunction = "Lipire";
        if (offer.offers[0].platingPlates.plate4) {
          systemNameFunction = 'Cvadruple';
        } else if (offer.offers[0].platingPlates.plate3) {
          systemNameFunction = 'Triple';
        } else if (offer.offers[0].platingPlates.plate2) {
          systemNameFunction = 'Duble';
        } else if (offer.offers[0].platingPlates.plate1) {
          systemNameFunction = 'Simple';
        }

        dispatch(getImportedConsumptions(systemNameFunction));
        dispatch(getProducts('Produse - Placari'));

        let initialPlatesArray = [], sumsArray = [], openCustomSelectArray = [];
        let plate1Array = [], plate2Array = [], plate3Array = [], plate4Array = [];

        offer.offers.forEach(thisOffer => {
          plate1Array.push(thisOffer.platingPlates.plate1)
          plate2Array.push(thisOffer.platingPlates.plate2)
          plate3Array.push(thisOffer.platingPlates.plate3)
          plate4Array.push(thisOffer.platingPlates.plate4)
          initialPlatesArray.push(thisOffer.platingInitialPlates);
          sumsArray.push(thisOffer.price);
          if (thisOffer.status === 'draftOffer') {
            openCustomSelectArray.push(false);
          } else {
            openCustomSelectArray.push(true);
          }
        })

        this.setState({
          initialPlates: initialPlatesArray,
          plate1: plate1Array,
          plate2: plate2Array,
          plate3: plate3Array,
          plate4: plate4Array,
          sums: sumsArray,
          systemName: systemNameFunction,
          ok: 2,
          openCustomSelect: openCustomSelectArray
        })

      }
    });
  }

  _makeStructureFace1 = (face, thisOfferId, offerId, field, e, index) => {
    if (face.plate3) {
      return {
        plate1: thisOfferId === offerId ? field === 'face1Plate1' ? e.target.value : this.state.face1Plate1[index] : face.plate1 || '',
        plate2: thisOfferId === offerId ? field === 'face1Plate2' ? e.target.value : this.state.face1Plate2[index] : face.plate2 || '',
        plate3: thisOfferId === offerId ? field === 'face1Plate3' ? e.target.value : this.state.face1Plate3[index] : face.plate3 || ''
      }
    }
    if (face.plate2) {
      return {
        plate1: thisOfferId === offerId ? field === 'face1Plate1' ? e.target.value : this.state.face1Plate1[index] : face.plate1 || '',
        plate2: thisOfferId === offerId ? field === 'face1Plate2' ? e.target.value : this.state.face1Plate2[index] : face.plate2 || '',
      }
    }
    return {
      plate1: thisOfferId === offerId ? field === 'face1Plate1' ? e.target.value : this.state.face1Plate1[index] : face.plate1 || '',
    }
  }

  _makeStructureFace2 = (face, thisOfferId, offerId, field, e, index) => {
    if (face.plate3) {
      return {
        plate1: thisOfferId === offerId ? field === 'face2Plate1' ? e.target.value : this.state.face2Plate1[index] : face.plate1 || '',
        plate2: thisOfferId === offerId ? field === 'face2Plate2' ? e.target.value : this.state.face2Plate2[index] : face.plate2 || '',
        plate3: thisOfferId === offerId ? field === 'face2Plate3' ? e.target.value : this.state.face2Plate3[index] : face.plate3 || ''
      }
    }
    if (face.plate2) {
      return {
        plate1: thisOfferId === offerId ? field === 'face2Plate1' ? e.target.value : this.state.face2Plate1[index] : face.plate1 || '',
        plate2: thisOfferId === offerId ? field === 'face2Plate2' ? e.target.value : this.state.face2Plate2[index] : face.plate2 || '',
      }
    }
    return {
      plate1: thisOfferId === offerId ? field === 'face2Plate1' ? e.target.value : this.state.face2Plate1[index] : face.plate1 || '',
    }
  }

  _onChangePlate = (currentOffers, offer, index, field) => (e) => {
    const {imports, parentMatch, dispatch} = this.props;

    if (field === "face1Plate1") {
      this.setState((prevState) => ({
        face1Plate1: prevState.face1Plate1.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }
    if (field === "face1Plate2") {
      this.setState((prevState) => ({
        face1Plate2: prevState.face1Plate2.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))

    }
    if (field === "face1Plate3") {
      this.setState((prevState) => ({
        face1Plate3: prevState.face1Plate3.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))

    }
    if (field === "face2Plate1") {
      this.setState((prevState) => ({
        face2Plate1: prevState.face2Plate1.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }
    if (field === "face2Plate2") {
      this.setState((prevState) => ({
        face2Plate2: prevState.face2Plate2.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }
    if (field === "face2Plate3") {
      this.setState((prevState) => ({
        face2Plate3: prevState.face2Plate3.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }

    let consumption = updatePrices({
      ...offer,
      plate: {
        face1: {
          plate1: field === 'face1Plate1' ? e.target.value : this.state.face1Plate1[index],
          plate2: field === 'face1Plate2' ? e.target.value : this.state.face1Plate2[index],
          plate3: field === 'face1Plate3' ? e.target.value : this.state.face1Plate3[index],
        },
        face2: {
          plate1: field === 'face2Plate1' ? e.target.value : this.state.face2Plate1[index],
          plate2: field === 'face2Plate2' ? e.target.value : this.state.face2Plate2[index],
          plate3: field === 'face2Plate3' ? e.target.value : this.state.face2Plate3[index],
        }
      }
    }, imports.consumptions, imports.products)

    offer = {
      ...offer,
      consumption: consumption.consumptions,
      consumptionExterior: consumption.consumptionsExterior,
    }

    let sum = 0;

    offer.consumption.forEach(product => {
      if (product.codSap.includes('cod') === false) {
        sum += product?.amount * product?.price;
      }
    })

    this.setState((prevState) => {
      const sums = prevState.sums.map((item, i) => {
        if (i === index) {
          return parseFloat(sum.toFixed(2));
        }
        return item;
      })

      return {sums}
    }, () => {
      currentOffers.forEach(thisOffer => {
        let face1Structure = this._makeStructureFace1(thisOffer.plate.face1, thisOffer._id, offer._id, field, e, index);
        let face2Structure = this._makeStructureFace2(thisOffer.plate.face2, thisOffer._id, offer._id, field, e, index);

        let currentOffer = {
          savedOfferId: parentMatch.params.offerId,
          height: thisOffer.height,
          thicknessSystem: thisOffer.thicknessSystem,
          status: 'draft',
          fireResistance: thisOffer.fireResistance,
          profileType: thisOffer.profileType,
          moistureResistance: thisOffer.moistureResistance,
          burglaryResistance: thisOffer.burglaryResistance,
          soundInsulation: thisOffer.soundInsulation,
          systemCode: thisOffer.systemCode,
          systemCodeTable: thisOffer.systemCodeTable,
          support: thisOffer.support,
          ceilingSupport: thisOffer.ceilingSupport || '',
          systemName: thisOffer.systemName,
          finishing: thisOffer.finishing,
          interax: thisOffer.interax,
          index: thisOffer.index,
          izolareAcustica: thisOffer.izolareAcustica,
          price: thisOffer._id === offer._id ? sum.toFixed(1) : thisOffer.price,
          consumption: thisOffer._id === offer._id ? consumption.consumptions : thisOffer.consumption,
          consumptionExterior: thisOffer._id === offer._id ? consumption.consumptionsExterior : thisOffer.consumptionExterior,
          face1: face1Structure,
          face2: face2Structure,
          initialFace1: thisOffer.initialPlate.face1,
          initialFace2: thisOffer.initialPlate.face2
        };

        dispatch(updateOffer(thisOffer._id, currentOffer))
      })
    })
  }

  _onChangePlatePlating = (currentOffers, offer, index, field) => (e) => {
    const {imports, parentMatch, dispatch} = this.props;

    if (field === "plate1") {
      this.setState((prevState) => ({
        plate1: prevState.plate1.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }

    if (field === "plate2") {
      this.setState((prevState) => ({
        plate2: prevState.plate2.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }

    if (field === "plate3") {
      this.setState((prevState) => ({
        plate3: prevState.plate3.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }

    if (field === "plate4") {
      this.setState((prevState) => ({
        plate4: prevState.plate4.map((item, i) => {
          if (i === index) {
            return e.target.value
          }
          return item;
        })
      }))
    }

    let consumption = updatePrices({
      ...offer,
      plate: {
        plate1: field === 'plate1' ? e.target.value : this.state.plate1[index],
        plate2: field === 'plate2' ? e.target.value : this.state.plate2[index],
        plate3: field === 'plate3' ? e.target.value : this.state.plate3[index],
        plate4: field === 'plate4' ? e.target.value : this.state.plate4[index],
      }
    }, imports.consumptions, imports.products)

    offer = {
      ...offer,
      consumption: consumption.consumptions,
      consumptionExterior: consumption.consumptionsExterior,
    }

    let sum = 0;

    offer.consumption.forEach(product => {
      if (product.codSap.includes('cod') === false) {
        sum += product?.amount * product?.price;
      }
    })

    this.setState((prevState) => ({
      sums: prevState.sums.map((item, i) => {
        if (i === index) {
          return sum.toFixed(2);
        }
        return item;
      })
    }))

    currentOffers.forEach((thisOffer, index) => {

      let currentOffer = {
        savedOfferId: parentMatch.params.offerId,
        height: thisOffer.height,
        status: 'draft',
        thicknessSystem: thisOffer.thicknessSystem,
        fireResistance: thisOffer.fireResistance,
        profileType: thisOffer.profileType,
        moistureResistance: thisOffer.moistureResistance,
        burglaryResistance: '',
        soundInsulation: thisOffer.soundInsulation,
        systemCode: thisOffer.systemCode,
        systemCodeTable: thisOffer.systemCodeTable,
        support: thisOffer.support,
        systemName: thisOffer.systemName,
        finishing: thisOffer.finishing,
        interax: thisOffer.interax,
        index: thisOffer.index,
        izolareAcustica: thisOffer.izolareAcustica,
        price: thisOffer._id === offer._id ? sum.toFixed(3) : thisOffer.price,
        consumption: thisOffer._id === offer._id ? consumption.consumptions : thisOffer.consumption,
        consumptionExterior: thisOffer._id === offer._id ? consumption.consumptionsExterior : thisOffer.consumptionExterior,
        platingPlates: {
          plate1: thisOffer._id === offer._id && field === 'plate1' ? e.target.value : this.state.plate1[index],
          plate2: thisOffer._id === offer._id && field === 'plate2' ? e.target.value : this.state.plate2[index],
          plate3: thisOffer._id === offer._id && field === 'plate3' ? e.target.value : this.state.plate3[index],
          plate4: thisOffer._id === offer._id && field === 'plate4' ? e.target.value : this.state.plate4[index],
        },
        platingInitialPlates: {
          plate1: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate1 : '',
          plate2: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate2 : '',
          plate3: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate3 : '',
          plate4: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate4 : '',
        },
      };

      dispatch(updateOffer(thisOffer._id, currentOffer))
    })
  }

  _onClickCustomSelect = (index) => () => {
    this.setState((prevState) => ({
      openCustomSelect: prevState.openCustomSelect.map((item, i) => {
        if (i === index) {
          return !item;
        }
        return item;
      })
    }))
  }

  _calculateThicknessPlating = (offer) => {
    let thickness = 0;
    if (offer.platingPlates.plate1 && offer.platingPlates.plate1.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.platingPlates.plate1) {
        thickness += 15;
      }
    }
    if (offer.platingPlates.plate2 && offer.platingPlates.plate2.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.platingPlates.plate2) {
        thickness += 15;
      }
    }

    if (offer.platingPlates.plate3 && offer.platingPlates.plate3.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.platingPlates.plate3) {
        thickness += 15;
      }
    }
    if (offer.platingPlates.plate4 && offer.platingPlates.plate4.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.platingPlates.plate4) {
        thickness += 15;
      }
    }
    if (offer.profileType) {
      thickness += parseFloat(offer.profileType.replace('C', '').replace('W', '').replace('D', '').replace('U', ''));
    }
    return thickness;

  }

  _calculateThicknessWall = (offer) => {
    let thickness = 0, ok = 0, ok2 = 0;
    if (offer.plate.face1.plate1.includes("12.5")) {
      thickness += 12.5;
      ++ok2;
    } else {
      if (offer.plate.face1.plate1) {
        thickness += 15;
        ++ok;
      }
    }
    if (offer.plate.face1.plate2 && offer.plate.face1.plate2.includes("12.5")) {
      thickness += 12.5;
      ++ok2;
    } else {
      if (offer.plate.face1.plate2) {
        thickness += 15;
        ++ok;
      }
    }

    if (offer.plate.face1.plate3 && offer.plate.face1.plate3.includes("12.5")) {
      thickness += 12.5;
      ++ok2;
    } else {
      if (offer.plate.face1.plate3) {
        thickness += 15;
        ++ok;
      }
    }
    if (offer.plate.face2.plate1.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.plate.face2.plate1) {
        thickness += 15;
        ++ok;
      }
    }
    if (offer.plate.face2.plate2 && offer.plate.face2.plate2.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.plate.face2.plate2) {
        thickness += 15;
        ++ok;
      }
    }

    if (offer.plate.face2.plate3 && offer.plate.face2.plate3.includes("12.5")) {
      thickness += 12.5;
    } else {
      if (offer.plate.face2.plate3) {
        thickness += 15;
        ++ok;
      }
    }

    if (offer.systemName.includes("UU")) {
      if (ok > 0) {
        thickness = 15 * ok;
      } else {
        thickness = 12.5 * ok2;
      }
    }

    if (offer.systemName.includes("Noisy") && offer.systemName.includes("UU") === false) {
      const [profileType1, profileType2] = offer.profileType.split('/')
      thickness += parseFloat(profileType1.replace('C', '').replace('W', '').replace('D', '').replace('U', ''));
      thickness += parseFloat(profileType2.replace('C', '').replace('W', '').replace('D', '').replace('U', ''));
      thickness += 10;
    } else {
      thickness += parseFloat(offer.profileType.replace('C', '').replace('W', '').replace('D', '').replace('U', ''));
    }

    return thickness;

  }

  _addData = (offer) => {
    const {t, imports, parentMatch} = this.props;
    const {initialPlates, sums, openCustomSelect, isEdit} = this.state;
    // let sortedOffers = sortArray(offer, 'ASC', 'price');
    offer.map((thisOffer, index) => {
      thisOffer.nr = index + 1;
      thisOffer.support = t(thisOffer.support);
      thisOffer.soundInsulation = t(thisOffer.soundInsulation);
      thisOffer.ceilingSupport = t(thisOffer.ceilingSupport);
      thisOffer.thickness = thisOffer.thickness ? thisOffer.thickness : this._calculateThicknessWall(thisOffer);
      thisOffer.distance = thisOffer.distance ? thisOffer.distance : 0;
      thisOffer.surface = parseFloat(thisOffer.surface).toFixed(2);
      thisOffer.fireResistance = thisOffer.fireResistance.replace('m', '');
      thisOffer.face1Plate1 = initialPlates[index].face1.plate1 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face1Plate1[index]}
            name={"face1Plate1"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face1Plate1")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face1.plate1 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index].face1.plate1, imports.allowedPlates)) : []}
          /> : this.state.face1Plate1[index]
        : null;
      thisOffer.face1Plate2 = initialPlates[index]?.face1.plate2 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face1Plate2[index]}
            name={"face1Plate2"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face1Plate2")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face1.plate2 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face1.plate2, imports.allowedPlates)) : []}
          /> : this.state.face1Plate2[index]
        : null;
      thisOffer.face1Plate3 = initialPlates[index]?.face1.plate3 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face1Plate3[index]}
            name={"face1Plate3"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face1Plate3")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face1.plate3 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face1.plate3, imports.allowedPlates)) : []}
          /> : this.state.face1Plate3[index]
        : null;
      thisOffer.face2Plate1 = initialPlates[index]?.face2.plate1 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face2Plate1[index]}
            name={"face2Plate1"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face2Plate1")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face2.plate1 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face2.plate1, imports.allowedPlates)) : []}
          /> : this.state.face2Plate1[index]
        : null;
      thisOffer.face2Plate2 = initialPlates[index]?.face2.plate2 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face2Plate2[index]}
            name={"face2Plate2"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face2Plate2")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face2.plate2 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face2.plate2, imports.allowedPlates)) : []}
          /> : this.state.face2Plate2[index]
        : null;
      thisOffer.face2Plate3 = initialPlates[index]?.face2.plate3 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face2Plate3[index]}
            name={"face2Plate3"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face2Plate3")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face2.plate3 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face2.plate3, imports.allowedPlates)) : []}
          /> : this.state.face2Plate3[index]
        : null;
      thisOffer.face2Plate4 = initialPlates[index]?.face2.plate4 ? this.state.openCustomSelect[index] === false ?
          <CustomSelect
            value={this.state.face2Plate4[index]}
            name={"face2Plate4"}
            className='big-cell offer-list-number-cell-edit'
            onChange={this._onChangePlate(offer, thisOffer, index, "face2Plate4")}
            readOnly={this.state.openCustomSelect[index]}
            options={initialPlates[index]?.face2.plate4 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index]?.face2.plate4, imports.allowedPlates)) : []}
          /> : this.state.face2Plate4[index]
        : null;
      if (thisOffer.price && sums[index] !== undefined) {
        thisOffer.price = parseFloat(sums[index]).toFixed(2);
      }
    });
    const {isEditSession, isNewOfferEditSession, isCreateNewOffer, deactivateColumns} = this.state;

    let hasAccess = false;
    if (getItemFromStorage('isAdmin') === 'true' || getItemFromStorage('isMasterAdmin') === 'true') {
      hasAccess = true;
    }

    return offer.map((thisOffer, index) => {
      return ({
        ...thisOffer,
        openCell: !this.state.openCustomSelect[index],
        specificTableCellClassName: [{
          id: "price",
          className: "offer-list-number-cell"
        }, {
          id: "nr",
          className: "offer-list-number-cell"
        }, {
          id: "intermediatePlate",
          className: "offer-list-number-cell"
        }, {
          id: "height",
          className: "offer-list-number-cell"
        }, {
          id: "ceilingSupport",
          className: "offer-list-number-cell"
        }, {
          id: "surface",
          className: "offer-list-number-cell"
        }, {
          id: "thickness",
          className: "offer-list-number-cell"
        }, {
          id: "distance",
          className: "offer-list-number-cell"
        }, {
          id: "profileType",
          className: "offer-list-number-cell"
        }, {
          id: "interax",
          className: "offer-list-number-cell"
        }, {
          id: "interaxSustineri",
          className: "offer-list-number-cell"
        }, {
          id: "fireResistance",
          className: "offer-list-number-cell"
        }, {
          id: "izolareAcustica",
          className: "offer-list-number-cell"
        }, {
          id: "moistureResistance",
          className: "offer-list-number-cell"
        }, {
          id: "burglaryResistance",
          className: "offer-list-number-cell"
        }, {
          id: "support",
          className: "offer-list-number-cell"
        }, {
          id: "soundInsulation",
          className: "offer-list-number-cell"
        }, {
          id: "face1Plate1",
          className: "big-cell-normal"
        }, {
          id: "face1Plate2",
          className: "big-cell-normal"
        }, {
          id: "face1Plate3",
          className: "big-cell-normal"
        }, {
          id: "face2Plate1",
          className: "big-cell-normal"
        }, {
          id: "face2Plate2",
          className: "big-cell-normal"
        }, {
          id: "face2Plate3",
          className: "big-cell-normal"
        }, {
          id: "face2Plate4",
          className: "big-cell-normal"
        }],
        actions: (
          <div className='dinosaurs-list-actions'>
            {thisOffer.systemName.includes("Plafoane") === false && deactivateColumns === false && hasAccess === true ?
              openCustomSelect[index] ?
                <GeneralButton
                  title={t('edit_offer_plates')}
                  className='dinosaurs-list-action-button'
                  onClick={this._onClickCustomSelect(index)}>
                  <EditIcon className='dinosaurs-list-action-button-icon'/>
                </GeneralButton>
                : <GeneralButton
                  title={t('finish_edit_plates')}
                  className='dinosaurs-list-action-button'
                  onClick={this._onClickCustomSelect(index)}>
                  <SaveIcon className='dinosaurs-list-action-button-icon'/>
                </GeneralButton>
              : null
            }
            <GeneralButton
              className='dinosaurs-list-action-button edit'
              title={t('offer_details')}
              href={isCreateNewOffer ? `/private/create-new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                isNewOfferEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                  isEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                    isEdit ? `/private/sessions/session/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details`
                      : `/private/sessions/session/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details`}>
              <VisibilityIcon className='dinosaurs-list-action-button-icon'/>
            </GeneralButton>
            {thisOffer.status === 'draftOffer' ?
              <GeneralButton
                className='dinosaurs-list-action-button edit'
                title={t('back_to_create_offer')}
                href={`/private/sessions/session/edit/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}`}>
                <KeyboardBackspaceIcon className='dinosaurs-list-action-button-icon'/>
              </GeneralButton> : null
            }
          </div>
        )
      })
    })
  }

  _addDataPlating = (offer) => {
    const {t, imports, parentMatch} = this.props;
    const {initialPlates, sums} = this.state;

    offer.map((thisOffer, index) => {
      thisOffer.nr = index + 1;
      thisOffer.support = t(thisOffer.support)
      thisOffer.thickness = thisOffer.thicknessSystem ? thisOffer.thicknessSystem : this._calculateThicknessPlating(thisOffer);
      thisOffer.soundInsulation = t(thisOffer.soundInsulation);
      thisOffer.fireResistance = thisOffer.fireResistance.replace('m', '');
      thisOffer.face1Plate1 = initialPlates[index].plate1 ? this.state.openCustomSelect[index] === false ? <CustomSelect
          value={this.state.plate1[index]}
          name={"plate1"}
          className='big-cell offer-list-number-cell-edit'
          onChange={this._onChangePlatePlating(offer, thisOffer, index, "plate1")}
          readOnly={this.state.openCustomSelect[index]}
          options={initialPlates[index].plate1 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index].plate1, imports.allowedPlates)) : []}
        /> : this.state.plate1[index]
        : null;
      thisOffer.face1Plate2 = initialPlates[index].plate2 ? this.state.openCustomSelect[index] === false ? <CustomSelect
          value={this.state.plate2[index]}
          name={"plate2"}
          className='big-cell offer-list-number-cell-edit'
          onChange={this._onChangePlatePlating(offer, thisOffer, index, "plate2")}
          readOnly={this.state.openCustomSelect[index]}
          options={initialPlates[index].plate2 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index].plate2, imports.allowedPlates)) : []}
        /> : this.state.plate2[index]
        : null;
      thisOffer.face1Plate3 = initialPlates[index].plate3 ? this.state.openCustomSelect[index] === false ? <CustomSelect
          value={this.state.plate3[index]}
          name={"plate3"}
          className='big-cell offer-list-number-cell-edit'
          onChange={this._onChangePlatePlating(offer, thisOffer, index, "plate3")}
          readOnly={this.state.openCustomSelect[index]}
          options={initialPlates[index].plate3 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index].plate3, imports.allowedPlates)) : []}
        /> : this.state.plate3[index]
        : null
      thisOffer.face1Plate4 = initialPlates[index].plate4 ? this.state.openCustomSelect[index] === false ? <CustomSelect
          value={this.state.plate4[index]}
          name={"plate4"}
          className='big-cell offer-list-number-cell-edit'
          onChange={this._onChangePlatePlating(offer, thisOffer, index, "plate4")}
          readOnly={this.state.openCustomSelect[index]}
          options={initialPlates[index].plate4 ? makeOptionsForPlates(getAllowedPlatesForFilters(imports.products, thisOffer.fireResistance, initialPlates[index].plate4, imports.allowedPlates)) : []}
        /> : this.state.plate4[index]
        : null;

      if (thisOffer.price && sums[index] !== undefined) {
        thisOffer.price = sums[index];
      }
    });

    const {isEditSession, isNewOfferEditSession, isCreateNewOffer, isEdit} = this.state;

    return offer.map((thisOffer, index) => {
      return ({
        ...thisOffer,
        specificTableCellClassName: [{
          id: "price",
          className: "offer-list-number-cell"
        }, {
          id: "height",
          className: "offer-list-number-cell"
        }, {
          id: "thickness",
          className: "offer-list-number-cell"
        }, {
          id: "surface",
          className: "offer-list-number-cell"
        }, {
          id: "profileType",
          className: "offer-list-number-cell"
        }, {
          id: "interax",
          className: "offer-list-number-cell"
        }, {
          id: "interaxSustineri",
          className: "offer-list-number-cell"
        }, {
          id: "fireResistance",
          className: "offer-list-number-cell"
        }, {
          id: "izolareAcustica",
          className: "offer-list-number-cell"
        }, {
          id: "moistureResistance",
          className: "offer-list-number-cell"
        }, {
          id: "support",
          className: "offer-list-number-cell"
        }, {
          id: "soundInsulation",
          className: "offer-list-number-cell"
        }, {
          id: "face1Plate1",
          className: "big-cell-normal"
        }, {
          id: "face1Plate2",
          className: "big-cell-normal"
        }, {
          id: "face1Plate3",
          className: "big-cell-normal"
        }, {
          id: "face1Plate4",
          className: "big-cell-normal"
        }],
        actions: (
          <div className='dinosaurs-list-actions'>
            {this.state.openCustomSelect[index] ?
              <GeneralButton
                title={t('edit_offer_plates')}
                className='dinosaurs-list-action-button'
                onClick={this._onClickCustomSelect(index)}>
                <EditIcon className='dinosaurs-list-action-button-icon'/>
              </GeneralButton>
              : <GeneralButton
                title={t('finish_edit_plates')}
                className='dinosaurs-list-action-button'
                onClick={this._onClickCustomSelect(index)}>
                <SaveIcon className='dinosaurs-list-action-button-icon'/>
              </GeneralButton>}
            <GeneralButton
              className='dinosaurs-list-action-button edit'
              title={t('offer_details')}
              href={isCreateNewOffer ? `/private/create-new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                isNewOfferEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                  isEditSession ? `/private/sessions/session/edit/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details` :
                    isEdit ? `/private/sessions/session/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details`
                      : `/private/sessions/session/${parentMatch.params.id}/offers/new-offer/${parentMatch.params.offerId}/generated-offers/${thisOffer._id}/details`}>
              <VisibilityIcon className='dinosaurs-list-action-button-icon'/>
            </GeneralButton>
            {thisOffer.status === 'draftOffer' ?
              <GeneralButton
                className='dinosaurs-list-action-button edit'
                title={t('back_to_create_offer')}
                href={`/private/sessions/session/edit/${parentMatch.params.id}/offers/edit-offer/${parentMatch.params.offerId}`}>
                <KeyboardBackspaceIcon className='dinosaurs-list-action-button-icon'/>
              </GeneralButton> : null
            }
          </div>
        )
      })
    })
  }

  _closeDialog = (state, checked) => () => {
    this.setState(prevState => ({
      openDialog: state === false || state === true ? state : !prevState.openDialog,
    }), () => {
      const {openDialog} = this.state;
      if (openDialog === false) {
        localStorage.setItem("openModal", !checked);
      }
    });
  };

  render() {
    const {offer, t} = this.props;
    const {ok, ok2, systemName, tableHeaderMobile, deactivateColumns} = this.state;
    console.log(offer.offers)
    return (
      <Card className='general-card'>
        <div style={{marginBottom: "20px"}} className="typography-size-title">
          <Typography
            className="rubrik-font"
            variant="h4"
            component="h1">
            {t('compatible_offers')}
          </Typography>
        </div>
        <div className='compact-toggle items-center mb-16 mr-30'>
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
        {ok !== 0 ?
          ok === 1 ?
            <div className={"overflowX: auto"} className="ml-30 mr-30">
              <CustomTable
                t={t}
                WrapperComponent={Card}
                defaultOrderBy='nr'
                hidePaginaton
                tableHeaders={deactivateColumns ? tableHeaderMobile : systemName === 'Asimetrici' ? this.tableHeadersTripluPlacat : systemName.includes('Intermediar') && systemName.includes('Triplu') ? this.tableHeadersTripluIntermediar : systemName.includes('Intermediar') && systemName.includes('Dublu') ? this.tableHeadersDubluIntermediar : systemName === 'Triplu' ? this.tableHeadersTripluPlacat : systemName === 'Dublu' ? this.tableHeadersDubluPlacat : systemName === 'Simplu' ? this.tableHeadersSimpluPlacat : systemName === 'Triple' ? this.tableHeadersNoisyTriple : systemName === 'Duble' ? this.tableHeadersNoisyDuble : null}
                data={this._addData(offer.offers)}
              />
            </div> :
            ok === 3 ?
              <div className={"overflowX: auto"} className="ml-30 mr-30">
                <CustomTable
                  t={t}
                  WrapperComponent={Card}
                  defaultOrderBy='nr'
                  hidePaginaton
                  tableHeaders={deactivateColumns ? tableHeaderMobile : systemName === 'Cvadruple' && ok2 === false ? this.tableHeadersPlafoaneCvadruple2 : systemName === 'Triple' && ok2 === false ? this.tableHeadersPlafoaneTriple2 : systemName === 'Duble' && ok2 === false ? this.tableHeadersPlafoaneDuble2 : systemName === 'Simple' && ok2 === false ? this.tableHeadersPlafoaneSimple2 :
                    systemName === 'Cvadruple' ? this.tableHeadersPlafoaneCvadruple : systemName === 'Triple' ? this.tableHeadersPlafoaneTriple : systemName === 'Duble' ? this.tableHeadersPlafoaneDuble : systemName === 'Simple' ? this.tableHeadersPlafoaneSimple : null}
                  data={this._addData(offer.offers)}
                />
              </div> :
              <div className={"overflowX: auto"} className="ml-30 mr-30">
                <CustomTable
                  t={t}
                  WrapperComponent={Card}
                  defaultOrderBy='nr'
                  hidePaginaton
                  tableHeaders={deactivateColumns ? tableHeaderMobile : systemName === 'Cvadruple' ? this.tableHeadersPlatingCvadruple : systemName === 'Triple' ? this.tableHeadersPlatingTriple : systemName === 'Duble' ? this.tableHeadersPlatingDuble : this.tableHeadersPlatingSimple}
                  data={this._addDataPlating(offer.offers)}
                />
              </div> : null}
        {this.state.openDialog ?
          <CustomOfferModal
            title={'Offer'}
            description={'Description'}
            closeText={'Ok'}
            open={this.state.openDialog}
            handleDialog={this._closeDialog}
            t={t}/>
          : null}
      </Card>
    );
  }
}

const mapStateToProps = store => ({
  offer: store.offer,
  session: store.session,
  imports: store.imports,
});

export default withTranslation()(connect(mapStateToProps)(OffersList));
