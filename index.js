// import * as axiosLibrary from 'axios';
// import {cloneDeep} from 'lodash';
// import {createTheme, ThemeProvider} from '@material-ui/core/styles';

/**
 * Adds a new key-value in localStorage
 * @param key {String}
 * @param value {String}
 */
export const setItemInStorage = (key, value) => {
	localStorage.setItem(key, value);
};

/**
 * Fetches a value from localStorage
 * @param key {String}
 * @returns {String}
 */
export const getItemFromStorage = key => {
	return localStorage.getItem(key);
};

/**
 * Removes an item from localStorage
 * @param key {String}
 */
export const removeItemFromStorage = key => {
	localStorage.removeItem(key);
};

/**
 * Custom axios instance which, if configured, will apply all over the project.
 * @param call {Object}
 * @returns {Promise}
 */
export const axios = call => {
	return new Promise((resolve, reject) => {
		return axiosLibrary.default(call)
			.then(res => resolve(res.data))
			.catch(err => reject(err));
	});
};

/**
 * Creates an error avoiding app crashes in case of Network Errors
 * @param err {Object}
 * @param customMessage {String}
 * @returns {String}
 */
export const createError = (err, customMessage = null) => {
	let message = 'Something went wrong. Please contact technical support. Code 500';
	if (customMessage) {
		message = customMessage;
	} else if (err && err.response && err.response.data && err.response.data.error) {
		message = err.response.data.error;
	}

	if (err?.message === 'Network Error') {
		message = 'Please check your internet connection.';
	}

	if (process.env.NODE_ENV === 'development') {
	}

	return message;
};

/**
 * Returns a sort function friendly numeral that gives the sorting order for a specific field
 * @param a {Object}
 * @param b {Object}
 * @param orderBy {String} - The "sort by" field
 * @returns {Number}
 */
export const descendingComparator = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
};

/**
 * Reverses the descendingComparator in case sort order should be descending instead of ascending
 * @param order {String}
 * @param orderBy {String}
 * @returns {Function}
 */
