const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnL = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_l';
    if (offerInfo.numberOfPlates === 'q') {
        basePath += '_plates_q';
    } else if (offerInfo.numberOfPlates === 't') {
        basePath += '_plates_t';
    } else if (offerInfo.numberOfPlates === 'd') {
        basePath += '_plates_d';
    }

    // set logo
    row = xlUtils.setLogoNoSpace(ws, row);

    // first path
    let pathFirst = basePath;
    pathFirst += '.png';

    // FILES
    // linnings_i_plates_d => 1567 / 979 = 1.60
    // linnings_i_plates_t => 1571 / 980 = 1.60
    // linnings_i_plates_q => 1577 / 984 = 1.60

    let colStartFirst = 2;
    let colEndFirst = 10;
    let rowEndFirst = 24;
    // c2-10 / r24 => 6.49 / 4.00 = 1.62

    if (fs.existsSync(pathFirst)) {
        xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
        row = row + rowEndFirst + 1;
    }

    // set page break
    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setLinnL
};