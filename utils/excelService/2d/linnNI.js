const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnNI = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);

    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_ni';

    // number of plates
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
        // linnings_ni_plates_s_interax_s_s => 1793 / 979 = 1.83
        // linnings_ni_plates_s_interax_s_d => 1803 / 988 = 1.82
        // linnings_ni_plates_s_interax_d_s => 1750 / 959 = 1.82
        // linnings_ni_plates_s_interax_d_d => 1783 / 977 = 1.82
        // linnings_ni_plates_d_interax_s_s => 1746 / 975 = 1.79
        // linnings_ni_plates_d_interax_s_d => 1760 / 981 = 1.79
        // linnings_ni_plates_d_interax_d_s => 1760 / 981 = 1.79
        // linnings_ni_plates_d_interax_d_d => 1756 / 979 = 1.79
        // linnings_ni_plates_t_interax_s_s => 1750 / 981 = 1.78
        // linnings_ni_plates_t_interax_s_d => 1752 / 982 = 1.78
        // linnings_ni_plates_t_interax_d_s => 1750 / 979 = 1.78
        // linnings_ni_plates_t_interax_d_d => 1751 / 981 = 1.78

        let colStartFirst = 2;
        let colEndFirst = 9;
        let rowEndFirst = 19;
        // c2-9 / r19 => 5.69 / 3.17 = 1.79
        if (offerInfo.numberOfPlates === 's') {
            colEndFirst = 8;
            rowEndFirst = 17;
        }
        // c2-8 / r17 => 5.16 / 2.83 = 1.82

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
        // linnings_ni_plates_s_concrete_fr-eq0 => 998 / 971 = 1.03
        // linnings_ni_plates_s_concrete_fr-ne0_ht-lte5 => 998 / 971 = 1.03
        // linnings_ni_plates_s_concrete_fr-ne0_ht-gt5 => 1001 / 976 = 1.03
        // linnings_ni_plates_d_concrete_fr-eq0 => 998 / 971 = 1.03
        // linnings_ni_plates_d_concrete_fr-ne0_ht-lte5 => 998 / 971 = 1.03
        // linnings_ni_plates_d_concrete_fr-ne0_ht-gt5 => 1007 / 980 = 1.03
        // linnings_ni_plates_t_concrete_fr-eq0 => 979 / 976 = 1.00
        // linnings_ni_plates_t_concrete_fr-ne0_ht-lte5 => 979 / 976 = 1.00
        // linnings_ni_plates_t_concrete_fr-ne0_ht-gt5 => 987 / 979 = 1.01

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 25;
        // c3-8 / r25 => 4.23 / 4.17 = 1.01

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
        // linnings_ni_plates_s_interax_s_s => 1793 / 979 = 1.83
        // linnings_ni_plates_s_interax_s_d => 1803 / 988 = 1.82
        // linnings_ni_plates_s_interax_d_s => 1750 / 959 = 1.82
        // linnings_ni_plates_s_interax_d_d => 1783 / 977 = 1.82
        // linnings_ni_plates_d_interax_s_s => 1746 / 975 = 1.79
        // linnings_ni_plates_d_interax_s_d => 1760 / 981 = 1.79
        // linnings_ni_plates_d_interax_d_s => 1760 / 981 = 1.79
        // linnings_ni_plates_d_interax_d_d => 1756 / 979 = 1.79
        // linnings_ni_plates_t_interax_s_s => 1750 / 981 = 1.78
        // linnings_ni_plates_t_interax_s_d => 1752 / 982 = 1.78
        // linnings_ni_plates_t_interax_d_s => 1750 / 979 = 1.78
        // linnings_ni_plates_t_interax_d_d => 1751 / 981 = 1.78

        let colStartFirst = 2;
        let colEndFirst = 9;
        let rowEndFirst = 19;
        // c2-9 / r19 => 5.69 / 3.17 = 1.79
        if (offerInfo.numberOfPlates === 's') {
            colEndFirst = 8;
            rowEndFirst = 17;
        }
        // c2-8 / r17 => 5.16 / 2.83 = 1.82

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
        // linnings_ni_plates_s_sheet_fr-eq0 => 981 / 983 = 1.00
        // linnings_ni_plates_s_sheet_fr-eq0_img2 => 939 / 984 = 0.95
        // linnings_ni_plates_s_sheet_fr-ne0 => 983 / 987 = 1.00
        // linnings_ni_plates_s_sheet_fr-ne0_img2 => 938 / 984 = 0.95
        // linnings_ni_plates_d_sheet_fr-eq0 => 981 / 983 = 1.00
        // linnings_ni_plates_d_sheet_fr-eq0_img2 => 756 / 792 = 0.95
        // linnings_ni_plates_d_sheet_fr-ne0 => 977 / 979 = 1.00
        // linnings_ni_plates_d_sheet_fr-ne0_img2 => 936 / 982 = 0.95
        // linnings_ni_plates_t_sheet_fr-eq0 => 971 / 972 = 1.00
        // linnings_ni_plates_t_sheet_fr-eq0_img2 => 932 / 978 = 0.95
        // linnings_ni_plates_t_sheet_fr-ne0 => 972 / 975 = 1.00
        // linnings_ni_plates_t_sheet_fr-ne0_img2 => 932 / 978 = 0.95

        let pathSecond1 = `${pathSecond}.png`;
        let pathSecond2 = `${pathSecond}_img2.png`;

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 25;
        let rowEndSecond2 = 27;
        // c3-8 / r25 => 4.23 / 4.17 = 1.01
        // c3-8 / r27 => 4.23 / 4.50 = 0.94

        if (fs.existsSync(pathSecond1)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            row = row + rowEndSecond;
        }
        if (fs.existsSync(pathSecond2)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond2, row, colStartSecond, row + rowEndSecond2, colEndSecond);
            row = row + rowEndSecond2 + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);
    }

    return row;
}

module.exports = {
    setLinnNI
};