export const getComparator = (order, orderBy) => {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

/**
 * Sorts an array
 * @param array {Array}
 * @param comparator {Function}
 * @returns {Array}
 */
export const stableSort = (array, comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
};

/**
 * Used for Templates where variables can come from both props or state
 * This is mainly used with Components that can function without having to be controlled by external props
 * @param field {String}
 * @param thisRef {Object} - This is "this"
 * @returns {*}
 */
export const pickFromPropsOrState = (field, thisRef) => {
	return thisRef.props[field] || thisRef.state[field];
};

/**
 * Detects whether a string is an URL or not
 * @param string
 * @returns {boolean}
 */
export const isURL = string => {
	if (process.env.NODE_ENV === 'development' && typeof string === 'string' && string?.indexOf('localhost') !== -1) {
		return true;
	}
	const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return !!pattern.test(string);
};

/**
 * Generates a formData object for requests with files to upload
 * @param mediaFieldName {String}
 * @param sourceObject {Object} - object with the images and other properties
 * @param filesKey {String} - key for the files in the sourceObject
 * @param options {Object} - { ignoredKeys: [] }
 * @returns {FormData}
 */
export const generateFormData = (mediaFieldName = 'media', sourceObject, filesKey, options) => {
	let formData = new FormData();
	if (sourceObject[filesKey] && !Array.isArray(sourceObject[filesKey])) {
		formData.append(mediaFieldName, sourceObject[filesKey], sourceObject[filesKey]?.name);
	} else if (sourceObject[filesKey]) {
		sourceObject[filesKey]?.forEach(file => {
			formData.append(mediaFieldName, file, file?.name);
		});
	}

	Object.keys(sourceObject).forEach(key => {
		if (key !== filesKey && !( options?.ignoredKeys?.find(k => k === key) ) && typeof sourceObject[key] !== 'undefined') {
			formData.append(key, Array.isArray(sourceObject[key]) ? JSON.stringify(sourceObject[key]) : sourceObject[key].toString());
		}
	});

	return formData;
};

/**
 * Determines whether a routes controller is active (Public/Private/...Other)
 * @param routes {Array}
 * @param location {Object}
 * @returns {Boolean}
 */
export const determineIfRouteIsActive = (routes, location) => {
	return routes.some(route => {
		if (!route.checkDynamicLocation) {
			return route.path === location.pathname;
		}
		const split = route.path.split(':');
		return location.pathname.indexOf(split?.[0]) !== -1;
	});
};

export const makeOptionsForPlates = (options, isFire) => {
	return options.map(choose => (
		<option
			style={choose.color === 'red' ? {color:'red'} : null}
			key={ choose.plate }
			label={isFire ? choose.plate.slice(0, -1) + " minutes" : choose.plate}
			value={ choose.plate }>
			{ choose.plate }
		</option>
	));
}

/**
 * se definesc campurile in functie de anumite cazuri particulare: mai specific la tip profil avem cateva diferente
 * si la cateva texte doar schimbat ce afiseaza
 * @param {*} field
 * @param {*} completeFields
 * @param {*} systemType
 * @param {*} t
 * @returns
 */
export const defineOptions = (field, completeFields, systemType, t) => {
	let label = field;
	switch (completeFields) {
		case "support_type":
			if (field === "Oricare") break;
			if (field === "Tija M8") {
				label = t('support_type_tija');
				break;
			}
			label = t(`support_type_${field.toLowerCase().replace(" ", "_")}`);
			break;
		case "fire":
			label = (field !== 'Oricare' ? field.slice(0, -1) + " " + t("minute") : field);
			break;
		case "profileType":
			label = field === "Oricare" ? t(field) : field + (systemType.includes('Noisy') || systemType.includes('Plafoane') ? (field !== 'Oricare' ? ((field.includes("-/") || field.includes("/-") || field.includes("/") === false) ? ` (${t('simple_structure')})` : ` (${t('double_structure')})`) : '') : systemType.includes('Pereti S') && !systemType.includes('Pereti Smart') ? ` (${t('double_structure')})` : '');
			break;
		case "burglaryResistance":
			label = field !== 'Oricare' ? "RC" + field : field;
			break;
		case "moistureResistance":
			label = (field === "0" ? t('without') : field === "1" ? t('one_face') : field === "2" ? t('two_faces') : field === "1e" ? t('one_exterior_face') : field === "1e" ? t('one_face_cementex') : field);
			break;
		case "soundInsulation":
			label = (field === 'Nu' ? t('without_mineral_wool') : field === 'Da' ? t('with_mineral_wool') : field);
			break;
		case "finishing":
			label = (field === 'Nu' ? t('without_finishing') : field === 'Da' ? t('with_finishing') : field);
			break;
		case "thickness":
			label = field !== 'Oricare' ? field + ' mm' : field;
			break;
		case "thicknessSystem":
			label = field !== 'Oricare' ? field + ' mm' : field;
			break;
		case "protectionSense":
			label = (field === "1" ? t('direction_1') : field === "2" ? t('direction_2') : field === "3" ? t('direction_3') : field);
			break;
		default:
			label = t(field);
	}
	if (label === 'Oricare') {
		label = t('any')
	}
	return label
}

export const makeOptions = (allOptions, options, t, completeFields, systemType) => {
	return allOptions.map(choose =>  (
		<ThemeProvider theme={ createTheme({
			palette: {
				primary: {
					main: '#A61F7D',
					light: '#A61F7D'
				},
				secondary: {
					main: '#A61F7D'
				},
			},
		}) }>
			<option
				key={ choose }
				label={t(defineOptions(choose, completeFields, systemType, t))}
				disabled={options.filter(opt => opt === choose).length === 0}
				className={`${options.filter(opt => opt === choose).length === 0 ? 'optionsClass' : null}`}
				value={ choose }>
				{ choose }
			</option>
		</ThemeProvider>
	));
}

// selecteaza toate optiunile distincte
export const uniqBy = (a) => {
	var index = [];
	return a.filter((item) => {
		var k = item;
		return index.indexOf(k) >= 0 ? false : index.push(k);
	});
}

/**
 * se afiseaza toate placile pe care putem sa le inlocuim in functie de tabelul de placi permise
 * @param {*} allowedPlatesOptions
 * @param {*} plate
 * @returns
 */
export const getAllowedPlates = (allowedPlatesOptions, plate) => {
	let thisOptions = [{plate: plate, fireResistance: "-"}];

	allowedPlatesOptions.forEach((allowedPlatesOption) => {
		if (plate.toLowerCase().replace(" ", "").includes(allowedPlatesOption.plateName.toLowerCase().replace(" ", ""))) {
			allowedPlatesOption.canReplacePlate.forEach( allowedPlate => {
				thisOptions.push({
					plate: allowedPlate.plate,
					fireResistance: allowedPlate.fireResistance
				});

			})
		}
	})

	return thisOptions;
}

export const getAllowedPlatesForFilters =  (importedProducts, fireResistance, plate, allowedPlatesOptions) => {

	let allowedPlates = getAllowedPlates(allowedPlatesOptions, plate), options = [];

	allowedPlates.forEach(allowedPlate => {
		if (allowedPlate.fireResistance === '-' || fireResistance === "" || allowedPlate.fireResistance.replace("m", "") === fireResistance) {
			if (platesPrices2(importedProducts, allowedPlate.plate)._id !== undefined) {
				options.push({plate: allowedPlate.plate});
			}
			else {
				options.push({
					plate: allowedPlate.plate,
					color: 'red'
				});
			}
		}
	})

	return options;

}

/**
 * Se verifica in plates date obj face parte din array (placari)
 * @param {*} plates
 * @param {*} obj
 * @returns
 */
export const checkPlatingPlate = (plates, obj) => {
	let check = true;

	plates.forEach((plate) => {
		let nr = 0, totalNr = 0;

		if (plate.plate1) {
			++totalNr;
		}

		if (plate.plate2) {
			++totalNr;
		}

		if (plate.plate3) {
			++totalNr;
		}

		if (plate.plate4) {
			++totalNr;
		}

		if (plate.plate1 && plate.plate1 === obj.plate1) {
			++nr;
		}

		if (plate.plate2 && plate.plate2 === obj.plate2) {
			++nr;
		}

		if (plate.plate3 && plate.plate3 === obj.plate3) {
			++nr;
		}

		if (plate.plate4 && plate.plate4 === obj.plate4) {
			++nr;
		}

		if (nr === totalNr) {
			check = false;
		}
	});

	return check;
};

/**
 * Se verifica in plates date obj face parte din array (pereti)
 * @param {*} plates
 * @param {*} obj
 * @returns
 */
export const checkPlate = (plates, obj) => {
	let check = 0;

	plates.forEach((plate) => {
		let nr = 0, totalNr = 0;

    if (plate.face1.plate1) {
      ++totalNr;
    }

    if (plate.face1.plate2) {
      ++totalNr;
    }

    if (plate.face1.plate3) {
      ++totalNr;
    }

    if (plate.face2.plate1) {
      ++totalNr;
    }

    if (plate.face2.plate2) {
      ++totalNr;
    }

    if (plate.face2.plate3) {
      ++totalNr;
    }

    if (plate.face1.plate1 && plate.face1.plate1 === obj.face1.plate1) {
      ++nr;
    }

    if (plate.face1.plate2 && plate.face1.plate2 === obj.face1.plate2) {
      ++nr;
    }

    if (plate.face1.plate3 && plate.face1.plate3 === obj.face1.plate3) {
      ++nr;
    }

    if (plate.face2.plate1 && plate.face2.plate1 === obj.face2.plate1) {
      ++nr;
    }

    if (plate.face2.plate2 && plate.face2.plate2 === obj.face2.plate2) {
      ++nr;
    }

    if (plate.face2.plate3 && plate.face2.plate3 === obj.face2.plate3) {
      ++nr;
    }

    if (nr === totalNr) {
      check = 1;
    }
  });

  return check === 0 ? true : false;
};

/**
 * se elimina toate semnele de comparatie
 * @param {*} number
 * @returns
 */
export const regex = (number) => {
  return number.replace("<>", "").replace("<", "").replace(">", "").replace("<=", "").replace("!==", "").replace("==", "").replace("=", "").replace("!", "").replace(" ", "");
}

/**
 * verificam fiecare material in parte daca oferta respectiva poate sa contina acel produs sau nu
 * daca toate conditiile sunt indeplinite, atunci produsul va fi adaugat in necesarul de materiale
 * @param {*} interaxSustineri
 * @param {*} auxilary
 * @param {*} soundInsulation
 * @param {*} profileType
 * @param {*} interax
 * @param {*} placa
 * @param {*} fireResistance
 * @param {*} H
 * @param {*} moistureResistance
 * @param {*} support
 * @param {*} depthPlate
 * @param {*} finishing
 * @param {*} burglaryResistance
 * @param {*} consumptionType
 * @param {*} importedConsumptions
 * @param {*} importName
 * @param {*} structureLink
 * @param {*} distance
 * @param {*} thickness
 * @param {*} ceilingSupport
 * @param {*} basePlate
 * @returns
 */
export const calculateWithImportedConsumptions = (interaxSustineri, auxilary, soundInsulation, profileType, interax, placa, fireResistance, H, moistureResistance, support, depthPlate, finishing, burglaryResistance, consumptionType, importedConsumptions, importName, structureLink, distance, thickness, ceilingSupport, basePlate) => {
  let consumptionsList = [];

  const [primaryProfileType, secondaryProfileType] = profileType.split('/')
  const [primaryInterax, secondaryInterax] = interax.split('/')

  importedConsumptions.forEach((consumption, index) => {
    let numberOfConditions = 0, checkConditions = 0;
    let ans = [];

    if (consumption.conditions.thickness) {
      ++numberOfConditions;
      if (consumption.conditions.thickness.includes("!==")) {
        if (regex(consumption.conditions.thickness) !== thickness.toString()) {
          ++checkConditions;
          // ans.push(thickness);
        }
      } else {
        if (consumption.conditions.thickness.includes("<=")) {
          if (parseFloat(regex(consumption.conditions.thickness)) >= parseFloat(thickness)) {
            ++checkConditions;
            // ans.push(thickness);
          }
        } else {
          if (consumption.conditions.thickness.includes("<")) {
            if (parseFloat(regex(consumption.conditions.thickness)) > parseFloat(thickness)) {
              ++checkConditions;
              // ans.push(thickness);
            }
          } else {
            if (consumption.conditions.thickness.includes(">=")) {
              if (parseFloat(regex(consumption.conditions.thickness)) <= parseFloat(thickness)) {
                ++checkConditions;
                // ans.push(thickness);
              }
            } else {
              if (consumption.conditions.thickness.includes(">")) {
                if (parseFloat(regex(consumption.conditions.thickness)) < parseFloat(thickness)) {
                  ++checkConditions;
                  // ans.push(thickness);
                }
              } else {
                if (parseFloat(consumption.conditions.thickness) === parseFloat(thickness)) {
                  ++checkConditions;
                  // ans.push(thickness);
                }
              }
            }
          }
        }
      }
    }

    if (consumption.conditions.structureLink) {
      ++numberOfConditions;
      if (consumption.conditions.structureLink.includes("!==")) {
        if (regex(consumption.conditions.structureLink) !== structureLink?.toString()) {
          ++checkConditions;
          // ans.push(structureLink);
        }
      } else {
        if (consumption.conditions.structureLink.includes("<=")) {
          if (regex(consumption.conditions.structureLink) >= structureLink?.toString()) {
            ++checkConditions;
            // ans.push(structureLink);

          }
        } else {
          if (consumption.conditions.structureLink.includes("<")) {
            if (parseFloat(regex(consumption.conditions.structureLink)) > structureLink) {
              ++checkConditions;
              // ans.push(structureLink);
            }
          } else {
            if (consumption.conditions.structureLink.includes(">=")) {
              if (parseFloat(regex(consumption.conditions.structureLink)) >= structureLink) {
                ++checkConditions;
                // ans.push(structureLink);
              }
            } else {
              if (consumption.conditions.structureLink.includes(">")) {
                if (parseFloat(regex(consumption.conditions.structureLink)) > structureLink) {
                  ++checkConditions;
                  // ans.push(structureLink);
                }
              } else {
                if (consumption.conditions.structureLink.toString() === structureLink.toString()) {
                  ++checkConditions;
                  // ans.push(structureLink);
                }
              }
            }

          }
        }
      }
    }

    if (consumption.conditions.accessory && consumption.conditions.accessory !== '') {
      ++numberOfConditions;
      if (consumption.conditions.accessory?.toString() === auxilary?.toString()) {
        ++checkConditions;
        // ans.push('auxilary');
      }
    }

    if (consumption.conditions.soundInsulation && consumption.conditions.soundInsulation !== '') {
      ++numberOfConditions;
      if (soundInsulation === 'Oricare') {
        ++checkConditions;
      } else {
        if (consumption.conditions.soundInsulation === soundInsulation) {
          ++checkConditions;
          // ans.push(soundInsulation);
        }
      }
    }

    if (consumption.conditions.profileType) {
      ++numberOfConditions;
      if (consumption.conditions.profileType.includes("!==")) {
        if (regex(consumption.conditions.profileType) !== profileType.toString()) {
          ++checkConditions;
          // ans.push(profileType);

        }
      } else {
        if (consumption.conditions.profileType.includes("<=")) {
          if (regex(consumption.conditions.profileType) >= profileType.toString()) {
            ++checkConditions;
            // ans.push(profileType);

          }
        } else {
          if (consumption.conditions.profileType.includes("<")) {
            if (parseFloat(regex(consumption.conditions.profileType)) > profileType) {
              ++checkConditions;
              // ans.push(profileType);

            }
          } else {
            if (consumption.conditions.profileType === profileType) {
              ++checkConditions;
              // ans.push(profileType);

            }
          }
        }
      }
    }

    if (consumption.conditions.interax) {
      ++numberOfConditions;
      if (consumption.conditions.interax === interax) {
        ++checkConditions;
        // ans.push(interax);

      } else {
        if (consumption.conditions.interax.includes("<=")) {
          if (regex(consumption.conditions.interax) >= interax.toString()) {
            ++checkConditions;
            // ans.push(interax);

          }
        } else {
          if (consumption.conditions.interax.includes(">")) {
            if (regex(consumption.conditions.interax) < interax.toString()) {
              ++checkConditions;
              // ans.push(interax);

            }
          } else {
            if (consumption.conditions.interax.includes("<")) {
              if (regex(consumption.conditions.interax) > interax.toString()) {
                ++checkConditions;
                // ans.push(interax);

              }
            }
          }
        }
      }
    }

    if (consumption.conditions.interaxSustineri) {
      ++numberOfConditions;
      if (consumption.conditions.interaxSustineri.includes("!==")) {
        if (regex(consumption.conditions.interaxSustineri) !== interaxSustineri.toString()) {
          ++checkConditions;
          // ans.push(interaxSustineri);
        }
      } else {
        if (consumption.conditions.interaxSustineri.toString() === interaxSustineri) {
          ++checkConditions;
          // ans.push(interaxSustineri);
        } else {
          if (consumption.conditions.interaxSustineri.includes("<=")) {
            if (regex(consumption.conditions.interaxSustineri) >= interaxSustineri.toString()) {
              ++checkConditions;
              // ans.push(interaxSustineri);
            }
          } else {
            if (consumption.conditions.interaxSustineri.includes("<")) {
              if (regex(consumption.conditions.interaxSustineri) > interaxSustineri.toString()) {
                ++checkConditions;
                // ans.push(interaxSustineri);
              }
            }
          }
        }
      }
    }

    if (consumption.conditions.basePlate) {
      ++numberOfConditions;
      if (consumption.conditions.basePlate.includes("!==")) {
        if (regex(consumption.conditions.basePlate) !== basePlate?.toString()) {
          ++checkConditions;
          // ans.push(basePlate);

        }
      } else {
        if (consumption.conditions.basePlate.includes("<")) {
          if (regex(consumption.conditions.basePlate) > basePlate?.toString()) {
            ++checkConditions;
            // ans.push(basePlate);

          }
        } else {
          if (consumption.conditions.basePlate.includes(">")) {
            if (regex(consumption.conditions.basePlate) < basePlate?.toString()) {
              ++checkConditions;
              // ans.push(basePlate);

            }
          } else {
            if (basePlate?.toString() === regex(consumption.conditions.basePlate)?.toString()) {
              ++checkConditions;
              // ans.push(basePlate);

            }
          }
        }
      }
    }

    if (consumption.conditions.fireResistance) {
      ++numberOfConditions;
      if (consumption.conditions.fireResistance.includes("!==")) {
        if (regex(consumption.conditions.fireResistance) !== fireResistance.toString()) {
          ++checkConditions;
          // ans.push(fireResistance);

        }
      } else {
        if (consumption.conditions.fireResistance.includes("<")) {
          if (regex(consumption.conditions.fireResistance) > fireResistance.toString()) {
            ++checkConditions;
            // ans.push(fireResistance);

          }
        } else {
          if (consumption.conditions.fireResistance.includes(">")) {
            if (regex(consumption.conditions.fireResistance) < fireResistance.toString()) {
              ++checkConditions;
              // ans.push(fireResistance);

            }
          } else {
            if (fireResistance.toString() === regex(consumption.conditions.fireResistance).toString()) {
              ++checkConditions;
              // ans.push(fireResistance);

            }
          }
        }
      }
    }

    if (consumption.conditions.heightMax) {
      ++numberOfConditions;
      if (regex(consumption.conditions.heightMax) >= H) {
        ++checkConditions;
        // ans.push(H);

      }
    }

    if (consumption.conditions.heightMin) {
      ++numberOfConditions;
      if (regex(consumption.conditions.heightMin) < H) {
        ++checkConditions;
        // ans.push(H);

      }
    }

    if (consumption.conditions.moistureResistance) {
      ++numberOfConditions;
      if (consumption.conditions.moistureResistance.includes(">")) {
        if (regex(consumption.conditions.moistureResistance) < moistureResistance) {
          ++checkConditions;
          // ans.push(moistureResistance);
        }
      } else {
        if (consumption.conditions.moistureResistance.includes("!==")) {
          if (regex(consumption.conditions.moistureResistance) !== moistureResistance) {
            ++checkConditions;
            // ans.push(moistureResistance);
          }
        } else {
          if (consumption.conditions.moistureResistance.includes("<")) {
            if (regex(consumption.conditions.moistureResistance) > moistureResistance.toString()) {
              ++checkConditions;
              // ans.push(moistureResistance);
            }
          } else {
            if (regex(consumption.conditions.moistureResistance) === moistureResistance) {
              ++checkConditions;
              // ans.push(moistureResistance);
            }
          }
        }
      }
    }

    if (consumption.conditions.burglaryResistance) {
      ++numberOfConditions;
      if (consumption.conditions.burglaryResistance.includes(">")) {
        if (regex(consumption.conditions.burglaryResistance) !== burglaryResistance) {
          ++checkConditions;
          // ans.push(burglaryResistance);
        }
      } else {
        if (consumption.conditions.burglaryResistance.includes("!==")) {
          if (regex(consumption.conditions.burglaryResistance) !== burglaryResistance) {
            ++checkConditions;
            // ans.push(burglaryResistance);
          }
        } else {
          if (regex(consumption.conditions.burglaryResistance) === burglaryResistance) {
            ++checkConditions;
            // ans.push(burglaryResistance);
          }
        }
      }
    }

    if (consumption.conditions.ceilingSupport) {
      ++numberOfConditions;
      if (consumption.conditions.ceilingSupport.includes(">")) {
        if (regex(consumption.conditions.ceilingSupport) !== ceilingSupport) {
          ++checkConditions;
          // ans.push(ceilingSupport);
        }
      } else {
        if (consumption.conditions.ceilingSupport.includes("!==")) {
          if (regex(consumption.conditions.ceilingSupport) !== regex(ceilingSupport)) {
            ++checkConditions;
            // ans.push(ceilingSupport);
          }
        } else {
          if (regex(consumption.conditions.ceilingSupport) === regex(ceilingSupport)) {
            ++checkConditions;
            // ans.push(ceilingSupport);
          }
        }
      }
    }

    if (consumption.conditions.primaryProfileType) {
      ++numberOfConditions;
      if (consumption.conditions.primaryProfileType.includes(">")) {
        if (regex(consumption.conditions.primaryProfileType) !== primaryProfileType) {
          ++checkConditions;
          // ans.push(primaryProfileType);
        }
      } else {
        if (consumption.conditions.primaryProfileType.includes("!==")) {
          if (regex(consumption.conditions.primaryProfileType) !== primaryProfileType) {
            ++checkConditions;
            // ans.push(primaryProfileType);
          }
        } else {
          if (regex(consumption.conditions.primaryProfileType) === regex(primaryProfileType)) {
            ++checkConditions;
            // ans.push(primaryProfileType);
          }
        }
      }
    }

    if (consumption.conditions.secondaryProfileType) {
      ++numberOfConditions;
      if (consumption.conditions.secondaryProfileType.includes(">")) {
        if (regex(consumption.conditions.secondaryProfileType) !== secondaryProfileType) {
          ++checkConditions;
          // ans.push(secondaryProfileType);
        }
      } else {
        if (consumption.conditions.secondaryProfileType.includes("!==")) {
          if (regex(consumption.conditions.secondaryProfileType) !== secondaryProfileType) {
            ++checkConditions;
            // ans.push(secondaryProfileType);
          }
        } else {
          if (regex(consumption.conditions.secondaryProfileType) === regex(secondaryProfileType)) {
            ++checkConditions;
            // ans.push(secondaryProfileType);
          }
        }
      }
    }

    if (consumption.conditions.primaryInterax) {
      ++numberOfConditions;
      if (consumption.conditions.primaryInterax.includes(">")) {
        if (regex(consumption.conditions.primaryInterax) !== primaryInterax) {
          ++checkConditions;
          // ans.push(primaryInterax);
        }
      } else {
        if (consumption.conditions.primaryInterax.includes("!==")) {
          if (regex(consumption.conditions.primaryInterax) !== primaryInterax) {
            ++checkConditions;
            // ans.push(primaryInterax);
          }
        } else {
          if (regex(consumption.conditions.primaryInterax) === regex(primaryInterax)) {
            ++checkConditions;
            // ans.push(primaryInterax);
          }
        }
      }
    }

    if (consumption.conditions.secondaryInterax) {
      ++numberOfConditions;
      if (consumption.conditions.secondaryInterax.includes(">")) {
        if (regex(consumption.conditions.secondaryInterax) !== secondaryInterax) {
          ++checkConditions;
          // ans.push(secondaryInterax);
        }
      } else {
        if (consumption.conditions.secondaryInterax.includes("!==")) {
          if (regex(consumption.conditions.secondaryInterax) !== secondaryInterax) {
            ++checkConditions;
            // ans.push(secondaryInterax);
          }
        } else {
          if (regex(consumption.conditions.secondaryInterax) === regex(secondaryInterax)) {
            ++checkConditions;
            // ans.push(secondaryInterax);
          }
        }
      }
    }

    if (consumption.conditions.support) {
      ++numberOfConditions;
      if (consumption.conditions.support === support) {
        ++checkConditions;
        // ans.push(support);
      } else {
        if (consumption.conditions.support.includes("<")) {
          if (regex(consumption.conditions.support) > support.toString()) {
            ++checkConditions;
            // ans.push(support);

          }
        }
      }
    }

    if (consumption.conditions.depthPlate) {
      ++numberOfConditions;
      if (consumption.conditions.depthPlate.includes("<=")) {
        if (parseFloat(regex(consumption.conditions.depthPlate)) >= depthPlate) {
          ++checkConditions;
          // ans.push(depthPlate);
        }
      } else {
        if (consumption.conditions.depthPlate.includes(">")) {
          if (parseFloat(regex(consumption.conditions.depthPlate)) < depthPlate) {
            ++checkConditions;
            // ans.push(depthPlate);
          }
        } else {
          if (parseFloat(regex(consumption.conditions.depthPlate)) === depthPlate) {
            ++checkConditions;
            // ans.push(depthPlate);
          }
        }
      }
    }

    if (consumption.conditions.finishing) {
      ++numberOfConditions;
      if (consumption.conditions.finishing === finishing) {
        ++checkConditions;
        // ans.push(finishing);
      } else {
        if (consumption.conditions.finishing.includes("<=")) {
          if (regex(consumption.conditions.finishing) >= finishing.toString()) {
            ++checkConditions;
            // ans.push(finishing);
          }
        } else {
          if (consumption.conditions.finishing.includes(">")) {
            if (regex(consumption.conditions.finishing) < finishing.toString()) {
              ++checkConditions;
              // ans.push(finishing);
            }
          } else {
            if (consumption.conditions.finishing.includes("<")) {
              if (regex(consumption.conditions.finishing) > finishing.toString()) {
                ++checkConditions;
                // ans.push(finishing);
              }
            }
          }
        }
      }
    }

    if (consumption.conditions.consumptionType) {
      ++numberOfConditions;
      if (consumption.conditions.consumptionType === consumptionType) {
        ++checkConditions;
        // ans.push(consumptionType);

      }
    }

    if (checkConditions === numberOfConditions) {
      consumptionsList.push(importedConsumptions[index]);
    }
  })

  return consumptionsList;
}

export const updatePrices = (offer, importedConsumptions, importedProducts, auxilary) => {

  let systemNameFunction, systemName, initialPlates;
  if (offer.plate.face1) {
    systemName = 'Pereti';
    if (offer.systemName.includes('Pereti S')) {
      systemName = 'Pereti S'
    }
    if (offer.systemName.includes('Pereti SS')) {
      systemName = 'Pereti SS'
    }
    if (offer.systemName.includes('Pereti SL')) {
      systemName = 'Pereti SL'
    }
    if (offer.systemName.includes('Pereti SLA')) {
      systemName = 'Pereti SLA'
    }
    systemNameFunction = "Simplu";
    if (offer.systemName.includes('Triplu')) {
      systemNameFunction = 'Triplu'
    }
    if (offer.systemName.includes('Dublu')) {
      systemNameFunction = 'Dublu'
    }
    initialPlates = offer.initialPlate;
  } else {
    systemName = 'Placari';
    systemNameFunction = "Duble";
    if (offer.systemName.includes('Cvadruple')) {
      systemNameFunction = 'Cvadruple';
    }
    if (offer.systemName.includes('Triple')) {
      systemNameFunction = 'Triple';
    }
    initialPlates = offer.platingInitialPlates;
  }

  return {
    consumptions: calculateConsumption(systemName, auxilary, offer.interax, offer.plate, offer, 'interior', importedConsumptions, systemNameFunction, importedProducts, 'change'),
    consumptionsExterior: calculateConsumption(systemName, auxilary, offer.interax, initialPlates, offer, 'exterior', importedConsumptions, systemNameFunction, importedProducts)
  }
}

export const platesPrices2 = (importedProducts, plate) => {
  let price = {};
  importedProducts.forEach(product => {
    if (product.name.replace(" ", "") !== "") {
      if (product.name.toLowerCase().replace(" ", "").includes(plate.toLowerCase().replace(" ", "")) === true || plate.toLowerCase().replace(" ", "").includes(product.name.toLowerCase().replace(" ", "")) === true || product.name === plate) {
        price = product
      }
    }
  })
  return price
}

/**
 * Se cauta materialul in necesarul de materiale
 * @param {*} importedProducts
 * @param {*} codSap
 * @returns
 */
export const getConsumptionDetails = (importedProducts, codSap) => {
  let price = {};
  importedProducts.forEach(product => {
    if (product.codSap === codSap) {
      price = product
    }
  })
  return price
}

export const roundNumber = (number) => {
  number = parseFloat(number);
  let originalNumber = number * 1000;

  return originalNumber % 10 >= 5 ? (originalNumber - originalNumber % 10 + 10) / 1000 : (originalNumber - originalNumber % 10) / 1000;
}

/**
 * Se calculeaza ce materiale trebuie adaugate pentru oferta respectiva
 * Mai intai se pun in lista placile ofertei, dupa si materialele
 * @param systemName
 * @param auxilary
 * @param interax
 * @param plate
 * @param offer
 * @param consumptionType
 * @param importedConsumptions
 * @param importName
 * @param importedProducts
 * @param change
 * @returns
 */
export const calculateConsumption = (systemName, auxilary, interax, plate, offer, consumptionType, importedConsumptions, importName, importedProducts, change) => {
  let plates = [], distinctPlates = [], ans = [], grosime;
	console.log(importedProducts, plate)
  // se ia din lista de preturi fiecare placa la rand
  if (systemName.includes('Pereti') || systemName.includes('Noisy') || systemName.includes('Plafoane')) {
    if (plate.face1.plate1) {
      plates.push(platesPrices2(importedProducts, plate.face1.plate1));
    }
    if (plate.face1.plate2) {
      plates.push(platesPrices2(importedProducts, plate.face1.plate2));
    }
    if (plate.face1.plate3) {
      plates.push(platesPrices2(importedProducts, plate.face1.plate3));
    }
    if (plate.face2.plate1) {
      plates.push(platesPrices2(importedProducts, plate.face2.plate1));
    }
    if (plate.face2.plate2) {
      plates.push(platesPrices2(importedProducts, plate.face2.plate2));
    }
    if (plate.face2.plate3) {
      plates.push(platesPrices2(importedProducts, plate.face2.plate3));
    }
    if (plate.face2.plate4) {
      plates.push(platesPrices2(importedProducts, plate.face2.plate4));
    }
    if (offer.intermediatePlate) {
      plates.push(platesPrices2(importedProducts, offer.intermediatePlate));
    }
    let value = parseInt(plate.face2.plate1.replace(/[^0-9]/g, ''));
    grosime = (value === 125 || value <= 12) ? 12.5 : 15;
  } else {
    if (plate.plate1) {
      plates.push(platesPrices2(importedProducts, plate.plate1));
    }
    if (plate.plate2) {
      plates.push(platesPrices2(importedProducts, plate.plate2));
    }
    if (plate.plate3) {
      plates.push(platesPrices2(importedProducts, plate.plate3));
    }
    if (plate.plate4) {
      plates.push(platesPrices2(importedProducts, plate.plate4));
    }
    let value = parseInt(plate.plate1.replace(/[^0-9]/g, ''));
    grosime = (value <= 12 || value === 125) ? 12.5 : 15;
  }
  // se afla cate placi distincte sunt
  plates.forEach(thisPlate => {
    let ok = 0;
    distinctPlates.forEach(option => {
      if (option.name === thisPlate.name) {
        ok = 1;
        option.quantity++;
      }
    })
    if (ok === 0) {
      distinctPlates.push({
        ...thisPlate,
        quantity: 1
      });
    }
  })

  // se adauga placile distincte la necesarul de materiale
  distinctPlates.forEach(plate => {
    console.log(plate)
    ans = [...ans, {
      codSap: plate.codSap,
      productName: plate.name,
      quantity: plate.quantity,
      price: roundNumber(plate.salePrice),
      weight: roundNumber(parseFloat(plate.weight)) || 0,
      unitMeasure: plate.excelUM,
      category: plate.category,
    }];
  })

  // se adauga restul produselor din materiale
  ans = ans.concat(
    calculateWithImportedConsumptions(
      offer.interaxSustineri || '',
      auxilary || 0,
      offer.soundInsulation.includes('1') ? 'cu 1' : offer.soundInsulation.includes('2') ? 'cu 2' : offer.soundInsulation.includes('3') ? 'cu 3' : offer.soundInsulation.includes('4') ? 'cu 4' : offer.soundInsulation.includes('Da') ? 'cu 1' : offer.soundInsulation === 'Oricare' ? 'Oricare' : 'fara',
      offer.profileType,
      interax,
      plate,
      offer.fireResistance.slice(0, -1),
      parseFloat(offer.height),
      offer.moistureResistance,
      offer?.support?.includes('beton') ? 'beton' : 'tabla',
      grosime,
      offer.finishing === 'Da' ? '1' : '0',
      offer.burglaryResistance || '',
      consumptionType,
      importedConsumptions,
      importName,
      offer?.structureLink === '0' ? '1' : offer?.structureLink === 0 ? 1 : offer?.structureLink || '1',
      offer?.distance,
      offer?.thickness,
      offer?.ceilingSupport,
      offer?.basePlate
    ));

  let consumptionsList = [];

  let lang = localStorage.getItem('language');
  if (!lang) {
    lang = 'ro';
  }
  // se creeaza un array nou in cazul in care unele informatii lipsesc
  consumptionsList = ans.map((consumption, index, arr) => {
    let consumptionDetails = getConsumptionDetails(importedProducts, consumption.codSap);
    // console.log(index, arr)
    if (consumption?.quantityFormula !== undefined) {
      return ({
        codSap: consumption.codSap,
        productName: consumptionDetails.productName || consumption.productName,
        amount: roundNumber(parseFloat(consumption?.quantityFormula) / offer.height)
        ,
        price: roundNumber(parseFloat(consumptionDetails.price)) || 0,
        weight: parseFloat(consumptionDetails.weight) || 0,
        unitMeasure: consumption.unitMeasure,
        category: consumption.category,
      })
    }
    // console.log('fara formula')
    return ({
      codSap: consumption.codSap,
      productName: consumptionDetails.productName || consumption.productName,
      amount: consumption.quantity,
      price: roundNumber(parseFloat(consumptionDetails.price)) || 0,
      weight: parseFloat(consumptionDetails.weight) || 0,
      unitMeasure: consumption.unitMeasure,
      category: consumption.category,
    })
  })

  console.log(consumptionsList)
  let tipPlaca1 = 0, tipPlaca2 = 0, tipPlaca3 = 0, tipPlaca4 = 0;

  // la prinderea superioara
  consumptionsList?.forEach(consumption => {
    console.log(consumption.codSap)
    if (consumption.codSap?.includes('tip1')) {
      tipPlaca1 = consumption.amount;
    }
    if (consumption.codSap?.includes('tip2')) {
      tipPlaca2 = consumption.amount;
    }
    if (consumption.codSap?.includes('tip3')) {
      tipPlaca3 = consumption.amount;
    }
    if (consumption.codSap?.includes('tip4')) {
      tipPlaca4 = consumption.amount;
    }
  })
  console.log(tipPlaca1, tipPlaca2, tipPlaca3, tipPlaca4)
  if (change !== 'change') {
    consumptionsList?.map(consumption => {
      console.log(consumption.codSap, offer)
      if (consumption.category === '0') {
        console.log("intra2");
        consumption.productName.includes("Smart") && console.log(consumption.codSap, offer)
        if (consumption.codSap === offer.codSap1) {
          consumption.amount = tipPlaca1;
        } else {
          if (consumption.codSap === offer.codSap2) {
            console.log('intra')
            consumption.amount = tipPlaca2;
          } else {
            if (consumption.codSap === offer.codSap3) {
              consumption.amount = tipPlaca3;
            } else {
              if (consumption.codSap === offer.codSap4) {
                consumption.amount = tipPlaca4;
              } else {
                consumption.amount = 0;
              }
            }
          }
        }
      }
    })
  }
  console.log(consumptionsList);
  return consumptionsList;
};

// se calculeaza pretul total al produselor
export const calculatePrice = (systemName, auxilary, interax, placa, offer, consumptionType, importedConsumptions, importName, importedProducts) => {
  let suma = 0;
  let calcul = calculateConsumption(systemName, auxilary, interax, placa, offer, consumptionType, importedConsumptions, importName, importedProducts);

  calcul.forEach(consumption => {
    if (consumption.codSap && consumption.codSap.includes('cod') === false) {
      suma += roundNumber(consumption?.amount * roundNumber(consumption?.price));
    }
  })

  return roundNumber(suma);
};

export const checkUsed = (thisUsed, used) => {

  let ok = false;

  if (thisUsed.interaxSustineri) {
    if (thisUsed.interaxSustineri === used.interaxSustineri && thisUsed.interax === used.interax && thisUsed.profile === used.profile && thisUsed.fireResistance === used.fireResistance) {
      ok = true;
    }
  } else {
    if (thisUsed.interax) {
      if (thisUsed.interax === used.interax && thisUsed.profile === used.profile) {
        ok = true;
      }
    } else {
      if (used.fireResistance) {
        if (thisUsed === used.fireResistance) {
          ok = true;
        }
      } else {
        if (used.moistureResistance) {
          if (thisUsed === used.moistureResistance) {
            ok = true;
          }
        } else {
          if (used.burglaryResistance) {
            if (thisUsed === used.burglaryResistance) {
              ok = true;
            }
          }
        }
      }
    }
  }

  return ok;
}

export const checkPlatingPlateOffers = (thisPlates, obj) => {
  let check = true;

  thisPlates.plates.forEach((plate, index) => {
    let nr = 0, totalNr = 0;

    if (plate.plate1) {
      ++totalNr;
    }

    if (plate.plate2) {
      ++totalNr;
    }

    if (plate.plate3) {
      ++totalNr;
    }

    if (plate.plate4) {
      ++totalNr;
    }

    if (plate.plate1 && plate.plate1 === obj.plates.plate1) {
      ++nr;
    }

    if (plate.plate2 && plate.plate2 === obj.plates.plate2) {
      ++nr;
    }

    if (plate.plate3 && plate.plate3 === obj.plates.plate3) {
      ++nr;
    }

    if (plate.plate4 && plate.plate4 === obj.plates.plate4) {
      ++nr;
    }

    if (nr === totalNr && checkUsed(thisPlates.used[index], obj.used)) {
      check = false;
    }
  });

  return check;
}

export const checkPlateOffers = (thisPlates, obj) => {
  let check = 0;

  thisPlates.plates.forEach((plate, index) => {
    let nr = 0, totalNr = 0;

    if (obj.plates?.face1?.plate1) {
      ++totalNr;
    }

    if (obj.plates?.face1?.plate2) {
      ++totalNr;
    }

    if (obj.plates?.face1?.plate3) {
      ++totalNr;
    }

    if (obj.plates?.face2?.plate1) {
      ++totalNr;
    }

    if (obj.plates?.face2?.plate2) {
      ++totalNr;
    }

    if (obj.plates?.face2?.plate3) {
      ++totalNr;
    }

    if (obj.plates?.face2?.plate4) {
      ++totalNr;
    }

    if (plate.face1 && plate.face1.plate1 && plate.face1.plate1 === obj.plates.face1.plate1) {
      ++nr;
    }

    if (plate.face1 && plate.face1.plate2 && plate.face1.plate2 === obj.plates.face1.plate2) {
      ++nr;
    }

    if (plate.face1 && plate.face1.plate3 && plate.face1.plate3 === obj.plates.face1.plate3) {
      ++nr;
    }

    if (plate.face2 && plate.face2.plate1 && plate.face2.plate1 === obj.plates.face2.plate1) {
      ++nr;
    }

    if (plate.face2 && plate.face2.plate2 && plate.face2.plate2 === obj.plates.face2.plate2) {
      ++nr;
    }

    if (plate.face2 && plate.face2.plate3 && plate.face2.plate3 === obj.plates.face2.plate3) {
      ++nr;
    }

    if (plate.face2 && plate.face2.plate4 && plate.face2.plate4 === obj.plates.face2.plate4) {
      ++nr;
    }

    if (nr === totalNr && checkUsed(thisPlates.used[index], obj.used)) {
      check = 1;
    }
  });

  return check === 0 ? true : false;
}

export const indexReturnPlating = (plates, obj) => {

  let ans = [];

  plates.forEach((plate, index) => {
    let nr = 0, totalNr = 0;

    if (plate.plate1) {
      ++totalNr;
    }

    if (plate.plate2) {
      ++totalNr;
    }

    if (plate.plate3) {
      ++totalNr;
    }

    if (plate.plate4) {
      ++totalNr;
    }

    if (plate.plate1 && plate.plate1 === obj.plate1) {
      ++nr;
    }

    if (plate.plate2 && plate.plate2 === obj.plate2) {
      ++nr;
    }

    if (plate.plate3 && plate.plate3 === obj.plate3) {
      ++nr;
    }

    if (plate.plate4 && plate.plate4 === obj.plate4) {
      ++nr;
    }

    if (nr === totalNr) {
      ans.push(index);
    }

  });
  return ans;
};

export const indexReturn = (plates, obj) => {

  let ans = [];

  plates.forEach((plate, index) => {
    let nr = 0, totalNr = 0;

    if (plate.face1.plate1) {
      ++totalNr;
    }

    if (plate.face1.plate2) {
      ++totalNr;
    }

    if (plate.face1.plate3) {
      ++totalNr;
    }

    if (plate.face2.plate1) {
      ++totalNr;
    }

    if (plate.face2.plate2) {
      ++totalNr;
    }

    if (plate.face2.plate3) {
      ++totalNr;
    }

    if (plate.face2.plate4) {
      ++totalNr;
    }

    if (plate.face1.plate1 && plate.face1.plate1 === obj.face1.plate1) {
      ++nr;
    }

    if (plate.face1.plate2 && plate.face1.plate2 === obj.face1.plate2) {
      ++nr;
    }

    if (plate.face1.plate3 && plate.face1.plate3 === obj.face1.plate3) {
      ++nr;
    }

    if (plate.face2.plate1 && plate.face2.plate1 === obj.face2.plate1) {
      ++nr;
    }

    if (plate.face2.plate2 && plate.face2.plate2 === obj.face2.plate2) {
      ++nr;
    }

    if (plate.face2.plate3 && plate.face2.plate3 === obj.face2.plate3) {
      ++nr;
    }

    if (plate.face2.plate4 && plate.face2.plate4 === obj.face2.plate4) {
      ++nr;
    }

    if (nr === totalNr) {
      ans.push(index);
    }

  });
  return ans;
};

export const systemPlates = (thickness, profileType, interax, height, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if (data.conditions.profileType === profileType && data.conditions.interax === interax &&
      data.conditions.heightMin < height && data.conditions.heightMax >= height &&
      (data.conditions.conditionType === "profileTypeAndInterax" || data.conditions.conditionType === "all")) {
      data.plates.forEach(plate => {
        if (plate.face2.plate1.includes(thickness) || thickness === 'Oricare') {
          allPlates.push(plate);
        }
      })
    }
  })

  return allPlates;

}

