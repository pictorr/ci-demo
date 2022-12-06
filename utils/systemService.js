const utilityService = require('./utilityService.js');

// ceiling support
// 0 - autoportant
// 1 - brida
// 2 - tirant
// 3 - nonius
// 4 - tija m8
// 5 - racord lemn
// 6 - brida ac

const systemObj = {
    type: '',
    numberOfPlates: '',
    wallsType: '',
    separativiType: '',
    linningsType: '',
    ceilingsType: '',
    name: ''
}

const getSystemType = (offer) => {
    let offerInfo = {...systemObj};

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
        if (offer.systemName.toLowerCase().includes('pereti sla')) {
            offerInfo.wallsType = 'sla';
            offerInfo.name += ' SLA';
        } else if (offer.systemName.toLowerCase().includes('pereti sl')) {
            offerInfo.wallsType = 'sl';
            offerInfo.name += ' SL';
        } else if (offer.systemName.toLowerCase().includes('pereti ss') || offer.systemName.toLowerCase().includes('pereti s')) {
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

module.exports = {
    getSystemType
};