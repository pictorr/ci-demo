const xlUtils = require("./excelUtils");
const systemService = require("../systemService");
const translationsDetails = require("./constants");

const getFireResistance = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let value = offer.fireResistance.slice(0, -1);
    if (value !== '0') {
        label = `EI = ${ value } ${ xlUtils.message('minutes', language) }`;
    }
    return label;
}

const getDirection = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    if (offer.protectionSense && ['0', '1', '2', '3'].includes(offer.protectionSense)) {
        label = xlUtils.message(`direction_${ offer.protectionSense }`, language);
    }
    return label;
}

const getMoistureResistance = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = xlUtils.message('value_not_specified', language);
    let value = offer.moistureResistance;
    if (value !== '0') {
        if (systemType.type === 'ceilings') {
            if (systemType.ceilingsType === 's') {
                label = xlUtils.message('ceilings_moist', language);
            } else {
                label = xlUtils.message('ceilings_moist_lower', language);
            }
        } else {
            if (value === '1' || value === '1e') {
                label = `${xlUtils.message(translationsDetails['fata'], language)} A`;
            } else if (value === '2' || value === '2e') {
                const side_translation = xlUtils.message(translationsDetails['fata'], language);
                const connecting_word = xlUtils.message('connecting_word', language);
                label = `${side_translation} A ${connecting_word} ${side_translation} B`
            }
        }
    }
    
    return label;
}

const getHeightHeader = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = xlUtils.message('height', language);
    if (systemType.type === 'ceilings') {
        if (systemType.ceilingsType === 's') {
            label = xlUtils.message('height_ceilings_s', language);
        } else {
            label = xlUtils.message('height_ceilings_ss', language);
        }
    }
    return label;
}

const getHeight = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = '';
    if (systemType.type === 'ceilings') {
        label = `max ${ offer.height } cm`;
    } else {
        label = `max ${ offer.height } m`;
    }
    return label;
}

const getInteraxSustineri = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let interax = offer.interaxSustineri || '0';

    if (interax) {
        if (interax === '250') {
            label = `${ interax } / vinclu`;
        } else if (interax === '125') {
            label = `${ interax } / bride`;
        } else if ([' ', '0', '1'].includes(interax)) {
            label = 'fara';
        } else {
            label = `max ${ interax } m`;
        }

        let systemType = systemService.getSystemType(offer);
        if (systemType.linningsType === 'l') {
            label = `latime max ${ interax } m`;
        }
    }

    return label;
}

const getWeight = (offer, language) => {
    let sumWeight = 0;
    offer.consumption.forEach(consumption => {
        if (consumption.codSap && consumption.codSap.includes('placa')) {
            return;
        }
        if (consumption.amount && consumption.weight) {
            sumWeight += consumption.amount * consumption.weight;
        }
    });

    return Math.round(sumWeight);
}

const getCeilingsHeader = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let profileHeader = '';
    if (systemType.ceilingsType === 's') {
        profileHeader = xlUtils.message('profile_type_primary', language);
    } else {
        profileHeader = xlUtils.message('profile_type', language);
    }
    return profileHeader;
}

const getCeilingsPrimaryProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    if (offer.profileType.includes('/')) {
        if (offer.profileType.split('/')[0] === '-') {
            return label;
        } else {
            label = offer.profileType.split('/')[0];
        }
    } else if (offer.profileType) {
        label = offer.profileType;
    }
    offer.consumption.forEach(el => {
        if (el.productName && el.productName.includes(label)) {
            label = el.productName;
        }
    });
    let interaxValue = offer.interax;
    if (offer.interax.includes('/')) {
        interaxValue = offer.interax.split('/')[0];
    }
    if (interaxValue.toLowerCase().includes('h')) {
        label += '-H @ ';
        label += interaxValue.slice(0, -1);
    } else {
        label += ' @ ';
        label += interaxValue;
    }
    return label;
}

const getCeilingsSecondaryProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    if (offer.profileType.includes('/')) {
        label = offer.profileType.split('/')[1];
    }
    offer.consumption.forEach(el => {
        if (el.productName && el.productName.includes(label)) {
            label = el.productName;
        }
    });
    let interaxValue = offer.interax;
    if (offer.interax.includes('/')) {
        interaxValue = offer.interax.split('/')[1];
    }
    if (interaxValue.toLowerCase().includes('h')) {
        label += '-H @ ';
        label += interaxValue.slice(0, -1);
    } else {
        label += ' @ ';
        label += interaxValue;
    }
    return label;
}

const getLinningsProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && el.productName.includes(offer.profileType) && (el.productName.includes('CW') || el.productName.includes('CD')));
    if (findProduct) {
        label = findProduct.productName;
        let interaxValue = offer.interax;
        if (interaxValue.toLowerCase().includes('h')) {
            label += '-H @ ';
            label += interaxValue.slice(0, -1);
        } else {
            label += ' @ ';
            label += interaxValue;
        }
    }
    return label;
}

const getLinningsNoisyProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let profileLabel = offer.profileType;
    if (offer.profileType.includes('/')) {
        profileLabel = offer.profileType.split('/')[0];
    }
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && el.productName.includes(profileLabel));
    if (findProduct) {
        label = findProduct.productName;
        let interaxValue = offer.interax;
        if (offer.interax.includes('/')) {
            interaxValue = offer.interax.split('/')[0];
        }
        if (interaxValue.toLowerCase().includes('h')) {
            label += '-H @ ';
            label += interaxValue.slice(0, -1);
        } else {
            label += ' @ ';
            label += interaxValue;
        }
    }
    return label;
}

const getLinningsLowerProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && (el.productName.includes('UW') || el.productName.includes('UD')));
    if (findProduct) { label = findProduct.productName; }
    return label;
}

const getLinningsUpperProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && (el.productName.includes(' UW ') || el.productName.includes(' UD ')));
    if (findProduct) {  label = findProduct.productName; }
    if (!findProduct) {
        let findProduct2 = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && (el.productName.includes('UW') || el.productName.includes('UD')));
        if (findProduct2) { label = findProduct2.productName; }
    }
    return label;
}

const getLinningsNoisyLowerProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && (el.productName.includes('UW') && !el.productName.includes(' UW ') || el.productName.includes('UD') && !el.productName.includes(' UD ')));
    if (findProduct) {
        label = findProduct.productName;
    }
    return label;
}

const getLinningsNoisyUpperProfile = (offer, language) => {
    let label = xlUtils.message('value_not_specified', language);
    let findProduct = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && el.productName.includes(' UW '));
    if (findProduct) {
        label = findProduct.productName;
    }
    if (!findProduct) {
        let findProduct2 = offer.consumption.find(el => ['1', '2'].includes(el.category) && el.productName && el.productName.includes('UW'));
        if (findProduct2) {
            label = findProduct2.productName;
        }
    }
    return label;
}

const getCeilingsAuxProfile = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = xlUtils.message('value_not_specified', language);
    if (systemType.ceilingsType === 's') {
        offer.consumption.forEach(el => {
            if (['1', '2'].includes(el.category) && el.productName && el.productName.includes('UD')) {
                label = el.productName;
            }
        });
    } else {
        offer.consumption.forEach(el => {
            if (['1', '2'].includes(el.category) && el.productName && el.productName.includes('UW')) {
                label = el.productName;
            }
        });
    }
    return label;
}

const getWallThickness = (offer) => {
    let thickness = offer.profileType.replace('CW', '') * 1;
    thickness += offer.face1.plate1.split(/[ ]+/).pop() * 1;
    thickness += offer.face2.plate1.split(/[ ]+/).pop() * 1;
    if (offer.face1.plate2) {
        thickness += offer.face1.plate2.split(/[ ]+/).pop() * 1;
        thickness += offer.face2.plate2.split(/[ ]+/).pop() * 1;
    }
    if (offer.face1.plate3) {
        thickness += offer.face1.plate3.split(/[ ]+/).pop() * 1;
        thickness += offer.face2.plate3.split(/[ ]+/).pop() * 1;
    }
    return thickness;
}