export const systemPlatesPlating = (thickness, profileType, fireResistance, interax, interaxSustineri, height, importedSystems, importName) => {
  let allPlates = [];
	console.log(importedSystems, thickness, profileType, fireResistance, interax, interaxSustineri, height);
  importedSystems.forEach(data => {
    if (importName === 'Lipire') {
      if (data.conditions.heightMin < height && data.conditions.heightMax >= height && data.conditions.conditionType === "profileTypeAndInterax") {
        data.plates.forEach(plate => {
          allPlates.push(plate);
        })
      }
    } else {
      if (data.conditions.profileType === profileType && data.conditions.interax === interax && data.conditions.interaxSustineri.toString() === interaxSustineri.toString() &&
        data.conditions.heightMin < height && data.conditions.heightMax >= height && data.conditions.fireResistance.toString() === fireResistance.toString() &&
        data.conditions.conditionType === "profileTypeAndInterax") {
        data.plates.forEach(plate => {
          allPlates.push(plate);
        })
      }
    }
  })

  return allPlates;

}

export const systemNoisyPlates = (profileType, fireResistance, interax, interaxSustineri, height, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if (data.conditions.profileType === profileType && data.conditions.interax === interax && data.conditions.interaxSustineri.toString() === interaxSustineri.toString() &&
      data.conditions.heightMin < height && data.conditions.heightMax >= height && data.conditions.fireResistance.toString() === fireResistance.toString() &&
      data.conditions.conditionType === "profileTypeAndInterax") {
      data.plates.forEach(plate => {
        allPlates.push(plate);
      })
    }
  })

  return allPlates;

}

