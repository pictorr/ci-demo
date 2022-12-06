const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setWallsD = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/walls/`;
    basePath += 'walls_d';
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
        // walls_d_plates_s_interax_s => 923 / 537 = 1.72
        // walls_d_plates_s_interax_d => 923 / 544 = 1.70
        // walls_d_plates_d_interax_s => 941 / 552 = 1.70
        // walls_d_plates_d_interax_d => 908 / 532 = 1.70
        // walls_d_plates_t_interax_s => 902 / 529 = 1.71
        // walls_d_plates_t_interax_d => 902 / 528 = 1.71

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 23;
        //  c2-10 / r23 => 6.49 / 3.83 = 1.69

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
            } else if (offer.height <= 7) {
                pathSecond += '_ht-lte7';
            } else {
                pathSecond += '_ht-gt7';
            }
        }
        let pathSecond1 = `${pathSecond}.png`;
        let pathSecond2 = `${pathSecond}_img2.png`;

        // FILES
        // walls_d_plates_s_concrete_fr-eq0 => 676 / 581 = 1.16
        // walls_d_plates_s_concrete_fr-ne0_ht-lte5 => 676 / 581 = 1.16
        // walls_d_plates_s_concrete_fr-ne0_ht-lte7 => 621 / 587 = 1.06
        // walls_d_plates_s_concrete_fr-ne0_ht-gt7 => 748 / 760 = 0.98
        // walls_d_plates_s_concrete_fr-ne0_ht-gt7_img2 => 401 / 762 = 0.53
        // walls_d_plates_d_concrete_fr-eq0 => 667 / 574 = 1.16
        // walls_d_plates_d_concrete_fr-ne0_ht-lte5 => 667 / 574 = 1.16
        // walls_d_plates_d_concrete_fr-ne0_ht-lte7 => 617 / 583 = 1.06
        // walls_d_plates_d_concrete_fr-ne0_ht-gt7 => 660 / 675 = 0.98
        // walls_d_plates_d_concrete_fr-ne0_ht-gt7_img2 => 401 / 762 = 0.53
        // walls_d_plates_t_concrete_fr-eq0 => 665 / 572 = 1.16
        // walls_d_plates_t_concrete_fr-ne0_ht-lte5 => 665 / 572 = 1.16
        // walls_d_plates_t_concrete_fr-ne0_ht-lte7 => 614 / 581 = 1.06
        // walls_d_plates_t_concrete_fr-ne0_ht-gt7 => 626 / 641 = 0.98
        // walls_d_plates_t_concrete_fr-ne0_ht-gt7_img2 => 257 / 485 = 0.53

        if (offer.fireResistance.slice(0, -1) !== '0' && offer.height > 7) {
            // two images
            let colStartSecond = 2;
            let colEndSecond = 7;
            let rowEndSecond = 28;
            let colStartSecond2 = 7;
            let colEndSecond2 = 10;
            let rowStartSecond2 = row + 4;
            let rowEndSecond2 = 25;
            // c2-7 / r28 => 4.64 / 3.67 = 0.99
            // c7-10 / r21 => 1.85 / 3.50 = 0.53

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            }
            if (fs.existsSync(pathSecond2)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond2, rowStartSecond2, colStartSecond2, row + rowEndSecond2, colEndSecond2);
            }
            row = row + rowEndSecond + 1;
        } else {
            // one image
            let colStartSecond = 3;
            let colEndSecond = 8;
            let rowEndSecond = 22;
            if (offer.fireResistance.slice(0, -1) !== '0' && offer.height >= 5 && offer.height < 7) { rowEndSecond = 24; }
            // c3-8 / r22 => 4.23 / 3.67 = 1.15
            // c3-8 / r24 => 4.23 / 4.00 = 1.06

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
                row = row + rowEndSecond + 1;
            }
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
        // walls_d_plates_s_interax_s => 923 / 537 = 1.72
        // walls_d_plates_s_interax_d => 923 / 544 = 1.70
        // walls_d_plates_d_interax_s => 941 / 552 = 1.70
        // walls_d_plates_d_interax_d => 908 / 532 = 1.70
        // walls_d_plates_t_interax_s => 902 / 529 = 1.71
        // walls_d_plates_t_interax_d => 902 / 528 = 1.71

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 23;
        //  c2-10 / r23 => 6.49 / 3.83 = 1.69

        if (fs.existsSync(pathFirst)) {
            xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
            row = row + rowEndFirst;
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
            let pathSecond1 = `${pathSecond}.png`;
            let pathSecond2 = `${pathSecond}_img2.png`;

            // FILES
            // walls_d_plates_s_sheet_fr-eq0 => 682 / 780 = 0.87
            // walls_d_plates_s_sheet_fr-eq0_img2 => 661 / 802 = 0.82
            // walls_d_plates_d_sheet_fr-eq0 => 562 / 638 = 0.88
            // walls_d_plates_d_sheet_fr-eq0_img2 => 562 / 677 = 0.83
            // walls_d_plates_t_sheet_fr-eq0 => 595 / 627 = 0.95
            // walls_d_plates_t_sheet_fr-eq0_img2 => 602 / 689 = 0.87

            let colStartSecond = 3;
            let colEndSecond = 7;
            let rowEndSecond = 26;
            if (offerInfo.numberOfPlates === 't') { rowEndSecond = 23; }
            // c3-7 / r23 => 3.71 / 3.83 = 0.97
            // c3-7 / r26 => 3.71 / 4.33 = 0.86

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
                row = row + rowEndSecond;
            }

            let colStartSecond2 = 3;
            let colEndSecond2 = 7;
            let rowEndSecond2 = 27;
            if (offerInfo.numberOfPlates === 't') { rowEndSecond2 = 26; }
            // c3-7 / r26 => 3.71 / 4.33 = 0.86
            // c3-7 / r27 => 3.71 / 4.50 = 0.82

            if (fs.existsSync(pathSecond2)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond2, row, colStartSecond2, row + rowEndSecond2, colEndSecond2);
                row = row + rowEndSecond + 1;
            }
        }

        if (offer.fireResistance.slice(0, -1) !== '0') {
            pathSecond += '_fr-ne0';
            let pathSecond1 = `${pathSecond}.png`;
            let pathSecond2 = `${pathSecond}_img2.png`;
            let pathSecond3 = `${pathSecond}_img3.png`;
            let pathSecond4 = `${pathSecond}_img4.png`;

            // FILES
            // walls_d_plates_s_sheet_fr-ne0 => 838 / 986 = 0.85
            // walls_d_plates_s_sheet_fr-ne0_img2 => 448 / 748 = 0.60
            // walls_d_plates_s_sheet_fr-ne0_img3 => 813 / 975 = 0.83
            // walls_d_plates_s_sheet_fr-ne0_img4 => 448 / 748 = 0.60
            // walls_d_plates_d_sheet_fr-ne0 => 819 / 977 = 0.84
            // walls_d_plates_d_sheet_fr-ne0_img2 => 285 / 491 = 0.58
            // walls_d_plates_d_sheet_fr-ne0_img3 => 813 / 977 = 0.83
            // walls_d_plates_d_sheet_fr-ne0_img4 => 285 / 491 = 0.58
            // walls_d_plates_t_sheet_fr-ne0 => 858 / 980 = 0.88
            // walls_d_plates_t_sheet_fr-ne0_img2 => 271 / 451 = 0.60
            // walls_d_plates_t_sheet_fr-ne0_img3 => 837 / 987 = 0.85
            // walls_d_plates_t_sheet_fr-ne0_img4 => 271 / 451 = 0.60

            // four images
            let colStartSecond = 2;
            let colEndSecond = 6;
            let rowEndSecond = 28;
            if (offerInfo.numberOfPlates === 'd') { rowEndSecond = 29; }
            if (offerInfo.numberOfPlates === 't') { rowEndSecond = 27; }
            // c2-6 / r27 => 4.02 / 4.50 = 0.89
            // c2-6 / r28 => 4.02 / 4.67 = 0.86
            // c2-6 / r29 => 4.02 / 4.83 = 0.83

            let colStartSecond2 = 6;
            let colEndSecond2 = 10;
            let rowStartSecond2 = row + 2;
            let rowEndSecond2 = 27;
            if (offerInfo.numberOfPlates === 't') { rowStartSecond2 = row + 1; rowEndSecond2 = 26; }
            // c6-10 / r25 => 2.47 / 4.17 = 0.59

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            }
            if (fs.existsSync(pathSecond2)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond2, rowStartSecond2, colStartSecond2, row + rowEndSecond2, colEndSecond2);
            }
            row = row + rowEndSecond;

            let colStartSecond3 = 2;
            let colEndSecond3 = 6;
            let rowEndSecond3 = 29;
            if (offerInfo.numberOfPlates === 't') { rowEndSecond3 = 28; }
            // c2-6 / r27 => 4.02 / 4.50 = 0.89
            // c2-6 / r28 => 4.02 / 4.67 = 0.86
            // c2-6 / r29 => 4.02 / 4.83 = 0.83

            let colStartSecond4 = 6;
            let colEndSecond4 = 10;
            let rowStartSecond4 = row + 2;
            let rowEndSecond4 = 27;
            // c6-10 / r25 => 2.47 / 4.17 = 0.59

            if (fs.existsSync(pathSecond3)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond3, row, colStartSecond3, row + rowEndSecond3, colEndSecond3);
            }
            if (fs.existsSync(pathSecond4)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond4, rowStartSecond4, colStartSecond4, row + rowEndSecond4, colEndSecond4);
            }
            row = row + rowEndSecond + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);
    }

    return row;
}

module.exports = {
    setWallsD
};