const getLiningsThickness = (offer) => {
    let offerInfo = xlUtils.getSystemType(offer);
    if (offerInfo.systemType === 'linings' && offerInfo.liningsType.includes('noisy')) {
        return '';
    } else {
        let thickness = offer.profileType.replace('CW', '') * 1;
        thickness += offer.platingPlates.plate1.split(/[ ]+/).pop() * 1;
        if (offer.platingPlates.plate2) {
            thickness += offer.platingPlates.plate2.split(/[ ]+/).pop() * 1;
        }
        if (offer.platingPlates.plate3) {
            thickness += offer.platingPlates.plate3.split(/[ ]+/).pop() * 1;
        }
        if (offer.platingPlates.plate4) {
            thickness += offer.platingPlates.plate4.split(/[ ]+/).pop() * 1;
        }
        return thickness.toString();
    }
}

const getProfileType = (offer) => {
    let profileLabel = '';
    let findProfile = offer.consumption.find(consumption => {
        if (consumption.productName && consumption.productName.includes(offer.profileType)) {
            return consumption;
        }
    });
    if (findProfile) {
        profileLabel += findProfile.productName;
    } else {
        profileLabel += offer.profileType;
    }
    profileLabel += ' / @ ';
    profileLabel += offer.interax;

    return profileLabel;
}

const getNoisyProfileTypeS1 = (offer) => {
    let profileLabel = '';
    let profileType = offer.profileType.split('/');
    let findProfile = offer.consumption.find(consumption => {
        if (consumption.productName && consumption.productName.includes(profileType[0])) {
            return consumption;
        }
    });
    if (findProfile) {
        profileLabel += findProfile.productName;
    } else {
        profileLabel += profileType[0];
    }
    profileLabel += ' / @ ';
    let interax = offer.interax.split('/');
    profileLabel += interax[0];

    return profileLabel;
}

const getNoisyProfileTypeS2 = (offer) => {
    let profileLabel = '';
    let profileType = offer.profileType.split('/');
    let findProfile = offer.consumption.find(consumption => {
        if (consumption.productName && consumption.productName.includes(profileType[1])) {
            return consumption;
        }
    });
    if (findProfile) {
        profileLabel += findProfile.productName;
    } else {
        profileLabel += profileType[1];
    }
    profileLabel += ' / @ ';
    let interax = offer.interax.split('/');
    profileLabel += interax[1];

    return profileLabel;
}

const getLowerGuiding = (offer) => {
    let profileType = offer.profileType;
    let lowerGuidingText = '';
    if (offer.profileType.includes('/')) {
        profileType = offer.profileType.split('/')[0];
    }
    if (profileType.includes('CW')) {
        profileType = profileType.replace('CW', 'UW');
        let findLowerGuiding = offer.consumption.find(consumption => {
            if (consumption.productName && consumption.productName.endsWith(profileType)) {
                return consumption;
            }
        });
        if (findLowerGuiding) {
            lowerGuidingText = findLowerGuiding.productName;
        }
    } else if (profileType.includes('CD')) {
        profileType = profileType.replace('CD', 'UD');
        profileType = profileType.replace('60', '30');
        let findLowerGuiding = offer.consumption.find(consumption => {
            if (consumption.productName && consumption.productName.endsWith(profileType)) {
                return consumption;
            }
        });
        if (findLowerGuiding) {
            lowerGuidingText = findLowerGuiding.productName;
        }
    }
    if (offer.profileType.includes('/')) {
        return '2x ' + lowerGuidingText;
    } else {
        return lowerGuidingText;
    }
}