export const fireResistancePlates = (fireResistance, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if ((data.conditions.fireResistance.toString() === fireResistance.toString() || data.conditions.fireResistance.toString() === fireResistance.replace('m', '').toString()) && (data.conditions.conditionType === "fireResistance" || data.conditions.conditionType === "all")) {
      data.plates.forEach(plate => {
        allPlates.push(plate);
      })
    }
  })

  return allPlates;

}

export const moistureResistancePlates = (moistureResistance, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if (data.conditions.moistureResistance.toString() === moistureResistance.toString() && (data.conditions.conditionType === "moistureResistance" || data.conditions.conditionType === "all")) {
      data.plates.forEach(plate => {
        allPlates.push(plate);
      })
    }
  })

  return allPlates;

}

export const burglaryResistancePlates = (burglaryResistance, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if (data.conditions.burglaryResistance === burglaryResistance.toString() && data.conditions.conditionType === "burglaryResistance") {
      data.plates.forEach(plate => {
        allPlates.push(plate);
      })
    }
  })

  return allPlates;

}

export const interaxSustineriPlates = (interaxSustineri, importedSystems, importName) => {
  let allPlates = [];

  importedSystems.forEach(data => {
    if (data.conditions.interaxSustineri === interaxSustineri.toString() && data.conditions.conditionType === "interaxSustineri") {
      data.plates.forEach(plate => {
        allPlates.push(plate);
      })
    }
  })

  return allPlates;

}

export const generatePlatesProfileTypeInterax = (systemType, offer, interaxOptions, profileTypeOptions, importedSystems, importName) => {
  let platesWithProfileTypeInteraxHeight = {plates: [], used: []}, thisProfileTypeOptions = [];
  if (offer.profileType) {
    thisProfileTypeOptions.push(offer.profileType);
  } else {
    profileTypeOptions.forEach(profile => {
      if (profile !== 'Oricare') {
        thisProfileTypeOptions.push(profile);
      }
    })
  }

  thisProfileTypeOptions.forEach(profile => {
    interaxOptions.forEach(interax => {
      let systemsPlates = systemPlates(offer.thickness, profile, interax, offer.height, importedSystems, importName);
      systemsPlates.forEach(element => {
        let condition = checkPlateOffers(platesWithProfileTypeInteraxHeight, {
          plates: element,
          used: {profile: profile, interax: interax}
        });
        if (condition) {
          platesWithProfileTypeInteraxHeight.plates.push(element);
          platesWithProfileTypeInteraxHeight.used.push({profile: profile, interax: interax});
        }
      })
    })
  })
  return platesWithProfileTypeInteraxHeight;
}

export const generatePlatesProfileTypeInteraxSustineri = (systemType, offer, fireResistanceOptions, interaxSustineriOptions, interaxOptions, profileTypeOptions, importedSystems, importName) => {
  let platesWithProfileTypeInteraxHeight = {plates: [], used: []}, thisProfileTypeOptions = [],
    thisFireResistanceOptions = [];
  if (offer.profileType) {
    thisProfileTypeOptions.push(offer.profileType);
  } else {
    profileTypeOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisProfileTypeOptions.push(element);
      }
    })
  }

  if (offer.fireResistance) {
    thisFireResistanceOptions.push(offer.fireResistance);
  } else {
    fireResistanceOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisFireResistanceOptions.push(element);
      }
    })
  }

  if (interaxSustineriOptions.length === 0) {
    interaxSustineriOptions.push(" ")
  }

  thisProfileTypeOptions.forEach(profile => {
    interaxOptions.forEach(interax => {
      interaxSustineriOptions.forEach(interaxSustineri => {
        thisFireResistanceOptions.forEach(fireResistance => {
					console.log(offer.thickness, profile, fireResistance.slice(0, -1), interax, interaxSustineri, offer.height, importedSystems, importName);
          let systemsPlates = systemPlatesPlating(offer.thickness, profile, fireResistance.slice(0, -1), interax, interaxSustineri, offer.height, importedSystems, importName);
          systemsPlates.forEach(element => {
            let condition = checkPlatingPlateOffers(platesWithProfileTypeInteraxHeight, {
              plates: element,
              used: {
                profile: profile,
                interax: interax,
                interaxSustineri: interaxSustineri,
                fireResistance: fireResistance
              }
            })
						console.log(condition)
            if (condition) {
              platesWithProfileTypeInteraxHeight.plates.push(element);
              platesWithProfileTypeInteraxHeight.used.push({
                profile: profile,
                interax: interax,
                interaxSustineri: interaxSustineri,
                fireResistance: fireResistance
              });
            }
          })
        })
      })
    })
  })
  return platesWithProfileTypeInteraxHeight;
}

export const generateNoisyPlatesProfileTypeInteraxSustineri = (systemType, offer, fireResistanceOptions, interaxSustineriOptions, interaxOptions, profileTypeOptions, importedSystems, importName) => {
  let platesWithProfileTypeInteraxHeight = {plates: [], used: []}, thisProfileTypeOptions = [],
    thisFireResistanceOptions = [];
  if (offer.profileType) {
    thisProfileTypeOptions.push(offer.profileType);
  } else {
    profileTypeOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisProfileTypeOptions.push(element);
      }
    })
  }

  if (offer.fireResistance) {
    thisFireResistanceOptions.push(offer.fireResistance);
  } else {
    fireResistanceOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisFireResistanceOptions.push(element);
      }
    })
  }

  thisProfileTypeOptions.forEach(profile => {
    interaxOptions.forEach(interax => {
      interaxSustineriOptions.forEach(interaxSustineri => {
        thisFireResistanceOptions.forEach(fireResistance => {
          let systemsPlates = systemNoisyPlates(profile, fireResistance.slice(0, -1), interax, interaxSustineri, offer.height, importedSystems, importName);
          systemsPlates.forEach(element => {
            let condition = checkPlateOffers(platesWithProfileTypeInteraxHeight, {
              plates: element,
              used: {
                profile: profile,
                interax: interax,
                interaxSustineri: interaxSustineri,
                fireResistance: fireResistance
              }
            })
            if (condition) {
              platesWithProfileTypeInteraxHeight.plates.push(element);
              platesWithProfileTypeInteraxHeight.used.push({
                profile: profile,
                interax: interax,
                interaxSustineri: interaxSustineri,
                fireResistance: fireResistance
              });
            }
          })
        })
      })
    })
  })
  return platesWithProfileTypeInteraxHeight;
}

export const generatePlatesFireResistance = (systemType, offer, fireResistanceOptions, importedSystems, importName) => {
  let platesWithFireResistance = {plates: [], used: []}, thisFireResistanceOptions = [];

  if (offer.fireResistance) {
    thisFireResistanceOptions.push(offer.fireResistance);
  } else {
    fireResistanceOptions.forEach(fireResistance => {
      if (fireResistance !== 'Oricare') {
        thisFireResistanceOptions.push(fireResistance);
      }
    })
  }

  thisFireResistanceOptions.forEach(fireResistance => {
    let systemsPlates = fireResistancePlates(fireResistance, importedSystems, importName);
    systemsPlates.forEach(element => {
      let condition;
      if (systemType === 'Pereti' || systemType === 'Pereti Smart' || systemType === 'Plafoane') {
        condition = checkPlateOffers(platesWithFireResistance, {
          plates: element,
          used: {fireResistance: fireResistance}
        });
      } else {
        condition = checkPlatingPlateOffers(platesWithFireResistance, {
          plates: element,
          used: {fireResistance: fireResistance}
        });
      }
      if (condition) {
        platesWithFireResistance.plates.push(element);
        platesWithFireResistance.used.push(fireResistance);
      }
    })
  })

  return platesWithFireResistance;
}

export const generatePlatesMoistureResistance = (systemType, offer, moistureResistanceOptions, importedSystems, importName) => {
  let platesWithMoistureResistance = {plates: [], used: []}, thisMoistureResistanceOptions = [];

  if (offer.moistureResistance) {
    thisMoistureResistanceOptions.push(offer.moistureResistance);
  } else {
    moistureResistanceOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisMoistureResistanceOptions.push(element);
      }
    })
  }

  thisMoistureResistanceOptions.forEach(moistureResistance => {
    let systemsPlates = moistureResistancePlates(moistureResistance, importedSystems, importName);
    systemsPlates.forEach(element => {
      let condition;
      if (systemType === 'Pereti' || systemType === 'Pereti Smart' || systemType.includes('Noisy') || systemType === 'Plafoane') {
        condition = checkPlateOffers(platesWithMoistureResistance, {
          plates: element,
          used: {moistureResistance: moistureResistance}
        });
      } else {
        condition = checkPlatingPlateOffers(platesWithMoistureResistance, {
          plates: element,
          used: {moistureResistance: moistureResistance}
        });
      }
      if (condition) {
        platesWithMoistureResistance.plates.push(element);
        platesWithMoistureResistance.used.push(moistureResistance);
      }
    })
  })

  return platesWithMoistureResistance;
}

