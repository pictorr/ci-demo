import {axios, createError, generateFormData, getItemFromStorage} from '../utils/utils';
import {calls} from '../utils/calls';

export const sendConsumptionsData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendConsumptionsData(formData, getItemFromStorage('token')))
            .then(() => {
                    dispatch({ type: 'IMPORT_FILE_FULFILLED' });
            })
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const sendSystemsData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendSystemsData(formData, getItemFromStorage('token')))
            .then(() => {
                dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const sendCeilingData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendCeilingData(formData, getItemFromStorage('token')))
            .then(() => {
                dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const sendSpecialWalls = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendSpecialWalls(formData, getItemFromStorage('token')))
            .then(() => {
                dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const sendPlatingSystemsData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendPlatingSystemsData(formData, getItemFromStorage('token')))
            .then(() => {
                dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const sendDoubleStructuredSystemsData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendDoubleStructuredSystemsData(formData, getItemFromStorage('token')))
            .then(() => {
                dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}


export const sendAllowedPlatesData = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.sendAllowedPlatesData(formData, getItemFromStorage('token')))
            .then(() => {
                    dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

export const getAllowedPlates = () => {
    return dispatch => {
        dispatch({ type: 'GET_ALLOWED_PLATES' });
        return axios(calls.getAllowedPlates(getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_ALLOWED_PLATES_FULFILLED',
                    payload: { allowedPlates: res.data.plates }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_ALLOWED_PLATES_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Saves products from the spreadsheet into the database
 * @param data {Object}
 * @returns {Function}
 */
export const importProducts = data => {
    return dispatch => {
        dispatch({ type: 'IMPORT_FILE' });
        const formData = generateFormData('file', data, 'file', {
            ignoredKeys: ['file']
        });
        axios(calls.importProducts(formData, getItemFromStorage('token')))
            .then(() => {
                    dispatch({ type: 'IMPORT_FILE_FULFILLED' });
                }
            )
            .catch((err) => {
                dispatch({
                    type: 'IMPORT_FILE_REJECTED',
                    payload: { error: createError(err) }
                });
            })
    }
}

/**
 * Getting products from DB
 * @returns {Function}
 */
export const getProducts = () => {
    return dispatch => {
        dispatch({ type: 'GET_PRODUCTS' });
        return axios(calls.getProducts(getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_PRODUCTS_FULFILLED',
                    payload: { products: res.data.products }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_PRODUCTS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

export const getUploads = () => {
    return dispatch => {
        dispatch({ type: 'GET_UPLOADS' });
        return axios(calls.getUploads(getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_UPLOADS_FULFILLED',
                    payload: { uploads: res.data.uploads }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_UPLOADS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

export const getImportedSystems = (systemName) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_SYSTEMS' });
        return axios(calls.getImportedSystems(systemName, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_FULFILLED',
                    payload: { importedSystems: res.data.importedPlates }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

 export const getImportedSpecialWalls = (systemName, structureLink) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_SYSTEMS' });
        return axios(calls.getImportedSpecialWalls(systemName, structureLink, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_FULFILLED',
                    payload: { importedSystems: res.data.importedPlates }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

 export const getAllThicknesses = ({systemName, height}, structureLink) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_THICKNESSES' });
        return axios(calls.getAllThicknesses({systemName, height}, structureLink, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_THICKNESSES_FULFILLED',
                    payload: { importedThicknesses: res.data.importedThicknesses }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_THICKNESSES_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems info from DB
 * @returns {Function}
 */

 export const getSystemsInfo = () => {
    return dispatch => {
        dispatch({ type: 'GET_SYSTEMS_INFO' });
        return axios(calls.getSystemsInfo(getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_SYSTEMS_INFO_FULFILLED',
                    payload: { systemsInformation: res.data.systemsInformation }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_SYSTEMS_INFO_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

 export const getSoundInsulationValues = ({systemName, height}, structureLink, callback) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_SOUND_INSULATION_VALUES' });
        return axios(calls.getSoundInsulationValues({systemName, height}, structureLink, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_SOUND_INSULATION_VALUES_FULFILLED',
                    payload: { soundInsulationValues: res.data.importedValues, importedThicknesses: res.data.importedThicknesses }
                });
                if (callback) {
                    callback();
                }
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_SOUND_INSULATION_VALUES_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

 export const getImportedPlatingSystems = (systemName) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_SYSTEMS' });
        return axios(calls.getImportedPlatingSystems(systemName, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_FULFILLED',
                    payload: { importedSystems: res.data.importedPlates }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported systems from DB
 * @returns {Function}
 */

 export const getImportedNoisyPlatingSystems = (systemName) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_SYSTEMS' });
        return axios(calls.getImportedNoisyPlatingSystems(systemName, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_FULFILLED',
                    payload: { importedSystems: res.data.importedPlates }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_SYSTEMS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};

/**
 * Getting imported consumptions from DB
 * @returns {Function}
 */
export const getImportedConsumptions = (systemName) => {
    return dispatch => {
        dispatch({ type: 'GET_IMPORTED_CONSUMPTIONS' });
        return axios(calls.getImportedConsumptions(systemName, getItemFromStorage('token')))
            .then(res => {
                dispatch({
                    type: 'GET_IMPORTED_CONSUMPTIONS_FULFILLED',
                    payload: { importedConsumptions: res.data.importedConsumptions }
                });
            })
            .catch((err) => {
                dispatch({
                    type: 'GET_IMPORTED_CONSUMPTIONS_REJECTED',
                    payload: { error: createError(err) }
                });
            });
    };
};
