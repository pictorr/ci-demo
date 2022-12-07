import cloneDeep from 'lodash/cloneDeep';

export default function importsReducer(state = cloneDeep(defaultState), action) {
    let newState = cloneDeep(state);
    switch(action.type) {
        case 'GET_ALLOWED_PLATES': {
            newState.fetchingAllowedPlates = true;
            newState.fetchingAllowedPlatesError = '';
            return newState;
        }
        case 'GET_ALLOWED_PLATES_FULFILLED': {
            newState.fetchingAllowedPlates = false;
            newState.allowedPlates = action.payload.allowedPlates;
            return newState;
        }
        case 'GET_ALLOWED_PLATES_REJECTED': {
            newState.fetchingAllowedPlates = false;
            newState.fetchingAllowedPlatesError = action.payload.error;
            return newState;
        }

        case 'GET_SYSTEMS_INFO': {
            newState.fetchingInfo = false;
            newState.fetchingInfoError = '';
            return newState;
        }
        case 'GET_SYSTEMS_INFO_FULFILLED': {
            newState.fetchingInfo = true;
            newState.systemsInformation = action.payload.systemsInformation;
            return newState;
        }
        case 'GET_SYSTEMS_INFO_REJECTED': {
            newState.fetchingInfo = true;
            newState.fetchingInfoError = action.payload.error;
            return newState;
        }

        case 'GET_IMPORTED_SYSTEMS': {
            newState.fetchingImportedSystems = true;
            newState.fetchingImportedSystemsError = '';
            return newState;
        }
        case 'GET_IMPORTED_SYSTEMS_FULFILLED': {
            newState.fetchingImportedSystems = false;
            newState.importedSystems = action.payload.importedSystems;
            return newState;
        }
        case 'GET_IMPORTED_SYSTEMS_REJECTED': {
            newState.fetchingImportedSystems = false;
            newState.fetchingImportedSystemsError = action.payload.error;
            return newState;
        }

        case 'GET_IMPORTED_THICKNESSES': {
            newState.fetchingimportedThicknesses = true;
            newState.fetchingimportedThicknessesError = '';
            return newState;
        }
        case 'GET_IMPORTED_THICKNESSES_FULFILLED': {
            newState.fetchingimportedThicknesses = false;
            newState.importedThicknesses = action.payload.importedThicknesses;
            return newState;
        }
        case 'GET_IMPORTED_THICKNESSES_REJECTED': {
            newState.fetchingimportedThicknesses = false;
            newState.fetchingimportedThicknessesError = action.payload.error;
            return newState;
        }

        case 'GET_IMPORTED_SOUND_INSULATION_VALUES': {
            newState.fetchingSoundInsulationValues = true;
            newState.fetchingSoundInsulationValuesError = '';
            return newState;
        }
        case 'GET_IMPORTED_SOUND_INSULATION_VALUES_FULFILLED': {
            newState.fetchingSoundInsulationValues = false;
            newState.soundInsulationValues = action.payload.soundInsulationValues;
            newState.importedThicknesses = action.payload.importedThicknesses;
            return newState;
        }
        case 'GET_IMPORTED_SOUND_INSULATION_VALUES_REJECTED': {
            newState.fetchingSoundInsulationValues = false;
            newState.fetchingSoundInsulationValuesError = action.payload.error;
            return newState;
        }

        case 'GET_IMPORTED_CONSUMPTIONS': {
            newState.fetchingConsumptions = true;
            newState.fetchingConsumptionsError = '';
            return newState;
        }
        case 'GET_IMPORTED_CONSUMPTIONS_FULFILLED': {
            newState.fetchingConsumptions = false;
            newState.consumptions = action.payload.importedConsumptions;
            return newState;
        }
        case 'GET_IMPORTED_CONSUMPTIONS_REJECTED': {
            newState.fetchingConsumptions = false;
            newState.fetchingConsumptionsError = action.payload.error;
            return newState;
        }

        case 'GET_PRODUCTS': {
            newState.fetchingProducts = true;
            newState.fetchingProductsError = '';
            return newState;
        }
        case 'GET_PRODUCTS_FULFILLED': {
            newState.fetchingProducts = false;
            newState.products = action.payload.products;
            return newState;
        }
        case 'GET_PRODUCTS_REJECTED': {
            newState.fetchingProducts = false;
            newState.fetchingProductsError = action.payload.error;
            return newState;
        }

        case 'GET_UPLOADS': {
            newState.fetchingUploads = true;
            newState.fetchingUploadsError = '';
            return newState;
        }
        case 'GET_UPLOADS_FULFILLED': {
            newState.fetchingUploads = false;
            newState.uploads = action.payload.uploads;
            return newState;
        }
        case 'GET_UPLOADS_REJECTED': {
            newState.fetchingUploads = false;
            newState.fetchingUploadsError = action.payload.error;
            return newState;
        }

        case 'IMPORT_FILE': {
            newState.importingFile = true;
            newState.importingFileError = '';
            return newState;
        }
        case 'IMPORT_FILE_FULFILLED': {
            newState.importingFile = false;
            newState.importedFile = true;
            return newState;
        }
        case 'IMPORT_FILE_REJECTED': {
            newState.importingFile = false;
            newState.importingFileError = action.payload.error;
            return newState;
        }
        case 'RESET_EVERYTHING': {
            return {
                ...defaultState
            };
        }
        default:
            return newState;
    }
}

const defaultState = {
    fetchingImportedSystems: true,
    fetchingImportedSystemsError: '',
    fetchingAllowedPlates: true,
    fetchingAllowedPlatesError: '',
    allowedPlates: [],
    importedSystems: [],
    importingFile: false,
    importedFile: false,
    importingFileError: '',
    fetchingProducts: false,
    fetchingProductsError: '',
    products: [],
    fetchingUploads: false,
    fetchingUploadsError: '',
    uploads: [],
    fetchingConsumptions: false,
    fetchingConsumptionsError: '',
    consumptions: [],
};