export const generatePlatesBurglaryResistance = (offer, burglaryResistanceOptions, importedSystems, importName) => {
  let platesWithBurglaryResistance = {plates: [], used: []}, thisBurglaryResistanceOptions = [];

  if (offer.burglaryResistance) {
    thisBurglaryResistanceOptions.push(offer.burglaryResistance);
  } else {
    burglaryResistanceOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisBurglaryResistanceOptions.push(element);
      }
    })
  }
  thisBurglaryResistanceOptions.forEach(burglaryResistance => {
    let systemsPlates = burglaryResistancePlates(burglaryResistance, importedSystems, importName);
    systemsPlates.forEach(element => {
      if (checkPlateOffers(platesWithBurglaryResistance, {
        plates: element,
        used: {burglaryResistance: burglaryResistance}
      }) === true) {
        platesWithBurglaryResistance.plates.push(element);
        platesWithBurglaryResistance.used.push(burglaryResistance);
      }
    })
  })
  return platesWithBurglaryResistance;
}

export const generatePlatesInteraxSustineri = (offer, interaxSustineriOptions, importedSystems, importName) => {
  let platesWithInteraxSustineri = {plates: [], used: []}, thisinteraxSustineriOptions = [];

  if (offer.interaxSustineri) {
    thisinteraxSustineriOptions.push(offer.interaxSustineri);
  } else {
    interaxSustineriOptions.forEach(interax => {
      if (interax !== 'Oricare') {
        thisinteraxSustineriOptions.push(interax);
      }
    })
  }

  thisinteraxSustineriOptions.forEach(interaxSustineri => {
    let systemsPlates = interaxSustineriPlates(interaxSustineri, importedSystems, importName);
    systemsPlates.forEach(element => {
      if (checkPlatingPlateOffers(platesWithInteraxSustineri, {
        plates: element,
        used: {interaxSustineri: interaxSustineri}
      }) === true) {
        platesWithInteraxSustineri.plates.push(element);
        platesWithInteraxSustineri.used.push(interaxSustineri);
      }
    })
  })

  return platesWithInteraxSustineri;
}

export const generateCeilingPlates = (systemType, offer, interaxOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, importedSystems, importName) => {
  let ceilingPlates = {plates: [], used: []}, thisProfileTypeOptions = [], thisFireResistanceOptions = [],
    thisMoistureResistanceOptions = [];
  if (offer.profileType) {
    thisProfileTypeOptions.push(offer.profileType);
  } else {
    profileTypeOptions.forEach(profile => {
      if (profile !== 'Oricare') {
        thisProfileTypeOptions.push(profile);
      }
    })
  }

  if (offer.fireResistance) {
    thisFireResistanceOptions.push(offer.fireResistance);
  } else {
    fireResistanceOptions.forEach(fireResistance => {
      if (fireResistance !== 'Oricare') {
        thisFireResistanceOptions.push(fireResistance);
      }
    })
  }

  if (offer.moistureResistance) {
    thisMoistureResistanceOptions.push(offer.moistureResistance);
  } else {
    moistureResistanceOptions.forEach(element => {
      if (element !== 'Oricare') {
        thisMoistureResistanceOptions.push(element);
      }
    })
  }

  thisProfileTypeOptions.forEach(profile => {
    thisMoistureResistanceOptions.forEach(moisture => {
      thisFireResistanceOptions.forEach(fire => {
        interaxOptions.forEach(interax => {
          if (interax !== 'Oricare') {
            importedSystems.forEach(element => {
              let condition = checkPlateOffers(ceilingPlates, {
                plates: element.plates[0],
                used: {
                  ceiling: true,
                  profile: profile,
                  interax: interax,
                  moistureResistance: moisture,
                  fireResistance: fire
                }
              });
              if (condition === true) {
                ceilingPlates.plates.push(element.plates[0]);
                ceilingPlates.used.push({
                  profile: profile,
                  interax: interax,
                  moistureResistance: moisture,
                  fireResistance: fire
                });
              }
            })
          }
        })
      })
    })
  })
  return ceilingPlates;
}

export const generateAllOffers = (systemType, offer, interaxOptions, interaxSustineriOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, importedSystems, importedConsumptions, importName, importedProducts) => () => {
  let platesWithProfileTypeInteraxHeight, platesWithFireResistance, platesWithMoistureResistance,
    platesWithBurglaryResistance;
  console.log(offer.support);
  // se calculeaza toate placile compatibile cu filtrele selectate

  console.log(importedSystems);
  if (systemType === 'Pereti' || systemType === 'Pereti Smart' || systemType === 'Plafoane') {
    if (systemType === 'Pereti' || systemType === 'Pereti Smart') {
      platesWithBurglaryResistance = generatePlatesBurglaryResistance(offer, burglaryResistanceOptions, importedSystems, importName);
    }
    platesWithProfileTypeInteraxHeight = generatePlatesProfileTypeInterax(systemType, offer, interaxOptions, profileTypeOptions, importedSystems, importName);
  } else {
    if (systemType.includes("Noisy")) {
      platesWithProfileTypeInteraxHeight = generateNoisyPlatesProfileTypeInteraxSustineri(systemType, offer, fireResistanceOptions, interaxSustineriOptions, interaxOptions, profileTypeOptions, importedSystems, importName);
    } else {
      if (systemType.includes("Placari") || systemType.includes("Placari Smart")) {
        platesWithProfileTypeInteraxHeight = generatePlatesProfileTypeInteraxSustineri(systemType, offer, fireResistanceOptions, interaxSustineriOptions, interaxOptions, profileTypeOptions, importedSystems, importName);

      }
    }
  }

  platesWithFireResistance = generatePlatesFireResistance(systemType, offer, fireResistanceOptions, importedSystems, importName);
  platesWithMoistureResistance = generatePlatesMoistureResistance(systemType, offer, moistureResistanceOptions, importedSystems, importName);

  let generatedOffers = [];

  console.log(platesWithFireResistance);
  console.log(platesWithMoistureResistance);
  console.log(platesWithBurglaryResistance);
  console.log(platesWithProfileTypeInteraxHeight);

  (platesWithProfileTypeInteraxHeight?.plates || []).forEach((plate, index) => {
    let condition;

    if (systemType === 'Plafoane') {
      if (offer.basedPlates === plate.face2.plate1 || offer.basedPlates === 'Oricare' || offer.basedPlates === '' || offer.basedPlates === undefined) {
        condition = checkPlate(platesWithMoistureResistance.plates, plate) === false
      } else {
        condition = false;
      }

      if (condition) {
        let used = platesWithProfileTypeInteraxHeight.used[index];

        let indexFireResistance = indexReturn(platesWithFireResistance.plates, plate);
        let indexMoistureResistance = indexReturn(platesWithMoistureResistance.plates, plate);
        indexFireResistance.forEach(indexFr => {
          indexMoistureResistance.forEach(indexMr => {
            generatedOffers.push({
              plate: plate,
              interax: used.interax,
              profileType: used.profile,
              height: offer.height,
              fireResistance: platesWithFireResistance.used[indexFr],
              moistureResistance: platesWithMoistureResistance.used[indexMr],
              soundInsulation: offer.soundInsulation,
              support: offer.support,
              ceilingSupport: offer.ceilingSupport,
              finishing: offer.finishing,
              pret: [],
              tablePrice: [],
              tableExteriorPrice: []
            });
          })
        })
      }
    } else {
      if (systemType === 'Pereti' || systemType === 'Pereti Smart') {
        if (offer.basedPlates.toLowerCase().replace(" ", "").includes(plate.face1.plate1.toLowerCase().replace(" ", "")) === true || offer.basedPlates === plate.face2.plate1 || offer.basedPlates === 'Oricare' || offer.basedPlates === '' || offer.basedPlates === undefined) {
          condition = checkPlate(platesWithMoistureResistance.plates, plate) === false && checkPlate(platesWithBurglaryResistance.plates, plate) === false
        } else {
          condition = false;
        }

        if (condition) {
          let used = platesWithProfileTypeInteraxHeight.used[index];

          let indexFireResistance = indexReturn(platesWithFireResistance.plates, plate);
          let indexMoistureResistance = indexReturn(platesWithMoistureResistance.plates, plate);
          let indexBurglaryResistance = indexReturn(platesWithBurglaryResistance.plates, plate);
          indexFireResistance.forEach(indexFr => {
            indexMoistureResistance.forEach(indexMr => {
              indexBurglaryResistance.forEach(indexBr => {
                generatedOffers.push({
                  plate: plate,
                  interax: used.interax,
                  profileType: used.profile,
                  height: offer.height,
                  fireResistance: platesWithFireResistance.used[indexFr],
                  moistureResistance: platesWithMoistureResistance.used[indexMr],
                  burglaryResistance: platesWithBurglaryResistance.used[indexBr],
                  soundInsulation: offer.soundInsulation,
                  support: offer.support,
                  ceilingSupport: offer.ceilingSupport,
                  finishing: offer.finishing,
                  pret: [],
                  tablePrice: [],
                  tableExteriorPrice: []
                });
              })
            })
          })
        }
      } else {

        if (systemType.includes("Noisy")) {
          if (offer.basedPlates === plate.face2.plate1 || offer.basedPlates === 'Oricare' || offer.basedPlates === '' || offer.basedPlates === undefined) {
            condition = checkPlate(platesWithMoistureResistance.plates, plate) === false
          } else {
            condition = false;
          }
          if (condition) {
            let used = platesWithProfileTypeInteraxHeight.used[index];

            let indexMoistureResistance = indexReturn(platesWithMoistureResistance.plates, plate);
            indexMoistureResistance.forEach(indexMr => {
              generatedOffers.push({
                plate: plate,
                interax: used.interax,
                profileType: used.profile,
                height: offer.height,
                interaxSustineri: used.interaxSustineri,
                fireResistance: used.fireResistance,
                moistureResistance: platesWithMoistureResistance.used[indexMr],
                soundInsulation: offer.soundInsulation,
                support: offer.support,
                finishing: offer.finishing,
                pret: [],
                tablePrice: [],
                tableExteriorPrice: []
              });
            })
          }
        } else {
          if (systemType === 'Placari' || systemType === 'Placari Smart') {
            if (offer.basedPlates === plate.plate1 || offer.basedPlates === 'Oricare' || offer.basedPlates === '' || offer.basedPlates === undefined) {
              condition = checkPlatingPlate(platesWithMoistureResistance.plates, plate) === false
            } else {
              condition = false;
            }

            if (condition) {
              let used = platesWithProfileTypeInteraxHeight.used[index];

              let indexMoistureResistance = indexReturnPlating(platesWithMoistureResistance.plates, plate);

              indexMoistureResistance.forEach(indexMr => {
                generatedOffers.push({
                  plate: plate,
                  interax: used.interax,
                  profileType: used.profile,
                  height: offer.height,
                  fireResistance: used.fireResistance,
                  moistureResistance: platesWithMoistureResistance.used[indexMr],
                  interaxSustineri: used.interaxSustineri,
                  soundInsulation: offer.soundInsulation,
                  support: offer.support,
                  finishing: offer.finishing,
                  pret: [],
                  tablePrice: [],
                  tableExteriorPrice: []
                });
              })
            }
          }
        }
      }
    }
  })

  return generatedOffers;
}

export const checkAllowedPlate = (reverseAllowedPlates, offerPlate, thisOfferPlate) => {
  let ok = false;
  let allowPlates = getAllowedPlates(reverseAllowedPlates, offerPlate);

  allowPlates.forEach(allowPlate => {
    if (allowPlate.plate === thisOfferPlate) {
      ok = true;
    }
  })

  if (offerPlate === thisOfferPlate) {
    ok = true;
  }

  return ok;
}

/**
 * Sort an array - you must assign this to a value, it does not mutate!
 * @param array {Array}
 * @param order {String} - can be lowercase or uppercase, it will automatically be transformed here into uppercase
 * @param nestedName {String} - if you want to compare a property from an object - only works with level 1 nesting
 * @param isDate {Boolean}
 * @param secondaryNestedName {String} A secondary sort field
 * @returns {Array}
 */
export const sortArray = (array, order, nestedName, isDate = false, secondaryNestedName = null) => {
  let varType, secondaryType;
  switch (order.toUpperCase()) {
    case 'ASC': {
      if (nestedName) {
        varType = typeof ((array || {})[0] || {})[nestedName];
        secondaryType = typeof ((array || {})[0] || {})[secondaryNestedName] || null;
        if (isDate) {
          return array.sort((a, b) => new Date(b[nestedName]) - new Date(a[nestedName]));
        } else if (varType === 'string') {
          return secondaryNestedName ?
            array.sort((a, b) => (a[nestedName] || '').toLowerCase() - (b[nestedName] || '').toLowerCase() || (secondaryType === 'string' ? (a[secondaryNestedName] || '').toLowerCase() - (b[secondaryNestedName] || '').toLowerCase() : a[secondaryNestedName] - b[secondaryNestedName])) :
            array.sort((a, b) => (a[nestedName] || '').toLowerCase() > (b[nestedName] || '').toLowerCase() ? 1 : -1);
        } else {
          return secondaryNestedName ?
            array.sort((a, b) => a[nestedName] - b[nestedName] || a[secondaryNestedName] - b[secondaryNestedName]) :
            array.sort((a, b) => a[nestedName] > b[nestedName] ? 1 : -1);
        }
      } else {
        varType = typeof (array || {})[0];
        if (isDate) {
          return array.sort((a, b) => new Date(b) - new Date(a));
        } else if (varType === 'string') {
          return array.sort((a, b) => (a || '').toLowerCase() > (b || '').toLowerCase() ? 1 : -1);
        } else {
          return array.sort((a, b) => a > b ? 1 : -1);
        }
      }
    }
    case 'DESC': {
      if (nestedName) {
        varType = typeof ((array || {})[0] || {})[nestedName];
        if (isDate) {
          return array.sort((a, b) => new Date(a[nestedName]) - new Date(b[nestedName]));
        } else if (varType === 'string') {
          return secondaryNestedName ?
            array.sort((a, b) => (b[nestedName] || '').toLowerCase() - (a[nestedName] || '').toLowerCase() || (secondaryType === 'string' ? (b[secondaryNestedName] || '').toLowerCase() - (a[secondaryNestedName] || '').toLowerCase() : b[secondaryNestedName] - a[secondaryNestedName])) :
            array.sort((a, b) => (a[nestedName] || '').toLowerCase() > (b[nestedName] || '').toLowerCase() ? -1 : 1);
        } else {
          return secondaryNestedName ?
            array.sort((a, b) => b[nestedName] - a[nestedName] || b[secondaryNestedName] - a[secondaryNestedName]) :
            array.sort((a, b) => a[nestedName] > b[nestedName] ? -1 : 1);
        }
      } else {
        varType = typeof (array || {})[0];
        if (isDate) {
          return array.sort((a, b) => new Date(a) - new Date(b));
        } else if (varType === 'string') {
          return array.sort((a, b) => (a || '').toLowerCase() > (b || '').toLowerCase() ? -1 : 1);
        } else {
          return array.sort((a, b) => a > b ? -1 : 1);
        }
      }
    }
    default:
      return array;
  }
};

