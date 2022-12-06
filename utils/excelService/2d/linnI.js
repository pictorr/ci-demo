const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnI = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_i';
    if (offerInfo.numberOfPlates === 'q') {
        basePath += '_plates_q';
    } else if (offerInfo.numberOfPlates === 't') {
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
        // linnings_i_plates_s_interax_s => 1460 / 971 = 1.50
        // linnings_i_plates_s_interax_d => 1469 / 975 = 1.51
        // linnings_i_plates_d_interax_s => 1472 / 977 = 1.51
        // linnings_i_plates_d_interax_d => 1474 / 979 = 1.51
        // linnings_i_plates_t_interax_s => 1486 / 988 = 1.50
        // linnings_i_plates_t_interax_d => 1475 / 982 = 1.50
        // linnings_i_plates_q_interax_s => 1474 / 980 = 1.50
        // linnings_i_plates_q_interax_d => 1471 / 978 = 1.50

        let colStartFirst = 2;
        let colEndFirst = 9;
        let rowEndFirst = 23;
        // c2-9 / r23 => 5.69 / 3.83 = 1.49

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
        // linnings_i_plates_s_concrete_fr-eq0 => 820 / 975 = 0.84
        // linnings_i_plates_s_concrete_fr-ne0_ht-lte5 => 819 / 975 = 0.84
        // linnings_i_plates_s_concrete_fr-ne0_ht-gt5 => 821 / 979 = 0.84
        // linnings_i_plates_d_concrete_fr-eq0 => 819 / 974 = 0.84
        // linnings_i_plates_d_concrete_fr-ne0_ht-lte5 => 820 / 975 = 0.84
        // linnings_i_plates_d_concrete_fr-ne0_ht-gt5 => 824 / 982 = 0.84
        // linnings_i_plates_t_concrete_fr-eq0 => 943 / 978 = 0.96
        // linnings_i_plates_t_concrete_fr-ne0_ht-lte5 => 939 / 976 = 0.96
        // linnings_i_plates_t_concrete_fr-ne0_ht-gt5 => 815 / 969 = 0.84
        // linnings_i_plates_q_concrete_fr-eq0 => 948 / 985 = 0.96
        // linnings_i_plates_q_concrete_fr-ne0_ht-lte5 => 924 / 958 = 0.96
        // linnings_i_plates_q_concrete_fr-ne0_ht-gt5 => 821 / 978 = 0.84

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 30;
        // c3-8 / r30 => 4.23 / 5.00 = 0.85

        if ((offerInfo.numberOfPlates === 't' || offerInfo.numberOfPlates === 'q') &&
            (offer.fireResistance.slice(0, -1) === '0' || (offer.fireResistance.slice(0, -1) !== '0') && offer.height <= 5)) {
            rowEndSecond = 26;
        }
        // c3-8 / r26 => 4.23 / 4.33 = 0.97

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
        // linnings_i_plates_s_interax_s => 1460 / 971 = 1.50
        // linnings_i_plates_s_interax_d => 1469 / 975 = 1.51
        // linnings_i_plates_d_interax_s => 1472 / 977 = 1.51
        // linnings_i_plates_d_interax_d => 1474 / 979 = 1.51
        // linnings_i_plates_t_interax_s => 1486 / 988 = 1.50
        // linnings_i_plates_t_interax_d => 1475 / 982 = 1.50
        // linnings_i_plates_q_interax_s => 1474 / 980 = 1.50
        // linnings_i_plates_q_interax_d => 1471 / 978 = 1.50

        let colStartFirst = 2;
        let colEndFirst = 9;
        let rowEndFirst = 23;
        // c2-9 / r23 => 5.69 / 3.83 = 1.49

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
        // linnings_i_plates_s_sheet_fr-eq0 => 869 / 980 = 0.89
        // linnings_i_plates_s_sheet_fr-eq0_img2 => 1022 / 979 = 1.04
        // linnings_i_plates_s_sheet_fr-ne0 => 864/ 972 = 0.89
        // linnings_i_plates_s_sheet_fr-ne0_img2 => 1006 / 965 = 1.04
        // linnings_i_plates_d_sheet_fr-eq0 => 901 / 961 = 0.91
        // linnings_i_plates_d_sheet_fr-eq0_img2 => 1022 / 980 = 1.04
        // linnings_i_plates_d_sheet_fr-ne0 => 923 / 986 = 0.94
        // linnings_i_plates_d_sheet_fr-ne0_img2 => 1020 / 977 = 1.04
        // linnings_i_plates_t_sheet_fr-eq0 => 946 / 986 = 0.96
        // linnings_i_plates_t_sheet_fr-eq0_img2 => 1050 / 981 = 1.07
        // linnings_i_plates_t_sheet_fr-ne0 => 935 / 974 = 0.96
        // linnings_i_plates_t_sheet_fr-ne0_img2 => 1045 / 977 = 1.07
        // linnings_i_plates_q_sheet_fr-eq0 => 1051 / 967 = 1.09
        // linnings_i_plates_q_sheet_fr-eq0_img2 => 937 / 981 = 0.96
        // linnings_i_plates_q_sheet_fr-ne0 => 1041 / 961 = 1.08
        // linnings_i_plates_q_sheet_fr-ne0_img2 => 928 / 974 = 0.95

        let pathSecond1 = `${pathSecond}.png`;
        let pathSecond2 = `${pathSecond}_img2.png`;

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 27;
        // c3-8 / r24 => 4.23 / 3.09 = 1.09
        // c3-8 / r24 => 4.23 / 4.00 = 1.06
        // c3-8 / r25 => 4.23 / 4.17 = 1.01
        // c3-8 / r26 => 4.23 / 4.33 = 0.98
        // c3-8 / r27 => 4.23 / 4.50 = 0.94
        // c3-8 / r28 => 4.23 / 4.67 = 0.91
        // c3-8 / r29 => 4.23 / 4.83 = 0.88

        let fileNameNoExtension = pathSecond1.replace(`${global.ROOT_PATH}/resources/2d/linnings/`, '');
        fileNameNoExtension = fileNameNoExtension.replace('.png', '');

        let fileNameNoExtension2 = pathSecond2.replace(`${global.ROOT_PATH}/resources/2d/linnings/`, '');
        fileNameNoExtension2 = fileNameNoExtension2.replace('.png', '');

        // linnings_i_plates_d_sheet_fr-ne0 => 923 / 986 = 0.94
        // linnings_i_plates_d_sheet_fr-ne0_img2 => 1020 / 977 = 1.04

        switch (fileNameNoExtension) {
            case 'linnings_i_plates_s_sheet_fr-eq0':
            case 'linnings_i_plates_s_sheet_fr-ne0':
                rowEndSecond = 29;
                break;
            case 'linnings_i_plates_d_sheet_fr-eq0':
                rowEndSecond = 28;
                break;
            case 'linnings_i_plates_t_sheet_fr-eq0':
            case 'linnings_i_plates_t_sheet_fr-ne0':
                rowEndSecond = 26;
                break;
            case 'linnings_i_plates_q_sheet_fr-eq0':
            case 'linnings_i_plates_q_sheet_fr-ne0':
                rowEndSecond = 23;
                break;
        }

        switch (fileNameNoExtension2) {
            case 'linnings_i_plates_q_sheet_fr-ne0_img2':
                rowEndSecond = 27;
                break;
            case 'linnings_i_plates_q_sheet_fr-eq0_img2':
                rowEndSecond = 26;
                break;
            case 'linnings_i_plates_s_sheet_fr-eq0_img2':
            case 'linnings_i_plates_s_sheet_fr-ne0_img2':
            case 'linnings_i_plates_d_sheet_fr-eq0_img2':
            case 'linnings_i_plates_d_sheet_fr-ne0_img2':
            case 'linnings_i_plates_t_sheet_fr-eq0_img2':
            case 'linnings_i_plates_t_sheet_fr-ne0_img2':
                rowEndSecond = 24;
                break;
        }

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
    setLinnI
};