const getUpperGuiding = (offer) => {
    let profileType = offer.profileType;
    let lowerGuidingText = '';
    if (offer.profileType.includes('/')) {
        profileType = offer.profileType.split('/')[0];
    }
    if (profileType.includes('CW')) {
        profileType = ' UW ';
        let findUpperGuiding = offer.consumption.find(consumption => {
            if (consumption.productName && consumption.productName.includes(profileType)) {
                return consumption;
            }
        });
        if (findUpperGuiding) {
            lowerGuidingText = findUpperGuiding.productName;
        }
    } else if (profileType.includes('CD')) {
        profileType = profileType.replace('CD', 'UD');
        profileType = ` ${ profileType } `;
        let findUpperGuiding = offer.consumption.find(consumption => {
            if (consumption.productName && consumption.productName.includes(profileType)) {
                return consumption;
            }
        });
        if (findUpperGuiding) {
            lowerGuidingText = findUpperGuiding.productName;
        }
    }
    if (offer.profileType.includes('/')) {
        return '2x ' + lowerGuidingText;
    } else {
        return lowerGuidingText;
    }
}

const getWallsPlatesFaceA = (offer) => {
    let arrayOfPlates = [];
    if (offer.face1.plate4) {
        arrayOfPlates.push(offer.face1.plate4);
    }
    if (offer.face1.plate3) {
        arrayOfPlates.push(offer.face1.plate3);
    }
    if (offer.face1.plate2) {
        arrayOfPlates.push(offer.face1.plate2);
    }
    if (offer.face1.plate1) {
        arrayOfPlates.push(offer.face1.plate1);
    }

    return getDuplicates(arrayOfPlates);
}

const getWallsPlatesFaceB = (offer) => {
    let arrayOfPlates = [];
    if (offer.face2.plate1) {
        arrayOfPlates.push(offer.face2.plate1);
    }
    if (offer.face2.plate2) {
        arrayOfPlates.push(offer.face2.plate2);
    }
    if (offer.face2.plate3) {
        arrayOfPlates.push(offer.face2.plate3);
    }
    if (offer.face2.plate4) {
        arrayOfPlates.push(offer.face2.plate4);
    }

    return getDuplicates(arrayOfPlates);
}

const getLinningsPlates = (offer) => {
    let arrayOfPlates = [];
    if (offer.platingPlates.plate1) {
        arrayOfPlates.push(offer.platingPlates.plate1);
    }
    if (offer.platingPlates.plate2) {
        arrayOfPlates.push(offer.platingPlates.plate2);
    }
    if (offer.platingPlates.plate3) {
        arrayOfPlates.push(offer.platingPlates.plate3);
    }
    if (offer.platingPlates.plate4) {
        arrayOfPlates.push(offer.platingPlates.plate4);
    }

    return getDuplicates(arrayOfPlates);
}

const getLiningsPlates = (offer) => {
    let offerInfo = xlUtils.getSystemType(offer);
    let arrayOfPlates = [offer.platingPlates.plate1];
    if (offerInfo.numberOfPlates === 'double' && offer.platingPlates.plate2) {
        arrayOfPlates.push(offer.platingPlates.plate2);
    }
    if (offerInfo.numberOfPlates === 'triple' && offer.platingPlates.plate2 && offer.platingPlates.plate3) {
        arrayOfPlates.push(offer.platingPlates.plate2);
        arrayOfPlates.push(offer.platingPlates.plate3);
    }
    if (offerInfo.numberOfPlates === 'quadruple' && offer.platingPlates.plate2 && offer.platingPlates.plate3 && offer.platingPlates.plate4) {
        arrayOfPlates.push(offer.platingPlates.plate2);
        arrayOfPlates.push(offer.platingPlates.plate3);
        arrayOfPlates.push(offer.platingPlates.plate4);
    }

    return getDuplicates(arrayOfPlates);
}