export const getTheGoodOffers = (systemName, offer, allInteraxesOptions, interaxSustineriOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, allowedPlates, importedSystems, importedConsumptions, importName, importedProducts, importedThicknesses, systemCodes, lipire) => {

  let system = systemName;
  if (systemName.includes("Pereti")) {
    system = "Pereti";
  }
  if (systemName.includes("Plafoane")) {
    system = "Plafoane";
  }
  if (systemName.includes("Pereti Smart")) {
    system = "Pereti Smart";
  }
	if (systemName.includes("Placari Smart")) {
    system = "Placari Smart";
  }

  let allOffersWithoutConsumption = generateAllOffers(system, offer, allInteraxesOptions, interaxSustineriOptions, profileTypeOptions, fireResistanceOptions, moistureResistanceOptions, burglaryResistanceOptions, importedSystems, importedConsumptions, importName, importedProducts)();

  let goodOffers = [], allOffers = [], allSoundInsulations = [];

  if (offer.soundInsulation === 'Oricare' || offer.soundInsulation.replace(" ") === '') {
    if (systemName.includes("Noisy") || (systemName.includes("Pereti S") && !systemName.includes("Pereti Smart"))) {
      if (systemName === 'Pereti SLA') {
        allSoundInsulations = ['Da, cu 4 straturi'];
      } else {
        allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Da, cu 3 straturi', 'Nu']
      }
    } else {
      if (systemName.includes("Plafoane")) {
        allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Nu']
      } else {
        allSoundInsulations = ['Da', 'Nu']
      }
    }
  } else {
    if (offer.soundInsulation === 'Nu') {
      allSoundInsulations = [offer.soundInsulation]
    } else {
      if (systemName.includes("Noisy") || (systemName.includes("Pereti S") && !systemName.includes("Pereti Smart"))) {
        if (systemName === 'Pereti SLA') {
          allSoundInsulations = ['Da, cu 4 straturi'];
        } else {
          allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi', 'Da, cu 3 straturi']
        }
      } else {
        if (systemName.includes("Plafoane")) {
          allSoundInsulations = ['Da, cu 1 strat', 'Da, cu 2 straturi']
        } else {
          allSoundInsulations = ['Da']
        }
      }
    }
  }

  if (importedThicknesses.length === 0) {
    importedThicknesses.push('Oricare');
  }

  allOffersWithoutConsumption.forEach((thisOffer) => {
    allSoundInsulations.forEach(thisSoundInsulation => {
      importedThicknesses.filter(thickness => offer.thicknessSystem === undefined || parseFloat(offer.thicknessSystem) === parseFloat(thickness) || offer.thicknessSystem === 'Oricare' || offer.thicknessSystem === '').forEach(thickness => {
        let condition = true;
        let code;
        if (systemName === 'Pereti' || systemName === 'Pereti Smart') {
          code = generateSystemCode({...thisOffer, thicknessSystem: thickness, soundInsulation: thisSoundInsulation})
          console.log(code, systemCodes)
          condition = systemCodes[code];
        } else {
          if (systemName.includes('Noisy')) {
            code = generateSystemCodeNoisyPlating({
              ...thisOffer,
              thicknessSystem: thickness,
              soundInsulation: thisSoundInsulation
            })
            condition = systemCodes[code];
          } else {
            if (systemName.includes('Pereti S')) {
              code = generateSystemCodeSpecialWalls({
                ...thisOffer,
                soundInsulation: thisSoundInsulation,
                thicknessSystem: thickness,
                tab: systemName
              })
              condition = systemCodes[code];
            } else {
              if (systemName.includes('Placari') || systemName === 'Placari Smart') {
                code = generateSystemCodePlating({
                  ...thisOffer,
                  thicknessSystem: thickness,
                  soundInsulation: thisSoundInsulation
                })
                condition = systemCodes[code];
              } else {
                code = generateSystemCodeCeiling({
                  ...thisOffer,
                  thicknessSystem: thickness,
                  soundInsulation: thisSoundInsulation,
                  tab: systemName
                })
                condition = systemCodes[code];
                if (importName.includes('Simple')) {
                  const [primaryInterax, secondaryInterax] = thisOffer.interax.split('/');
                  if (offer.secondaryInterax === undefined || offer.secondaryInterax === 'Oricare' || offer.secondaryInterax === '' || offer.secondaryInterax === secondaryInterax) {
                    condition = systemCodes[code];
                  } else {
                    condition = false;
                  }

                }
              }
            }
          }
        }
        (systemName.includes("Suspendate") ? ["Brida", "Tirant", "Nonius", "Tija M8", "Racord lemn", "Brida AC"] : [' ']).forEach((support, index) => {
          if (systemName.includes("Suspendate")) {
            code = generateSystemCodeCeiling({
              ...thisOffer,
              thicknessSystem: thickness,
              soundInsulation: thisSoundInsulation,
              ceilingSupport: support
            })
            condition = systemCodes[code];
            if (importName.includes('Simple')) {
              const [primaryInterax, secondaryInterax] = thisOffer.interax.split('/');
              if (offer.secondaryInterax === undefined || offer.secondaryInterax === 'Oricare' || offer.secondaryInterax === '' || parseInt(offer.secondaryInterax) === parseInt(secondaryInterax)) {
                condition = systemCodes[code];
              } else {
                condition = false;
              }
            }
          }

          if (offer.basedPlates === undefined || offer.basedPlates === 'Oricare') {
            condition = condition;
          } else {
            if (systemName.includes("Plafoane")) {
              if (offer.basedPlates === thisOffer.plate.face2.plate1) {
                condition = systemCodes[code];
              } else {
                condition = false;
              }
            }
            if (systemName.includes("Pereti") || systemName.includes("Noisy")) {
              if (offer.basedPlates === thisOffer.plate.face1.plate1 || offer.basedPlates === thisOffer.plate.face2.plate1) {
                condition = systemCodes[code];
              } else {
                condition = false;
              }
            } else {
              if (systemName.includes("Placari")) {
                if (offer.basedPlates === thisOffer.plate.plate1) {
                  condition = systemCodes[code];
                } else {
                  condition = false;
                }
              }
            }
          }

          let structure = 4;

          if ((systemName.includes("Pereti S") && !systemName.includes("Pereti Smart"))) {
            structure = 0;
          }
          if (systemName.includes('Pereti SS')) {
            structure = 1;
          }
          if (systemName.includes('Pereti SL')) {
            structure = 2;
          }
          if (systemName.includes('Pereti SLA')) {
            structure = 3;
          }

          if (condition) {
            console.log(code, systemCodes[code]);
            let consumptions = calculateConsumption(
              systemName,
              systemCodes[code].auxilary,
              thisOffer.interax,
              thisOffer.plate,
              {
                ...thisOffer,
                interaxSustineri: thisOffer.interaxSustineri ? thisOffer.interaxSustineri : systemCodes[code].valueHoldingInterax?.toString(),
                basePlate: systemCodes[code].basePlate,
                thickness: systemCodes[code].thickness,
                distance: systemCodes[code].distance,
                structureLink: structure,
                fireResistance: thisOffer.fireResistance,
                moistureResistance: thisOffer.moistureResistance,
                burglaryResistance: thisOffer.burglaryResistance,
                ceilingSupport: systemName.includes("Suspendate") ? support : "Autoportant",
                profileType: thisOffer.profileType,
                soundInsulation: thisSoundInsulation,
                codSap1: systemCodes[code].codSap1,
                codSap2: systemCodes[code].codSap2,
                codSap3: systemCodes[code].codSap3,
                codSap4: systemCodes[code].codSap4,
                intermediatePlate: systemCodes[code].intermediatePlate,
              },
              'interior',
              importedConsumptions,
              importName,
              importedProducts
            );
            let consumptionsExterior = calculateConsumption(
              systemName,
              systemCodes[code].auxilary,
              thisOffer.interax,
              thisOffer.plate,
              {
                ...thisOffer,
                interaxSustineri: thisOffer.interaxSustineri ? thisOffer.interaxSustineri : systemCodes[code].valueHoldingInterax?.toString(),
                basePlate: systemCodes[code].basePlate,
                thickness: systemCodes[code].thickness,
                distance: systemCodes[code].distance,
                structureLink: structure,
                fireResistance: thisOffer.fireResistance,
                moistureResistance: thisOffer.moistureResistance,
                burglaryResistance: thisOffer.burglaryResistance,
                profileType: thisOffer.profileType,
                ceilingSupport: systemName.includes("Suspendate") ? support : "Autoportant",
                soundInsulation: thisSoundInsulation,
                codSap1: systemCodes[code].codSap1,
                codSap2: systemCodes[code].codSap2,
                codSap3: systemCodes[code].codSap3,
                codSap4: systemCodes[code].codSap4,
                intermediatePlate: systemCodes[code].intermediatePlate,
              },
              'exterior',
              importedConsumptions,
              importName,
              importedProducts
            );
            let priceCalc = calculatePrice(
              systemName,
              systemCodes[code].auxilary,
              thisOffer.interax,
              thisOffer.plate,
              {
                ...thisOffer,
                interaxSustineri: thisOffer.interaxSustineri ? thisOffer.interaxSustineri : systemCodes[code].valueHoldingInterax?.toString(),
                basePlate: systemCodes[code].basePlate,
                thickness: systemCodes[code].thickness,
                distance: systemCodes[code].distance,
                structureLink: structure,
                fireResistance: thisOffer.fireResistance,
                moistureResistance: thisOffer.moistureResistance,
                burglaryResistance: thisOffer.burglaryResistance,
                profileType: thisOffer.profileType,
                ceilingSupport: systemName.includes("Suspendate") ? support : "Autoportant",
                soundInsulation: thisSoundInsulation,
                codSap1: systemCodes[code].codSap1,
                codSap2: systemCodes[code].codSap2,
                codSap3: systemCodes[code].codSap3,
                codSap4: systemCodes[code].codSap4,
                intermediatePlate: systemCodes[code].intermediatePlate,
              },
              'interior',
              importedConsumptions,
              importName,
              importedProducts
            );
            allOffers.push({
              thickness: systemCodes[code].thickness,
              thicknessSystem: systemCodes[code].thickness,
              distance: systemCodes[code].distance,
              intermediatePlate: systemCodes[code].intermediatePlate,
              valueHoldingInterax: systemCodes[code].valueHoldingInterax?.toString(),
              plate: thisOffer.plate,
              interax: thisOffer.interax,
              profileType: thisOffer.profileType,
              height: thisOffer.height,
              fireResistance: thisOffer.fireResistance,
              structureLink: thisOffer.structureLink,
              moistureResistance: thisOffer.moistureResistance,
              burglaryResistance: thisOffer.burglaryResistance,
              ceilingSupport: systemName.includes("Suspendate") ? support : "Autoportant",
              interaxSustineri: thisOffer.interaxSustineri ? thisOffer.interaxSustineri : systemCodes[code].valueHoldingInterax?.toString(),
              soundInsulation: thisSoundInsulation,
              support: thisOffer.support,
              finishing: thisOffer.finishing,
              pret: roundNumber(parseFloat(priceCalc)) || 0.0,
              tablePrice: consumptions,
              tableExteriorPrice: consumptionsExterior,
              systemCode: systemCodes[code].systemCode,
              systemCodeTable: systemCodes[code].systemCodeTable,
              protectionSense: systemCodes[code]?.protectionSense?.toString(),
              codSap1: systemCodes[code].codSap1,
              codSap2: systemCodes[code].codSap2,
              codSap3: systemCodes[code].codSap3,
              codSap4: systemCodes[code].codSap4,
              izolareAcustica: systemCodes[code].valueSoundInsulation
            });
          }
        })
      })
    })
  })

  allOffers = sortArray(allOffers, 'ASC', 'pret')

  let usedCodes = cloneDeep(systemCodes), maxValue = offer.soundInsulationMax, minValue = offer.soundInsulationMin;

  while (allOffers.filter(thisOffer => thisOffer.izolareAcustica >= minValue && thisOffer.izolareAcustica <= maxValue).length === 0) {
    if (maxValue < 90) {
      maxValue++;
    } else {
      minValue--;
    }
  }

  allOffers.forEach((thisOffer, index) => {
    if (goodOffers.length < 6 && thisOffer.izolareAcustica >= minValue && thisOffer.izolareAcustica <= maxValue) {
      if (systemName.includes("Noisy")) {
        if (usedCodes[thisOffer.systemCode].used === false) {
          usedCodes[thisOffer.systemCode].used = true;
          goodOffers.push({
              ...thisOffer,
              plate: {
                face1: {
                  plate1: thisOffer.plate.face1.plate1,
                  plate2: thisOffer.plate.face1.plate2,
                  plate3: thisOffer.plate.face1.plate3
                },
                face2: {
                  plate1: thisOffer.plate.face2.plate1,
                  plate2: thisOffer.plate.face2.plate2,
                  plate3: thisOffer.plate.face2.plate3
                },
              }
            }
          );
        }
      } else {
        if (systemName.includes('Pereti')) {
          if (usedCodes[thisOffer.systemCode].used === false) {
            usedCodes[thisOffer.systemCode].used = true;
            goodOffers.push({
                ...thisOffer,
                plate: {
                  face1: {
                    plate1: thisOffer.plate.face1.plate1,
                    plate2: thisOffer.plate.face1.plate2,
                    plate3: thisOffer.plate.face1.plate3
                  },
                  face2: {
                    plate1: thisOffer.plate.face2.plate1,
                    plate2: thisOffer.plate.face2.plate2,
                    plate3: thisOffer.plate.face2.plate3
                  },
                }
              }
            );
          }
        } else {
          if (systemName.includes("Plafoane")) {
            if (usedCodes[thisOffer.systemCode].used === false) {
              usedCodes[thisOffer.systemCode].used = true;
              goodOffers.push({
                  ...thisOffer,
                  plate: {
                    face1: {
                      plate1: thisOffer.plate.face1.plate1,
                      plate2: thisOffer.plate.face1.plate2,
                    },
                    face2: {
                      plate1: thisOffer.plate.face2.plate1,
                      plate2: thisOffer.plate.face2.plate2,
                      plate3: thisOffer.plate.face2.plate3,
                      plate4: thisOffer.plate.face2.plate4
                    },
                  }
                }
              );
            }
          } else {
            if (usedCodes[thisOffer.systemCode].used === false) {
              usedCodes[thisOffer.systemCode].used = true;
              goodOffers.push({
                  ...thisOffer,
                  plate: {
                    plate1: thisOffer.plate.plate1,
                    plate2: thisOffer.plate.plate2,
                    plate3: thisOffer.plate.plate3,
                    plate4: thisOffer.plate.plate4
                  }
                }
              );
            }
          }
        }
      }
    }
  })

  return goodOffers;
}

