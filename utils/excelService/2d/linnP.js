const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnP = (ws, row, offer, products, language) => {
    let pathFirst = `${global.ROOT_PATH}/resources/2d/linnings/`;
    pathFirst += 'linnings_p' + '_plates_s' + '.png';

    // FILES
    // linnings_p_plates_s => 1883 / 964 = 1.95

    let colStartFirst = 1;
    let colEndFirst = 10;
    let rowEndFirst = 20;
    // c1-10 / r21 => 6.80 / 3.50 = 1.94

    if (fs.existsSync(pathFirst)) {
        xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
        row = row + rowEndFirst + 1;
    }

    // set page break
    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setLinnP
};