const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setWallsSla = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/walls/`;
    basePath += 'walls_sla';

    if (offerInfo.numberOfPlates === 't') {
        basePath += '_plates_t';
    } else if (offerInfo.numberOfPlates === 'd') {
        basePath += '_plates_d';
    } else if (offerInfo.numberOfPlates === 's') {
        basePath += '_plates_s';
    }

    // page one

    // set logo
    row = xlUtils.setLogoNoSpace(ws, row);

    // first path
    let pathFirst = basePath;
    if (offer.interax.toLowerCase().includes('h')) {
        pathFirst += '_interax_d';
    } else {
        pathFirst += '_interax_s';
    }
    let pathSecond = pathFirst + '_img2' + '.png';
    pathFirst += '.png';

    // FILES
    // walls_sla_plates_t_interax_d => 1317 / 969 = 1.36
    // walls_sla_plates_t_interax_d_img2 => 644 / 970 = 0.66

    let colStartFirst = 2;
    let colEndFirst = 8;
    let rowEndFirst = 22;
    //  c2-8 / r22 => 5.16 / 3.67 = 1.40

    if (fs.existsSync(pathFirst)) {
        xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
        row = row + rowEndFirst;
    }

    let colStartFirst2 = 3;
    let colEndFirst2 = 7;
    let rowEndFirst2 = 33;
    //  c2-8 / r23 => 5.16 / 3.83 = 1.29

    if (fs.existsSync(pathSecond)) {
        xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartFirst2, row + rowEndFirst2, colEndFirst2);
        row = row + rowEndFirst2 + 1;
    }

    // set page break
    ws.addPageBreak('row', row - 1);

    // page two
    // walls_sla_plates_t_concrete_fr-ne0 => 785 / 987 = 0.80
    // walls_sla_plates_t_sheet_fr-ne0 => 1091 / 984 = 1.11
    // walls_sla_plates_t_sheet_fr-ne0_img2 => 1065 / 986 = 1.08

    if (offer.support.toLowerCase().includes('beton')) {
        let path3 = basePath + '_concrete' + '_fr-ne0' + '.png';

        let colStartFirst3 = 3;
        let colEndFirst3 = 7;
        let rowEndFirst3 = 28;
        //  c3-7 / r28 => 3.71 / 4.67 = 0.79

        if (fs.existsSync(path3)) {
            xlUtils.addTwoCellAnchorImage(ws, path3, row, colStartFirst3, row + rowEndFirst3, colEndFirst3);
            row = row + rowEndFirst3 + 1;
        }
    }

    if (offer.support.toLowerCase().includes('tabla')) {
        let path3 = basePath + '_sheet' + '_fr-ne0' + '.png';
        let path4 = basePath + '_sheet' + '_fr-ne0' + '_img2' + '.png';

        let colStartFirst3 = 3;
        let colEndFirst3 = 8;
        let rowEndFirst3 = 23;
        //  c3-7 / r28 => 3.71 / 4.67 = 0.79

        if (fs.existsSync(path3)) {
            xlUtils.addTwoCellAnchorImage(ws, path3, row, colStartFirst3, row + rowEndFirst3, colEndFirst3);
            row = row + rowEndFirst3;
        }

        let colStartFirst4 = 3;
        let colEndFirst4 = 8;
        let rowEndFirst4 = 23;
        //  c3-7 / r28 => 3.71 / 4.67 = 0.79

        if (fs.existsSync(path4)) {
            xlUtils.addTwoCellAnchorImage(ws, path4, row, colStartFirst4, row + rowEndFirst4, colEndFirst4);
            row = row + rowEndFirst4 + 1;
        }
    }

    return row;
}

module.exports = {
    setWallsSla
};