export const getPlateCode = (plate) => {
  if (plate.includes("Cementex") && plate.includes("8")) {
    return "C8";
  }
  if (plate.includes("Cementex") && plate.includes("10")) {
    return "C10";
  }
  if (plate.includes("Cementex") && plate.includes("12")) {
    return "C12";
  }
  if (plate.includes("Standard")) {
    return "S";
  }
  if (plate.includes("Acustic")) {
    return "A";
  }
  if (plate.includes("Flam Extra")) {
    return "Fe";
  }
  if (plate.includes("Flam Plus")) {
    return "Fp";
  }
  if (plate.includes("Flam")) {
    return "F";
  }
  if (plate.includes("Hydroflam")) {
    return "Hf";
  }
  if (plate.includes("Hydro")) {
    return "H";
  }
  if (plate.includes("PregyAquaBoard")) {
    return "Aq";
  }
  if (plate.includes("LaDura")) {
    return "D";
  }
  if (plate.includes("Resistex")) {
    return "Re";
  }
  return plate;
}

export const generateSystemCode = (savedOffer) => {
  let generatedCode = "D", gross = 0;

  if (savedOffer.plate.face1.plate1.includes(12.5)) {
    gross = 12.5
    generatedCode += savedOffer.thicknessSystem + "*" + savedOffer.profileType;
  } else {
    gross = 15
    generatedCode += savedOffer.thicknessSystem + "*" + savedOffer.profileType;
  }

  generatedCode += "@" + savedOffer.interax + " ";

  if (savedOffer.support.includes('beton')) {
    generatedCode += "be "
  } else {
    generatedCode += "tc "
  }

  generatedCode += "(";
  if (savedOffer.plate.face1.plate1) {
    generatedCode += getPlateCode(savedOffer.plate.face1.plate1);
  }
  if (savedOffer.plate.face1.plate2) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face1.plate2);
  }
  if (savedOffer.plate.face1.plate3) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face1.plate3)
  }
  generatedCode += ")" + gross;
  generatedCode += "^(";
  if (savedOffer.plate.face2.plate1) {
    generatedCode += getPlateCode(savedOffer.plate.face2.plate1);
  }
  if (savedOffer.plate.face2.plate2) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face2.plate2);
  }
  if (savedOffer.plate.face2.plate3) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face2.plate3);
  }
  generatedCode += ")" + gross;


  if (savedOffer.soundInsulation === 'Da') {
    generatedCode += 'VM';
  }

  if (savedOffer.fireResistance === '0m') {
    generatedCode += ' nonRF'
  } else {
    if (savedOffer.fireResistance && savedOffer.fireResistance.includes('minutes')) {
      generatedCode += ' EI' + savedOffer.fireResistance.slice(0, -8)
    } else {
      if (savedOffer.fireResistance && savedOffer.fireResistance.includes("m")) {
        generatedCode += ' EI' + savedOffer.fireResistance.slice(0, -1);
      } else {
        generatedCode += ' EI' + savedOffer.fireResistance;
      }
    }
  }

  if (savedOffer.burglaryResistance !== '0') {
    generatedCode += ' RC' + savedOffer.burglaryResistance
  }
  return generatedCode;

}

export const generateSystemCodePlating = (offer) => {
  let generatedCode = '', profileType, nrPlaci = 0;

  if (offer.interaxSustineri === '250' || offer.interaxSustineri === '125') {
    generatedCode += 'T'
  }

  if (offer.interaxSustineri === '2' || offer.interaxSustineri === '2.5' || offer.interaxSustineri === '0') {
    generatedCode += 'SH'
  }

  let grosime1, grosime2;

  if (offer.profileType && offer.profileType.replace(" ", "") !== "") {
    profileType = parseFloat(offer.profileType.match(/(\d+)/)[0])
  } else {
    profileType = 0;
  }

  let firstParenthesis = '', secondParenthesis = '';

  if (offer.plate.plate1) {
    if (offer.plate.plate1.includes(12.5)) {
      grosime1 = 12.5;
      nrPlaci = 1;
      firstParenthesis += getPlateCode(offer.plate.plate1);
    } else {
      if (offer.plate.plate1.includes(15)) {
        grosime1 = 15;
        nrPlaci = 1;
        secondParenthesis += getPlateCode(offer.plate.plate1);
      } else {
        grosime1 = 18;
        nrPlaci = 1;
        secondParenthesis += getPlateCode(offer.plate.plate1);
      }
    }
  }


  if (offer.plate.plate2) {
    if (offer.plate.plate2.includes(12.5)) {
      nrPlaci = 2;
      firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plate.plate2);
    } else {
      nrPlaci = 2;
      secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plate.plate2);
    }
  }

  if (offer.plate.plate3) {
    if (offer.plate.plate3.includes(12.5)) {
      grosime2 = 12.5;
      nrPlaci = 3;
      firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plate.plate3);
    } else {
      if (offer.plate.plate3.includes(15)) {
        grosime2 = 15;
        nrPlaci = 3;
        secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plate.plate3);
      } else {
        grosime2 = 18;
        nrPlaci = 3;
        secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plate.plate3);
      }
    }
  }

  if (offer.plate.plate4) {
    if (offer.plate.plate4 && offer.plate.plate4.includes(12.5)) {
      nrPlaci = 4;
      firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plate.plate4);
    } else {
      nrPlaci = 4;
      secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plate.plate4);
    }
  }

  if (offer.interaxSustineri === '250') {
    generatedCode += nrPlaci + 'F';
  }

  if (offer.interaxSustineri === '0') {
    generatedCode += nrPlaci;
  }

  if (offer.interaxSustineri === '125') {
    generatedCode += offer.thicknessSystem + 'Br ';
  }

  if (offer.interaxSustineri === '2' || offer.interaxSustineri === '2.5' || offer.interaxSustineri === '0') {
    generatedCode += '.'
  }

  if (offer.interaxSustineri === '2') {
    generatedCode += 'W200'
  }

  if (offer.interaxSustineri === '2.5') {
    generatedCode += 'W250 ' + offer.thicknessSystem + ' ';
  }

  if (offer.interaxSustineri !== '0' && offer.interaxSustineri !== '2.5') {
    if (profileType !== 60 && profileType !== 30) {
      generatedCode += "CW " + (offer.thicknessSystem === undefined || offer.thicknessSystem === 'Oricare' ? 12.5 : offer.thicknessSystem) + '*CW'
    } else {
      if (profileType === 60) {
        generatedCode += "CD";
      } else {
        generatedCode += 'UD';
      }
    }
    generatedCode += profileType + "@" + offer.interax + " ";
  } else {
    if (offer.interaxSustineri !== '2.5') {
      generatedCode += offer.thicknessSystem + ' ';
      if (profileType !== 60 && profileType !== 30) {
        generatedCode += "CW";
      } else {
        if (profileType === 60) {
          generatedCode += "CD"
        } else {
          generatedCode += 'UD';
        }
      }
      generatedCode += profileType + "@" + offer.interax + " ";
    } else {
      if (profileType !== 60 && profileType !== 30) {
        generatedCode += "CW";
      } else {
        if (profileType === 60) {
          generatedCode += "CD"
        } else {
          generatedCode += 'UD';
        }
      }
      generatedCode += profileType + ' ';
    }
  }

  if (offer.support.includes('eton')) {
    generatedCode += "be "
  } else {
    if (offer.support.includes('abla')) {
      generatedCode += "tc "
    } else {
      if (offer.support.includes('idarie')) {
        generatedCode += "zid "
      } else {
        if (offer.support.includes('enc')) {
          generatedCode += "tenc "
        } else {
          if (offer.support.includes('lte')) {
            generatedCode += "alte "
          }
        }
      }
    }
  }

  if (firstParenthesis !== '') {
    generatedCode += "(" + firstParenthesis + ")" + grosime1;
  } else {
    generatedCode += "(" + secondParenthesis + ")" + grosime1;
  }
  if (secondParenthesis !== '' && firstParenthesis !== '') {
    generatedCode += '+(' + secondParenthesis + ')' + grosime2;
  } else {
    if (secondParenthesis !== '') {
      generatedCode += '(' + secondParenthesis + ')' + grosime2;
    }
  }


  if (offer.soundInsulation === 'Da') {
    generatedCode += ' VM';
  }

  if (offer.fireResistance === '0m' || offer.fireResistance === 0) {
    generatedCode += ' nonRF'
  } else {
    if (offer.fireResistance && offer.fireResistance.includes('minutes')) {
      generatedCode += ' EI' + offer.fireResistance.slice(0, -8)
    } else {
      if (offer.fireResistance && offer.fireResistance.includes("m")) {
        generatedCode += ' EI' + offer.fireResistance.slice(0, -1);
      } else {
        generatedCode += ' EI' + offer.fireResistance;
      }
    }
  }

  return generatedCode;

}

export const generateSystemCodeNoisyPlating = (system) => {
  let systemCode = "N";

  let profile = system.profileType, interax = system.interax;

  const [profileType1, profileType2] = profile.split('/')
  const [interax1, interax2] = interax.split('/')

  let grosime1, grosime2;
  let firstParenthesis = '', secondParenthesis = '';

  if (system.plate.face1.plate1 && system.plate.face1.plate1.includes(12.5)) {
    grosime1 = 12.5;
    firstParenthesis += getPlateCode(system.plate.face1.plate1);
  } else {
    if (system.plate.face1.plate1) {
      grosime1 = 15;
      secondParenthesis += getPlateCode(system.plate.face1.plate1);
    }

  }

  if (system.plate.face1.plate2 && system.plate.face1.plate2.includes(12.5)) {
    firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plate.face1.plate2);

  } else {
    if (system.plate.face1.plate2) {
      firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plate.face1.plate2);
    }
  }

  if (system.plate.face1.plate3 && system.plate.face1.plate3.includes(12.5)) {
    firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plate.face1.plate3);
  } else {
    if (system.plate.face1.plate3) {
      firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plate.face1.plate3);
    }
  }

  if (system.plate.face2.plate1 && system.plate.face2.plate1.includes(12.5)) {
    grosime2 = 12.5;
    secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate1);

  } else {
    if (system.plate.face2.plate1) {
      grosime2 = 15;
      secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate1);
    }
  }

  if (system.plate.face2.plate2 && system.plate.face2.plate2.includes(12.5)) {
    secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate2);

  } else {
    if (system.plate.face2.plate2) {
      secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate2);
    }
  }

  if (system.plate.face2.plate3 && system.plate.face2.plate3.includes(12.5)) {
    secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate3);

  } else {
    if (system.plate.face2.plate3) {
      secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plate.face2.plate3);
    }
  }

  systemCode += system.thicknessSystem;

  if (system.interaxSustineri === '250') {
    systemCode += '.F';
  }
  if (system.interaxSustineri === '0') {
    systemCode += '.I';
  }
  if (system.interaxSustineri === '1') {
    systemCode += '.UU';
  }


  systemCode += ' s1.' + profileType1 + '@' + interax1;
  systemCode += ' s2.' + profileType2 + '@' + interax2 + ' ';

  if (system.support.includes('eton')) {
    systemCode += 'be'
  }

  if (system.support.includes('abla')) {
    systemCode += 'tc'
  }

  systemCode += " (" + firstParenthesis + ")" + grosime1 + ' ^ (' + secondParenthesis + ")" + grosime2;

  if (system.soundInsulation.includes('Da')) {
    systemCode += ' VM';
    if (system.soundInsulation.includes("1")) {
      systemCode += "1";
    }
    if (system.soundInsulation.includes("2")) {
      systemCode += "2";
    }
  }

  if (system.fireResistance === '0m') {
    systemCode += ' nonRF'
  } else {
    systemCode += ' EI' + system.fireResistance.replace('m', '');
  }

  return systemCode;
}

export const generateSystemCodeSpecialWalls = (savedOffer) => {
  let generatedCode = "", gross = 0;

  if (savedOffer.tab === 'Pereti S') {
    generatedCode += 'S';
  }

  if (savedOffer.tab === 'Pereti SL') {
    generatedCode += 'SL';
  }

  if (savedOffer.tab === 'Pereti SLA') {
    generatedCode += 'SLA';
  }

  generatedCode += savedOffer.thicknessSystem + ' ' + savedOffer.profileType + '@' + savedOffer.interax + ' ';

  if (savedOffer.support === 0) {
    generatedCode += 'be'
  }

  if (savedOffer.support === 1) {
    generatedCode += 'tc'
  }

  if (savedOffer.support.includes('beton')) {
    generatedCode += "be "
  } else {
    generatedCode += "tc "
  }

  generatedCode += "(";
  if (savedOffer.plate.face1.plate1) {
    if (savedOffer.plate.face1.plate1.includes('12.5')) {
      gross = 12.5;
    } else {
      gross = 15;
    }
    generatedCode += getPlateCode(savedOffer.plate.face1.plate1);
  }
  if (savedOffer.plate.face1.plate2) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face1.plate2);
  }
  if (savedOffer.plate.face1.plate3) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face1.plate3)
  }
  generatedCode += ")" + gross;
  generatedCode += " ^ (";
  if (savedOffer.plate.face2.plate1) {
    if (savedOffer.plate.face2.plate1.includes('12.5')) {
      gross = 12.5;
    } else {
      gross = 15;
    }
    generatedCode += getPlateCode(savedOffer.plate.face2.plate1);
  }
  if (savedOffer.plate.face2.plate2) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face2.plate2);
  }
  if (savedOffer.plate.face2.plate3) {
    generatedCode += "+" + getPlateCode(savedOffer.plate.face2.plate3);
  }
  generatedCode += ")" + gross;


  if (savedOffer.soundInsulation.includes('Da')) {
    generatedCode += ' VM';
    if (savedOffer.soundInsulation.includes("2")) {
      generatedCode += "2";
    } else {
      if (savedOffer.soundInsulation.includes("3")) {
        generatedCode += "3";
      } else {
        if (savedOffer.soundInsulation.includes("4")) {
          generatedCode += "4";
        } else {
          generatedCode += "1";
        }
      }
    }
  }

  if (savedOffer.fireResistance === '0m') {
    generatedCode += ' nonRF'
  } else {
    if (savedOffer.fireResistance && savedOffer.fireResistance.includes('minutes')) {
      generatedCode += ' EI' + savedOffer.fireResistance.slice(0, -8)
    } else {
      if (savedOffer.fireResistance && savedOffer.fireResistance.includes("m")) {
        generatedCode += ' EI' + savedOffer.fireResistance.slice(0, -1);
      } else {
        generatedCode += ' EI' + savedOffer.fireResistance;
      }
    }
  }

  if (savedOffer.burglaryResistance !== '0') {
    generatedCode += ' RC' + savedOffer.burglaryResistance
  }
  return generatedCode;

}

