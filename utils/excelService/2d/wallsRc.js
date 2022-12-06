const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setWallsRc = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/walls/`;
    basePath += 'walls_rc4';
    if (offerInfo.numberOfPlates === 't') {
        basePath += '_plates_t';
    } else if (offerInfo.numberOfPlates === 'd') {
        basePath += '_plates_d';
    } else if (offerInfo.numberOfPlates === 's') {
        basePath += '_plates_s';
    }

    // set one page for "concrete" support
    if (offer.support.toLowerCase().includes('beton')) {
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
        // walls_rc4_plates_d_interax_d => 1595 / 970 = 1.64
        // walls_rc4_plates_t_interax_d => 1586 / 980 = 1.64

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 24;
        //  c2-10 / r24 => 6.49 / 4.00 = 1.62

        if (fs.existsSync(pathFirst)) {
            xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
            row = row + rowEndFirst + 1;
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
        // walls_rc4_plates_d_concrete_fr-eq0.png => 845 / 964 = 0.88
        // walls_rc4_plates_d_concrete_fr-ne0_ht-lte5.png => 845 / 964 = 0.88
        // walls_rc4_plates_d_concrete_fr-ne0_ht-gt5.png => 814 / 972 = 0.84
        // walls_rc4_plates_t_concrete_fr-eq0.png => 854 / 974 = 0.88
        // walls_rc4_plates_t_concrete_fr-ne0_ht-lte5.png => 845 / 964 = 0.88
        // walls_rc4_plates_t_concrete_fr-ne0_ht-gt5.png => 809 / 970 = 0.83

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 30;
        if (offer.fireResistance.slice(0, -1) !== '0' && offer.height > 5) { rowEndSecond = 29; }
        // c3-8 / r29 => 4.23 / 4.83 = 0.88
        // c3-8 / r30 => 4.23 / 5.00 = 0.85

        if (fs.existsSync(pathSecond)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartSecond, row + rowEndSecond, colEndSecond);
            row = row + rowEndSecond + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);
    }

    // set two pages for "sheet" support
    if (offer.support.toLowerCase().includes('tabla')) {
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
        // walls_rc4_plates_d_interax_d => 1595 / 970 = 1.64
        // walls_rc4_plates_t_interax_d => 1586 / 980 = 1.64

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 24;
        //  c2-10 / r24 => 6.49 / 4.00 = 1.62

        if (fs.existsSync(pathFirst)) {
            xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
            row = row + rowEndFirst + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);

        // set logo
        row = xlUtils.setLogoNoSpace(ws, row);

        // second path
        let pathSecond = basePath;
        pathSecond += '_sheet';

        if (offer.fireResistance.slice(0, -1) === '0') {
            pathSecond += '_fr-eq0';
        } else {
            pathSecond += '_fr-ne0';
        }

        // FILES
        // walls_rc4_plates_d_sheet_fr-eq0.png => 821 / 979 = 0.84
        // walls_rc4_plates_d_sheet_fr-eq0_img2.png => 796 / 981 = 0.81
        // walls_rc4_plates_d_sheet_fr-ne0.png => 821 / 979 = 0.84
        // walls_rc4_plates_d_sheet_fr-ne0_img2.png => 796 / 981 = 0.81
        // walls_rc4_plates_t_sheet_fr-eq0.png => 784 / 985 = 0.80
        // walls_rc4_plates_t_sheet_fr-eq0_img2.png => 771 / 973 = 0.79
        // walls_rc4_plates_t_sheet_fr-ne0.png => 784 / 985 = 0.80
        // walls_rc4_plates_t_sheet_fr-ne0_img2.png => 771 / 973 = 0.79

        let pathSecond1 = `${pathSecond}.png`;
        let pathSecond2 = `${pathSecond}_img2.png`;

        let colStartSecond = 3;
        let colEndSecond = 7;
        let rowEndSecond = 27;
        // c3-7 / r27 => 3.71 / 4.50 = 0.82

        if (fs.existsSync(pathSecond1)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            row = row + rowEndSecond;
        }
        if (fs.existsSync(pathSecond2)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond2, row, colStartSecond, row + rowEndSecond, colEndSecond);
            row = row + rowEndSecond + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);
    }

    return row;
}

module.exports = {
    setWallsRc
};