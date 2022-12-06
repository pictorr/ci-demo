const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setWallsS = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/walls/`;
    basePath += 'walls_s';

    if (offerInfo.separativiType && offerInfo.separativiType === 'asimetric') {
        basePath += '_asimetric';
    }
    if (offerInfo.separativiType && offerInfo.separativiType === 'intermediar') {
        basePath += '_intermediar';
    }
    if (offerInfo.separativiType && offerInfo.separativiType !== 'asimetric') {
        if (offerInfo.numberOfPlates === 't') {
            basePath += '_plates_t';
        } else if (offerInfo.numberOfPlates === 'd') {
            basePath += '_plates_d';
        } else if (offerInfo.numberOfPlates === 's') {
            basePath += '_plates_s';
        }
    }

    // set logo
    row = xlUtils.setLogoNoSpace(ws, row);

    // first path
    let pathFirst = basePath;
    if (offer.interax.toLowerCase().includes('h')) {
        pathFirst += '_interax_d';
    } else {
        pathFirst += '_interax_s';
    }
    pathFirst += '.png';

    // FILES
    // walls_s_plates_d_interax_s => 735 / 573 = 1.28
    // walls_s_plates_d_interax_d => 702 / 547 = 1.28
    // walls_s_plates_t_interax_s => 738 / 573 = 1.29
    // walls_s_plates_t_interax_d => 727 / 551 = 1.32
    // walls_s_intermediar_plates_d_interax_s => 1263 / 977 = 1.29
    // walls_s_intermediar_plates_d_interax_d => 1260 / 975 = 1.29
    // walls_s_intermediar_plates_t_interax_s => 1263 / 997 = 1.27
    // walls_s_intermediar_plates_t_interax_d => 1266 / 981 = 1.29
    // walls_s_asimetric_interax_s => 1287 => 981 = 1.31
    // walls_s_asimetric_interax_d => 1285 => 978 = 1.31

    let colStartFirst = 2;
    let colEndFirst = 8;
    let rowEndFirst = 23;
    //  c2-8 / r23 => 5.16 / 3.83 = 1.29

    if (fs.existsSync(pathFirst)) {
        xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
        row = row + rowEndFirst;
    }

    // second path
    let pathSecond = basePath;
    pathSecond += '_concrete';

    if (offer.fireResistance.slice(0, -1) === '0') {
        pathSecond += '_fr-eq0';
    } else {
        pathSecond += '_fr-ne0';
        if (offer.height <= 5) {
            pathSecond += '_ht-lte5';
        } else {
            pathSecond += '_ht-gt5';
        }
    }
    pathSecond += '.png';

    // FILES
    // walls_s_plates_d_concrete_fr-eq0 => 565 / 593 = 0.95
    // walls_s_plates_d_concrete_fr-ne0_ht-lte5 => 565 / 593 = 0.95
    // walls_s_plates_d_concrete_fr-ne0_ht-gt5 => 474 / 595 = 0.80
    // walls_s_plates_t_concrete_fr-eq0 => 549 / 589 = 0.93
    // walls_s_plates_t_concrete_fr-ne0_ht-lte5 => 549 / 589 = 0.93
    // walls_s_plates_t_concrete_fr-ne0_ht-gt5 => 513 / 589 = 0.87
    // walls_s_intermediar_plates_d_concrete_fr-eq0 => 970 / 974 = 1.00
    // walls_s_intermediar_plates_d_concrete_fr-ne0_ht-lte5 => 970 / 974 = 1.00
    // walls_s_intermediar_plates_d_concrete_fr-ne0_ht-gt5 => 860 / 976 = 0.88
    // walls_s_intermediar_plates_t_concrete_fr-eq0 => 943 / 978 = 0.96
    // walls_s_intermediar_plates_t_concrete_fr-ne0_ht-lte5 => 943 / 978 = 0.96
    // walls_s_intermediar_plates_t_concrete_fr-ne0_ht-gt5 => 883 / 980 = 0.90
    // walls_s_asimetric_concrete_fr-eq0 => 927 / 978 = 0.95
    // walls_s_asimetric_concrete_fr-ne0_ht-lte5 => 927 / 978 = 0.95
    // walls_s_asimetric_concrete_fr-ne0_ht-gt5 => 869 / 980 = 0.89

    let colStartSecond = 3;
    let colEndSecond = 7;
    let rowEndSecond = 23;
    // c3-7 / r22 => 3.71 / 3.67 = 1.01
    // c3-7 / r23 => 3.71 / 3.83 = 0.97
    // c3-7 / r24 => 3.71 / 4.00 = 0.93
    // c3-7 / r25 => 3.71 / 4.17 = 0.89
    // c3-7 / r26 => 3.71 / 4.33 = 0.86
    // c3-7 / r27 => 3.71 / 4.50 = 0.82
    // c3-7 / r28 => 3.71 / 4.67 = 0.79

    let fileNameNoExtension = pathSecond.replace(`${global.ROOT_PATH}/resources/2d/walls/`, '');
    fileNameNoExtension = fileNameNoExtension.replace('.png', '');

    switch (fileNameNoExtension) {
        case 'walls_s_plates_d_concrete_fr-ne0_ht-gt5':
            rowEndSecond = 28;
            break;
        case 'walls_s_plates_t_concrete_fr-ne0_ht-gt5':
            rowEndSecond = 26;
            break;
        case 'walls_s_intermediar_plates_d_concrete_fr-ne0_ht-gt5':
        case 'walls_s_intermediar_plates_t_concrete_fr-ne0_ht-gt5':
        case 'walls_s_asimetric_concrete_fr-ne0_ht-gt5':
            rowEndSecond = 25;
            break;
        case 'walls_s_plates_d_concrete_fr-ne0_ht-lte5':
        case 'walls_s_plates_t_concrete_fr-eq0':
        case 'walls_s_plates_t_concrete_fr-ne0_ht-lte5':
        case 'walls_s_asimetric_concrete_fr-eq0':
        case 'walls_s_asimetric_concrete_fr-ne0_ht-lte5':
            rowEndSecond = 24;
            break;
        case 'walls_s_intermediar_plates_d_concrete_fr-eq0':
        case 'walls_s_intermediar_plates_d_concrete_fr-ne0_ht-lte5':
            rowEndSecond = 22;
            break;
    }

    if (fs.existsSync(pathSecond)) {
        xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartSecond, row + rowEndSecond, colEndSecond);
        row = row + rowEndSecond + 1;
    }

    // set page break
    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setWallsS
};