export const generateSystemCodeCeiling = (offer) => {
  let generatedCode = "P";

  let nrPlates = 0;
  if (offer.plate.face2?.plate1) {
    nrPlates = 1;
  }
  if (offer.plate.face2?.plate2) {
    nrPlates = 2;
  }
  if (offer.plate.face2?.plate3) {
    nrPlates = 3;
  }
  if (offer.plate.face2?.plate4) {
    nrPlates = 4;
  }

  const [primaryProfileType, secondaryProfileType] = offer.profileType.split('/')
  const [primaryInterax, secondaryInterax] = offer.interax.split('/')

  generatedCode += nrPlates + '.';
  generatedCode += offer.thicknessSystem + '.';
  if (offer.tab?.includes("Autoportant")) {
    generatedCode += 'A' + '/' + offer.profileType + '/' + offer.interax;
  } else {
    if (offer.profileType.includes('-') === true) {
      generatedCode += 'S1.' + (secondaryProfileType !== '-' ? secondaryProfileType : primaryProfileType) + '.' + (secondaryInterax !== '-' ? secondaryInterax : primaryInterax) + '.'
    }
    if (offer.profileType.includes('-') === false) {
      generatedCode += 'S2.' + offer.profileType + '.' + offer.interax + '.'
    }
  }

  if (offer.ceilingSupport === "Brida") {
    generatedCode += 'Br';
  }

  if (offer.ceilingSupport === "Tirant") {
    generatedCode += 'T';
  }

  if (offer.ceilingSupport === "Nonius") {
    generatedCode += 'N';
  }

  if (offer.ceilingSupport === "Tija M8") {
    generatedCode += 'Tf';
  }

  if (offer.ceilingSupport === "Racord lemn") {
    generatedCode += 'Rl';
  }

  if (offer.ceilingSupport === "Brida AC") {
    generatedCode += 'Ba';
  }

  let platesWithThickness12 = '(', platesWithThickness15 = '(', platesWithThickness18 = '(';

  if (offer.plate.face1.plate1?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face1.plate1;
  } else {
    if (offer.plate.face1.plate1?.includes(15)) {
      platesWithThickness15 += offer.plate.face1.plate1;
    } else {
      platesWithThickness18 += offer.plate.face1.plate1;
    }
  }
  if (offer.plate.face1.plate2?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face1.plate2;
  } else {
    if (offer.plate.face1.plate2?.includes(15)) {
      platesWithThickness15 += offer.plate.face1.plate2;
    } else {
      platesWithThickness18 += offer.plate.face1.plate2;
    }
  }

  if (offer.plate.face2.plate1?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face2.plate1;
  } else {
    if (offer.plate.face2.plate1?.includes(15)) {
      platesWithThickness15 += offer.plate.face2.plate1;
    } else {
      platesWithThickness18 += offer.plate.face2.plate1;
    }
  }
  if (offer.plate.face2.plate2?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face2.plate2;
  } else {
    if (offer.plate.face2.plate2?.includes(15)) {
      platesWithThickness15 += offer.plate.face2.plate2;
    } else {
      platesWithThickness18 += offer.plate.face2.plate2;
    }
  }
  if (offer.plate.face2.plate3?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face2.plate3;
  } else {
    if (offer.plate.face2.plate3?.includes(15)) {
      platesWithThickness15 += offer.plate.face2.plate3;
    } else {
      platesWithThickness18 += offer.plate.face2.plate3;
    }
  }
  if (offer.plate.face2.plate4?.includes(12.5)) {
    platesWithThickness12 += offer.plate.face2.plate4;
  } else {
    if (offer.plate.face2.plate4?.includes(15)) {
      platesWithThickness15 += offer.plate.face2.plate4;
    } else {
      platesWithThickness18 += offer.plate.face2.plate4;
    }
  }

  generatedCode += ' ';

  if (platesWithThickness12 !== '(') {
    generatedCode += platesWithThickness12 + ')12.5 ^ '
  }
  if (platesWithThickness15 !== '(') {
    generatedCode += platesWithThickness15 + ')15 ^ '
  }
  if (platesWithThickness18 !== '(') {
    generatedCode += platesWithThickness18 + ')18 '
  }

  if (offer.soundInsulation.includes('1')) {
    generatedCode += 'VM1';
  }
  if (offer.soundInsulation.includes('2')) {
    generatedCode += 'VM2';
  }

  if (offer.fireResistance === '0m') {
    generatedCode += ' nonRF'
  } else {
    if (offer.fireResistance && offer.fireResistance.includes('minutes')) {
      generatedCode += ' EI' + offer.fireResistance.slice(0, -8)
    } else {
      if (offer.fireResistance && offer.fireResistance.includes("m")) {
        generatedCode += ' EI' + offer.fireResistance.slice(0, -1);
      } else {
        generatedCode += ' EI' + offer.fireResistance;
      }
    }
  }
  return generatedCode;
}

export const getImages = (offer) => {
  if (offer.systemName.includes("Simplu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_s_layer_d_no_wool.jpg'/>
  }
  if (offer.systemName.includes("Simplu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_s_layer_d_wool.jpg'/>
  }
  if (offer.systemName.includes("Simplu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_s_layer_s_wool.jpg'/>
  }
  if (offer.systemName.includes("Simplu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_s_layer_s_no_wool.jpg'/>
  }

  if (offer.systemName.includes("Dublu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_d_layer_d_wool.jpg'/>
  }
  if (offer.systemName.includes("Dublu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_d_layer_d_no_wool.jpg'/>
  }
  if (offer.systemName.includes("Dublu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_d_layer_s_wool.jpg'/>
  }
  if (offer.systemName.includes("Dublu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_d_layer_s_no_wool.jpg'/>
  }

  if (offer.systemName.includes("Triplu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_t_layer_d_wool.jpg'/>
  }
  if (offer.systemName.includes("Triplu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/wall_t_layer_d_no_wool.jpg'/>
  }
  if (offer.systemName.includes("Triplu Placat") && offer.soundInsulation.includes('Da') && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_t_layer_s_wool.jpg'/>
  }
  if (offer.systemName.includes("Triplu Placat") && offer.soundInsulation === 'Nu' && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/wall_t_layer_s_no_wool.jpg'/>
  }


  if (offer.systemName.includes("Placari") && offer.systemName.includes("Simple") && offer.profileType.includes("CW") && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/lining_s_layer_s_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Simple") && offer.profileType.includes("CW") && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/lining_s_layer_d_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Simple") && offer.profileType.includes("CD")) {
    return <img className={'fit-picture'} src='/images/lining_s_profile_cd.jpg'/>
  }

  if (offer.systemName.includes("Placari") && offer.systemName.includes("Duble") && offer.profileType.includes("CW") && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/lining_d_layer_s_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Duble") && offer.profileType.includes("CW") && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/lining_d_layer_d_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Duble") && offer.profileType.includes("CD")) {
    return <img className={'fit-picture'} src='/images/lining_d_profile_cd.jpg'/>
  }

  if (offer.systemName.includes("Placari") && offer.systemName.includes("Triple") && offer.profileType.includes("CW") && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/lining_t_layer_s_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Triple") && offer.profileType.includes("CW") && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/lining_t_layer_d_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Triple") && offer.profileType.includes("CD")) {
    return <img className={'fit-picture'} src='/images/lining_t_profile_cd.jpg'/>
  }

  if (offer.systemName.includes("Placari") && offer.systemName.includes("Cvadruple") && offer.profileType.includes("CW") && offer.interax.includes('H') === false) {
    return <img className={'fit-picture'} src='/images/lining_q_layer_s_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Cvadruple") && offer.profileType.includes("CW") && offer.interax.includes('H')) {
    return <img className={'fit-picture'} src='/images/lining_q_layer_d_profile_cw.jpg'/>
  }
  if (offer.systemName.includes("Placari") && offer.systemName.includes("Cvadruple") && offer.profileType.includes("CD")) {
    return <img className={'fit-picture'} src='/images/lining_q_profile_cd.jpg'/>
  }
}

export const getSystemType = (offer) => {
  let offerInfo = {
    type: '',
    numberOfPlates: '',
    wallsType: '',
    linningsType: '',
    ceilingsType: '',
    name: ''
  };

  // system type
  if (offer.systemName.toLowerCase().includes('plafoane')) {
    offerInfo.type = 'ceilings';
    offerInfo.name = 'Plafoane';
  } else if (offer.systemName.toLowerCase().includes('placari')) {
    offerInfo.type = 'linnings';
    offerInfo.name = 'Placari';
  } else {
    offerInfo.type = 'walls';
    offerInfo.name = 'Pereti';
  }

  if (offerInfo.type === 'ceilings') {
    if (offer.systemName.toLowerCase().includes('suspendate')) {
      offerInfo.ceilingsType = 's';
      offerInfo.name += ' Suspendate';
    } else if (offer.systemName.toLowerCase().includes('auto')) {
      offerInfo.ceilingsType = 'ss';
      offerInfo.name += ' Autoportante';
    }
  }

  if (offerInfo.type === 'linnings') {
		if (offer.systemName.toLowerCase().includes('placari smart')) {
			offerInfo.linningsType = 'f';
			offerInfo.name += ' Smart';}
    if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('fixari')) {
      offerInfo.linningsType = 'nf';
      offerInfo.name += ' Noisy Fixari';
    } else if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('independente')) {
      offerInfo.linningsType = 'ni';
      offerInfo.name += ' Noisy Independente';
    } else if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('uu')) {
      offerInfo.linningsType = 'nuu';
      offerInfo.name += ' Noisy UU';
    } else if (offer.systemName.toLowerCase().includes('fixari')) {
      offerInfo.linningsType = 'f';
      offerInfo.name += ' Fixari';
    } else if (offer.systemName.toLowerCase().includes('independente')) {
      offerInfo.linningsType = 'i';
      offerInfo.name += ' Independente';
    } else if (offer.systemName.toLowerCase().includes('liniare')) {
      offerInfo.linningsType = 'l';
      offerInfo.name += ' Liniare';
    } else if (offer.systemName.toLowerCase().includes('lipire')) {
      offerInfo.linningsType = 'p';
      offerInfo.name += ' Lipire';
    }
  }

  if (offerInfo.type === 'walls') {
		if (offer.systemName.toLowerCase().includes('pereti smart')) {
			offerInfo.wallsType = 'd';
			offerInfo.name += ' Smart';
		}
    if (offer.systemName.toLowerCase().includes('pereti sla')) {
      offerInfo.wallsType = 'sla';
      offerInfo.name += ' SLA';
    } else if (offer.systemName.toLowerCase().includes('pereti sl')) {
      offerInfo.wallsType = 'sl';
      offerInfo.name += ' SL';
    } else if (offer.systemName.toLowerCase().includes('pereti ss') || (offer.systemName.toLowerCase().includes('pereti s') && !offer.systemName.toLowerCase().includes('pereti smart'))) {
      offerInfo.wallsType = 's';
      offerInfo.name += ' S';
      if (offer.systemName.toLowerCase().includes('asimetric')) {
        offerInfo.separativiType = 'asimetric';
      } else if (offer.systemName.toLowerCase().includes('intermediar')) {
        offerInfo.separativiType = 'intermediar';
      } else {
        offerInfo.separativiType = 'normal';
      }
    } else {
      offerInfo.wallsType = 'd';
    }
  }

  // number of plates
  if (offer.systemName.toLowerCase().includes('cvadruplu') || offer.systemName.toLowerCase().includes('cvadruple')) {
    offerInfo.numberOfPlates = 'q';
    offerInfo.name += ' Cvadruplu';
  } else if (offer.systemName.toLowerCase().includes('triplu') || offer.systemName.toLowerCase().includes('triple')) {
    offerInfo.numberOfPlates = 't';
    offerInfo.name += ' Triplu';
  } else if (offer.systemName.toLowerCase().includes('dublu') || offer.systemName.toLowerCase().includes('duble')) {
    offerInfo.numberOfPlates = 'd';
    offerInfo.name += ' Dublu';
  } else if (offer.systemName.toLowerCase().includes('simplu') || offer.systemName.toLowerCase().includes('simple') || offer.systemName.toLowerCase().includes('lipire')) {
    offerInfo.numberOfPlates = 's';
    offerInfo.name += ' Simplu';
  }

  return offerInfo;
}

export const getWoolType = (offer) => {
  let woolLabel = null;
  let findWoolProduct = offer.consumption.find(consumption => {
    if (consumption.productName.toLowerCase().includes('mineral')) {
      return consumption;
    }
  });
  if (findWoolProduct) {
    woolLabel = findWoolProduct.productName;
  }
  if (offer.soundInsulation.includes('1')) {
    woolLabel = '2x ' + woolLabel;
  } else if (offer.soundInsulation.includes('2')) {
    woolLabel = '2x2 ' + woolLabel;
  }

  return woolLabel;
}

export const sortNumbers = (data) => {
	return data.sort((a, b) => {
		return (a.match(/(\d+)/) ? parseFloat(a.match(/(\d+)/)[0]) : 0) - (b.match(/(\d+)/) ? parseFloat(b.match(/(\d+)/)[0]) : 0)
	});
}
