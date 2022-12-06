const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnF = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_f';

    // number of plates
    if (offerInfo.numberOfPlates === 'q') {
        basePath += '_plates_q';
    } else if (offerInfo.numberOfPlates === 't') {
        basePath += '_plates_t';
    } else if (offerInfo.numberOfPlates === 'd') {
        basePath += '_plates_d';
    } else if (offerInfo.numberOfPlates === 's') {
        basePath += '_plates_s';
    }
    let basePathDetaliu2 = basePath;

    // interax
    if (offer.profileType.toLowerCase().includes('cd')) {
        basePath += '_interax_cd';
        basePathDetaliu2 += '_interax_cd';
    } else if (offer.interax.toLowerCase().includes('h')) {
        basePath += '_interax_d';
        basePathDetaliu2 += '_interax_cw';
    } else {
        basePath += '_interax_s';
        basePathDetaliu2 += '_interax_cw';
    }

    // set logo
    row = xlUtils.setLogoNoSpace(ws, row);

    // detaliu 1

    // FILES
    // linnings_f_plates_s_interax_s => 1825 / 985 = 1.85
    // linnings_f_plates_s_interax_d => 1823 / 982 = 1.86
    // linnings_f_plates_s_interax_cd => 1735 / 906 = 1.92
    // linnings_f_plates_d_interax_s => 1755 / 946 = 1.86
    // linnings_f_plates_d_interax_d => 1801 / 972 = 1.85
    // linnings_f_plates_d_interax_cd => 1777 / 975 = 1.82
    // linnings_f_plates_t_interax_s => 1798 / 970 = 1.85
    // linnings_f_plates_t_interax_d => 1807 / 975 = 1.85
    // linnings_f_plates_t_interax_cd => 1757 / 979 = 1.79
    // linnings_f_plates_q_interax_s => 1789 / 970 = 1.92
    // linnings_f_plates_q_interax_d => 1790 / 965 = 1.85
    // linnings_f_plates_q_interax_cd => 1750 / 974 = 1.80

    let pathDet1 = `${basePath}.png`;

    let colStartFirst = 2;
    let colEndFirst = 10;
    let rowEndFirst = 21;
    //  c2-10 / r21 => 6.49 / 3.50 = 1.85
    if (offerInfo.numberOfPlates === 's' && offer.profileType.toLowerCase().includes('cd')) {
        colEndFirst = 9;
        rowEndFirst = 18;
    }
    if (offerInfo.numberOfPlates === 'q' && !offer.profileType.toLowerCase().includes('cd') && !offer.profileType.toLowerCase().includes('h')) {
        colEndFirst = 9;
        rowEndFirst = 18;
    }
    //  c2-9 / r18 => 5.69 / 3.17 = 1.90
    if (offerInfo.numberOfPlates === 'd' && offer.profileType.toLowerCase().includes('cd')) {
        colEndFirst = 9;
        rowEndFirst = 19;
    }
    if (offerInfo.numberOfPlates === 't' && offer.profileType.toLowerCase().includes('cd')) {
        colEndFirst = 9;
        rowEndFirst = 19;
    }
    if (offerInfo.numberOfPlates === 'q' && offer.profileType.toLowerCase().includes('cd')) {
        colEndFirst = 9;
        rowEndFirst = 19;
    }
    //  c2-9 / r19 => 5.69 / 3.17 = 1.80

    if (fs.existsSync(pathDet1)) {
        xlUtils.addTwoCellAnchorImage(ws, pathDet1, row, colStartFirst, row + rowEndFirst, colEndFirst);
        row = row + rowEndFirst;
    }

    // detaliu 2 beton

    if (offer.support.toLowerCase().includes('beton')) {
        let pathDet2C = `${basePathDetaliu2}_concrete`;
        if (offer.fireResistance.slice(0, -1) === '0') {
            pathDet2C += '_fr-eq0';
        } else {
            pathDet2C += '_fr-ne0';
        }
        pathDet2C += '.png';

        // FILES
        // linnings_f_plates_s_interax_cd_concrete_fr-ne0 => 517 / 978 = 0.53
        // linnings_f_plates_s_interax_cw_concrete_fr-ne0 => 563 / 949 = 0.59
        // linnings_f_plates_s_interax_cd_concrete_fr-eq0 => 517 / 978 = 0.53
        // linnings_f_plates_s_interax_cw_concrete_fr-eq0 => 563 / 949 = 0.59
        // linnings_f_plates_d_interax_cd_concrete_fr-ne0 => 518 / 977 = 0.53
        // linnings_f_plates_d_interax_cw_concrete_fr-ne0 => 573 / 968 = 0.59
        // linnings_f_plates_d_interax_cd_concrete_fr-eq0 => 518 / 977 = 0.53
        // linnings_f_plates_d_interax_cw_concrete_fr-eq0 => 573 / 968 = 0.59
        // linnings_f_plates_t_interax_cd_concrete_fr-ne0 => 530 / 972 = 0.55
        // linnings_f_plates_t_interax_cw_concrete_fr-ne0 => 580 / 979 = 0.59
        // linnings_f_plates_t_interax_cd_concrete_fr-eq0 => 530 / 972 = 0.55
        // linnings_f_plates_t_interax_cw_concrete_fr-eq0 => 580 / 979 = 0.59
        // linnings_f_plates_q_interax_cd_concrete_fr-ne0 => 544 / 978 = 0.56
        // linnings_f_plates_q_interax_cw_concrete_fr-ne0 => 600 / 976 = 0.61
        // linnings_f_plates_q_interax_cd_concrete_fr-eq0 => 544 / 978 = 0.56
        // linnings_f_plates_q_interax_cw_concrete_fr-eq0 => 600 / 976 = 0.61

        let fileNameNoExtension = pathDet2C.replace(`${global.ROOT_PATH}/resources/2d/linnings/`, '');
        fileNameNoExtension = fileNameNoExtension.replace('.png', '');

        let colStartFirst2 = 3;
        let colEndFirst2 = 6;
        let rowEndFirst2 = 31;
        //  c3-6 / r31 => 3.09 / 5.17 = 0.60
        //  c3-6 / r33 => 3.09 / 5.50 = 0.56
        //  c3-6 / r34 => 3.09 / 5.67 = 0.54

        switch (fileNameNoExtension) {
            case 'linnings_f_plates_s_interax_cd_concrete_fr-ne0':
            case 'linnings_f_plates_s_interax_cd_concrete_fr-eq0':
            case 'linnings_f_plates_d_interax_cd_concrete_fr-ne0':
            case 'linnings_f_plates_d_interax_cd_concrete_fr-eq0':
                rowEndFirst2 = 34;
                break;
            case 'linnings_f_plates_t_interax_cd_concrete_fr-ne0':
            case 'linnings_f_plates_t_interax_cd_concrete_fr-eq0':
            case 'linnings_f_plates_q_interax_cd_concrete_fr-ne0':
            case 'linnings_f_plates_q_interax_cd_concrete_fr-eq0':
                rowEndFirst2 = 33;
                break;
        }

        if (fs.existsSync(pathDet2C)) {
            xlUtils.addTwoCellAnchorImage(ws, pathDet2C, row, colStartFirst2, row + rowEndFirst2, colEndFirst2);
            row = row + rowEndFirst2 + 1;
        }
    }

    // detaliu 2 tabla

    // detaliu 2 beton

    if (offer.support.toLowerCase().includes('tabla')) {
        let pathDet2S = `${basePathDetaliu2}_sheet`;
        if (offer.fireResistance.slice(0, -1) === '0') {
            pathDet2S += '_fr-eq0';
        } else {
            pathDet2S += '_fr-ne0';
        }
        let pathDet2S1 = pathDet2S + '.png';
        let pathDet2S2 = pathDet2S + '_img2' + '.png';

        // FILES

        // linnings_f_plates_s_interax_cd_sheet_fr-eq0 => 525 / 985 = 0.53
        // linnings_f_plates_s_interax_cd_sheet_fr-eq0_img2 => 523 / 973 = 0.54
        // linnings_f_plates_s_interax_cd_sheet_fr-ne0 => 523 / 980 = 0.53
        // linnings_f_plates_s_interax_cd_sheet_fr-ne0_img2 => 523 / 973 = 0.54
        // linnings_f_plates_s_interax_cw_sheet_fr-eq0 => 514 / 979 = 0.53
        // linnings_f_plates_s_interax_cw_sheet_fr-eq0_img2 => 485 / 964 = 0.50
        // linnings_f_plates_s_interax_cw_sheet_fr-ne0 => 512 / 972 = 0.53
        // linnings_f_plates_s_interax_cw_sheet_fr-ne0_img2 => 487 / 966 = 0.50

        // linnings_f_plates_d_interax_cd_sheet_fr-eq0 => 556 / 986 = 0.56
        // linnings_f_plates_d_interax_cd_sheet_fr-eq0_img2 => 532 / 975 = 0.55
        // linnings_f_plates_d_interax_cd_sheet_fr-ne0 => 552 / 981 = 0.56
        // linnings_f_plates_d_interax_cd_sheet_fr-ne0_img2 => 530 / 975 = 0.54
        // linnings_f_plates_d_interax_cw_sheet_fr-eq0 => 547 / 977 = 0.56
        // linnings_f_plates_d_interax_cw_sheet_fr-eq0_img2 => 487 / 967 = 0.50
        // linnings_f_plates_d_interax_cw_sheet_fr-ne0 => 550 / 981 = 0.56
        // linnings_f_plates_d_interax_cw_sheet_fr-ne0_img2 => 483 / 957 = 0.50

        // linnings_f_plates_t_interax_cd_sheet_fr-eq0 => 547 / 971 = 0.56
        // linnings_f_plates_t_interax_cd_sheet_fr-eq0_img2 => 532 / 978 = 0.54
        // linnings_f_plates_t_interax_cd_sheet_fr-ne0 => 543 / 964 = 0.56
        // linnings_f_plates_t_interax_cd_sheet_fr-ne0_img2 => 532 / 978 = 0.54
        // linnings_f_plates_t_interax_cw_sheet_fr-eq0 => 537 / 979 = 0.55
        // linnings_f_plates_t_interax_cw_sheet_fr-eq0_img2 => 511 / 976 = 0.52
        // linnings_f_plates_t_interax_cw_sheet_fr-ne0 => 537 / 979 = 0.55
        // linnings_f_plates_t_interax_cw_sheet_fr-ne0_img2 => 505 / 968 = 0.52

        // linnings_f_plates_q_interax_cd_sheet_fr-eq0 => 563 / 980 = 0.57
        // linnings_f_plates_q_interax_cd_sheet_fr-eq0_img2 => 534 / 980 = 0.54
        // linnings_f_plates_q_interax_cd_sheet_fr-ne0 => 562 / 974 = 0.54
        // linnings_f_plates_q_interax_cd_sheet_fr-ne0_img2 => 523 / 963 = 0.54
        // linnings_f_plates_q_interax_cw_sheet_fr-eq0 => 545 / 972 = 0.56
        // linnings_f_plates_q_interax_cw_sheet_fr-eq0_img2 => 527 / 978 = 0.54
        // linnings_f_plates_q_interax_cw_sheet_fr-ne0 => 537 / 963 = 0.56
        // linnings_f_plates_q_interax_cw_sheet_fr-ne0_img2 => 534 / 974 = 0.55

        let colStart = 3;
        let colEnd = 5;
        let rowEnd = 27;
        //  c3-5 / r27 => 2.47 / 4.50 = 0.55

        if (fs.existsSync(pathDet2S1)) {
            xlUtils.addTwoCellAnchorImage(ws, pathDet2S1, row, colStart, row + rowEnd, colEnd);
        }

        let colStartFirst2 = 5;
        let colEndFirst2 = 9;
        let rowStartFirst2 = row + 1;
        let rowEndFirst2 = 26;
        //  c5-9 / r25 => 2.29 / 4.17 = 0.55
        //  c5-9 / r27 => 2.29 / 4.50 = 0.51
        if (offerInfo.numberOfPlates !== 'q' && !offer.profileType.toLowerCase().includes('cd')) {
            rowStartFirst2 = row;
            rowEndFirst2 = 27;
        }

        if (fs.existsSync(pathDet2S2)) {
            xlUtils.addTwoCellAnchorImage(ws, pathDet2S2, rowStartFirst2, colStartFirst2, row + rowEndFirst2, colEndFirst2);
        }

        row = row + rowEndFirst + 1;
    }


    // set page break
    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setLinnF
};