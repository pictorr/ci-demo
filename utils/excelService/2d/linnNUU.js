const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnNUU = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);

    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_nuu';

    // number of plates
    if (offerInfo.numberOfPlates === 't') {
        basePath += '_plates_t';
    } else if (offerInfo.numberOfPlates === 'd') {
        basePath += '_plates_d';
    }

    // set logo
    row = xlUtils.setLogoNoSpace(ws, row);

    // first path
    let pathFirst = basePath;
    if (offer.interax.split('/')[0].toLowerCase().includes('h')) {
        pathFirst += '_interax_d';
    } else {
        pathFirst += '_interax_s';
    }
    if (offer.interax.split('/')[1].toLowerCase().includes('h')) {
        pathFirst += '_d';
    } else {
        pathFirst += '_s';
    }
    pathFirst += '.png';

    // FILES
    // linnings_nuu_plates_d_interax_d_d => 1660 / 977 = 1.70
    // linnings_nuu_plates_t_interax_d_d => 1630 / 961 = 1.70

    let colStartFirst = 2;
    let colEndFirst = 9;
    let rowEndFirst = 20;
    // c2-9 / r18 => 5.69 / 3.33 = 1.71

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
    // linnings_nuu_plates_d_concrete_fr-eq0 => 762 / 985 = 0.77
    // linnings_nuu_plates_d_concrete_fr-ne0_ht-lte5 => 756 / 976 = 0.77
    // linnings_nuu_plates_d_concrete_fr-ne0_ht-gt5 => 756 / 975 = 0.77
    // linnings_nuu_plates_t_concrete_fr-eq0 => 765 / 985 = 0.77
    // linnings_nuu_plates_t_concrete_fr-ne0_ht-lte5 => 758 / 977 = 0.77
    // linnings_nuu_plates_t_concrete_fr-ne0_ht-gt5 => 757 / 976 = 0.77

    let colStartSecond = 3;
    let colEndSecond = 7;
    let rowEndSecond = 29;
    // c3-7 / r29 => 4.23 / 4.17 = 0.77

    if (fs.existsSync(pathSecond)) {
        xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartSecond, row + rowEndSecond, colEndSecond);
        row = row + rowEndSecond + 1;
    }

    // set page break
    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setLinnNUU
};