const getWoolType = (offer, language) => {
    let woolLabel = xlUtils.message('value_not_specified', language);
    let findWoolProduct = offer.consumption.find(consumption => {
        if (consumption.productName && consumption.productName.toLowerCase() && consumption.productName.toLowerCase().includes('vat')) {
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

const get3DImage = (offer) => {
    let systemType = systemService.getSystemType(offer);
    let path = `${ global.ROOT_PATH }/resources/3d/`;
    let label = '';

    if(systemType.type = 'walls') {
        systemType.wallsType = systemType.wallsType.replace('s', 'd');
        systemType.name = systemType.name.replace(' S ', ' ');
    }

    // category and subcategory
    if (systemType.type === 'ceilings') {
        path += `ceilings/ceilings_${ systemType.ceilingsType }`;
    } else if (systemType.type === 'linnings') {
        path += `linnings/linnings_${ systemType.linningsType }`;
    } else if (systemType.type === 'walls') {
        path += `walls/walls_${ systemType.wallsType }`;
    }
    label += systemType.name;

    // placari lipire
    if (systemType.type === 'linnings' && systemType.linningsType === 'p') {
        return {
            path: `${ path }.png`,
            label: label
        }
    }

    // rc4
    if (systemType.type === 'walls' && offer.burglaryResistance && offer.burglaryResistance === '4') {
        path += '_rc4';
        label += ' efractie';
    }

    if (systemType.type === 'walls' && systemType.wallsType === 's') {
        if (systemType.wallsType === 's') {
            if (systemType.separativiType === 'asimetric') {
                path += '_asimetric';
                label += ' asimetric';
            } else if (systemType.separativiType === 'intermediar') {
                path += '_intermediar';
                path += `_plates_${systemType.numberOfPlates}`;
                label += ` intermediar`;
            } else {
                path += `_plates_${systemType.numberOfPlates}`;
            }
        }
    } else {
        path += `_plates_${ systemType.numberOfPlates }`;
    }

    if (systemType.type === 'ceilings') {
        // plafoane suspendate
        if (systemType.ceilingsType === 's') {
            // tip suport
            if (offer.ceilingSupport) {
                if (offer.ceilingSupport.toLowerCase() === 'autoportant') {
                    path += `_support_0`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'brida') {
                    path += `_support_1`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'tirant') {
                    path += `_support_2`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'nonius') {
                    path += `_support_3`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'tija m8') {
                    path += `_support_4`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'racord lemn') {
                    path += `_support_5`;
                    label += ` ${ offer.ceilingSupport }`;
                } else if (offer.ceilingSupport.toLowerCase() === 'brida ac') {
                    path += `_support_6`;
                    label += ` ${ offer.ceilingSupport }`;
                }
            }

            // profile metalice
            if (offer.profileType.includes('/')) {
                let splitProfileType = offer.profileType.split('/');
                if (splitProfileType[0].toLowerCase().includes('cd')) {
                    path += '_profile_cd';
                    label += ' CD/';
                } else if (splitProfileType[0].toLowerCase().includes('ua')) {
                    path += '_profile_ua';
                    label += ' UA/';
                } else {
                    path += '_profile_0';
                    label += ' 0/';
                }
                if (splitProfileType[1].toLowerCase().includes('cd')) {
                    path += '_cd';
                    label += 'CD';
                } else if (splitProfileType[0].toLowerCase().includes('ua')) {
                    path += '_ua';
                    label += 'UA';
                } else {
                    path += '_profile_0';
                    label += '0';
                }
            }

            // vata
            if (offer.soundInsulation.toLowerCase().includes('da')) {
                path += '_wool_yes';
                label += ' cu vata';
            } else {
                path += '_wool_no';
                label += ' fara vata';
            }

            return {
                path: `${ path }.png`,
                label: label
            }
        }

        if (systemType.ceilingsType === 'ss') {
            if (offer && offer.protectionSense) {
                if (offer.protectionSense === '1') {
                    path += '_direction_1';
                    label += ' sens js';
                } else if (offer.protectionSense === '2') {
                    path += '_direction_2';
                    label += ' sens sj';
                } else if (offer.protectionSense === '3') {
                    path += '_direction_3';
                    label += ' sens sjs';
                }
            }

            // profile metalice
            if (offer.profileType.toLowerCase().includes('cw')) {
                path += '_profile_cw';
                label += ' CW';
            } else if (offer.profileType.toLowerCase().includes('ua')) {
                path += '_profile_ua';
                label += ' UA';
            }

            // interax
            if (offer.interax.includes('H')) {
                path += '_interax_d';
                label += ' H';
            } else {
                path += '_interax_s';
            }

            // vata
            if (offer.soundInsulation.toLowerCase().includes('da')) {
                path += '_wool_yes';
                label += ' cu vata';
            } else {
                path += '_wool_no';
                label += ' fara vata';
            }

            console.log(path);

            return {
                path: `${ path }.png`,
                label: label
            }
        }
    }

    if (systemType.type === 'linnings') {
        // placari liniare / placari noisy UU
        if (systemType.linningsType === 'l' || systemType.linningsType === 'nuu') {
            return {
                path: `${ path }.png`,
                label: label
            }
        }

        // placari fixari - placari independente
        if (systemType.linningsType === 'f' || systemType.linningsType === 'i') {
            // profile metalice
            if (offer.profileType.toLowerCase().includes('cw')) {
                path += '_profile_cw';
                label += ' CW';
            } else if (offer.profileType.toLowerCase().includes('cd')) {
                path += '_profile_cd';
                label += ' CD';
            }

            // interax
            if (offer.interax.includes('H')) {
                path += '_interax_d';
                label += ' H';
            } else {
                path += '_interax_s';
            }

            // vata
            if (offer.soundInsulation.toLowerCase().includes('da')) {
                path += '_wool_yes';
                label += ' cu vata';
            } else {
                path += '_wool_no';
                label += ' fara vata';
            }

            return {
                path: `${ path }.png`,
                label: label
            }
        }

        // placari noisy fixari - placari noisy independente
        if (systemType.linningsType === 'nf' || systemType.linningsType === 'ni') {
            // profile metalice / interax
            if (offer.profileType.includes('/') && offer.interax.includes('/')) {
                let splitInterax = offer.interax.split('/');
                if (splitInterax[0].includes('H')) {
                    path += '_profile_cwh';
                    label += ' CWH/';
                } else {
                    path += '_profile_cw';
                    label += ' CW/';
                }
                if (splitInterax[1].includes('H')) {
                    path += '_cwh';
                    label += 'CWH';
                } else {
                    path += '_cw';
                    label += 'CW';
                }
            }

            // vata
            if (offer.soundInsulation.toLowerCase().includes('da')) {
                path += '_wool_yes';
                label += ' cu vata';
            } else {
                path += '_wool_no';
                label += ' fara vata';
            }

            return {
                path: `${ path }.png`,
                label: label
            }
        }
    }

    if (systemType.type === 'walls') {
        // interax
        if (offer.interax.includes('H')) {
            path += '_interax_d';
            label += ' H';
        } else {
            path += '_interax_s';
        }

        // vata
        if (offer.soundInsulation.toLowerCase().includes('da')) {
            path += '_wool_yes';
            label += ' cu vata';
        } else {
            path += '_wool_no';
            label += ' fara vata';
        }

        return {
            path: `${ path }.png`,
            label: label
        }
    }

    return null;
}

const getDuplicates = (array) => {
    let stringOfPlates = '';
    let counts = {};
    array.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    for (const [key, value] of Object.entries(counts)) {
        stringOfPlates += `${ value }x ${ key }, `;
    }
    stringOfPlates = stringOfPlates.slice(0, -2);

    return stringOfPlates;
}

module.exports = {
    getFireResistance,
    getDirection,
    getMoistureResistance,
    getHeightHeader,
    getHeight,
    getInteraxSustineri,
    getWeight,
    getCeilingsHeader,
    getCeilingsPrimaryProfile,
    getCeilingsSecondaryProfile,
    getLinningsProfile,
    getLinningsNoisyProfile,
    getLinningsLowerProfile,
    getLinningsUpperProfile,
    getLinningsNoisyLowerProfile,
    getLinningsNoisyUpperProfile,
    getCeilingsAuxProfile,
    getWallsPlatesFaceA,
    getWallsPlatesFaceB,
    getLinningsPlates,
    getWoolType,
    get3DImage
};