const xl = require('excel4node');
const xlUtils = require('./excelUtils');
const systemService = require('../systemService');

const wallsRc = require('./2d/wallsRc');
const wallsD = require('./2d/wallsD');
const wallsS = require('./2d/wallsS');
const wallsSl = require('./2d/wallsSl');
const wallsSla = require('./2d/wallsSla');

const linnF = require('./2d/linnF');
const linnI = require('./2d/linnI');
const linnL = require('./2d/linnL');
const linnP = require('./2d/linnP');
const linnNF = require('./2d/linnNF');
const linnNI = require('./2d/linnNI');
const linnNUU = require('./2d/linnNUU');

const ceilS = require('./2d/ceilS');

// main function
const setImages = (ws, row, offer, products, language) => {
    let offerInfo = systemService.getSystemType(offer);

    if (offerInfo.type === 'walls') {
        offerInfo.wallsType = offerInfo.wallsType.replace('s', 'd');
        offerInfo.name = offerInfo.name.replace(' S ', ' ');

        if (offer.burglaryResistance && offer.burglaryResistance === '4') {
            row = wallsRc.setWallsRc(ws, row, offer, products, language);
        } else if (offerInfo.wallsType === 'd') {
            row = wallsD.setWallsD(ws, row, offer, products, language);
        } else if (offerInfo.wallsType === 's' || offerInfo.wallsType === 'ss') {
            row = wallsS.setWallsS(ws, row, offer, products, language);
        } else if (offerInfo.wallsType === 'sl') {
            row = wallsSl.setWallsSl(ws, row, offer, products, language);
        } else if (offerInfo.wallsType === 'sla') {
            row = wallsSla.setWallsSla(ws, row, offer, products, language);
        }
    }

    if (offerInfo.type === 'linnings') {
        if (offerInfo.linningsType === 'f') {
            row = linnF.setLinnF(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'i') {
            row = linnI.setLinnI(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'l') {
            row = linnL.setLinnL(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'p') {
            row = linnP.setLinnP(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'nf') {
            row = linnNF.setLinnNF(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'ni') {
            row = linnNI.setLinnNI(ws, row, offer, products, language);
        } else if (offerInfo.linningsType === 'nuu') {
            row = linnNUU.setLinnNUU(ws, row, offer, products, language);
        }
    }

    if (offerInfo.type === 'ceilings') {
        if (offerInfo.ceilingsType === 's') {
            row = ceilS.setCeilS(ws, row, offer, products, language);
        }
    }

    return row;
}

module.exports = {
    setImages
};