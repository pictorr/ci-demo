const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setWallsSl = (ws, row, offer, products, language) => {
    const offerInfo = systemService.getSystemType(offer);
    let basePath = `${global.ROOT_PATH}/resources/2d/walls/`;
    basePath += 'walls_sl';
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
        // walls_sl_plates_s_interax_s => 913 / 701 = 1.30
        // walls_sl_plates_s_interax_d => 916 / 698 = 1.31
        // walls_sl_plates_d_interax_s => 903 / 708 = 1.28
        // walls_sl_plates_d_interax_d => 905 / 704 = 1.29
        // walls_sl_plates_t_interax_s => 904 / 683 = 1.32
        // walls_sl_plates_t_interax_d => 903 / 682 = 1.32

        let colStartFirst = 2;
        let colEndFirst = 8;
        let rowEndFirst = 24;
        //  c2-8 / r23 => 5.16 / 4.00 = 1.29

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

        if (offer.fireResistance.slice(0, -1) !== '0' && offer.height > 7) {
            // FILES
            // walls_sl_plates_s_concrete_fr-ne0_ht-gt7 => 1021 / 970 = 1.05
            // walls_sl_plates_s_concrete_fr-ne0_ht-gt7_img2 => 401 / 762 = 0.53
            // walls_sl_plates_d_concrete_fr-ne0_ht-gt7 => 643 / 614 = 1.05
            // walls_sl_plates_d_concrete_fr-ne0_ht-gt7_img2 => 401 / 762 = 0.53
            // walls_sl_plates_t_concrete_fr-ne0_ht-gt7 => 658 / 621 = 1.06
            // walls_sl_plates_t_concrete_fr-ne0_ht-gt7_img2 => 257 / 485 = 0.53

            // two images
            let colStartSecond = 2;
            let colEndSecond = 7;
            let rowEndSecond = 27;
            let colStartSecond2 = 7;
            let colEndSecond2 = 10;
            let rowStartSecond2 = row + 3;
            let rowEndSecond2 = 24;
            // c2-7 / r27 => 4.64 / 4.50 = 1.03
            // c7-10 / r21 => 1.85 / 3.50 = 0.53

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            }
            if (fs.existsSync(pathSecond2)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond2, rowStartSecond2, colStartSecond2, row + rowEndSecond2, colEndSecond2);
            }
            row = row + rowEndSecond + 1;
        } else {
            // FILES
            // walls_sl_plates_s_concrete_fr-eq0 => 706 / 603 = 1.17
            // walls_sl_plates_s_concrete_fr-ne0_ht-lte5 => 706 / 603 = 1.17
            // walls_sl_plates_s_concrete_fr-ne0_ht-lte7 => 1085 / 943 = 1.15
            // walls_sl_plates_d_concrete_fr-eq0 => 671 / 592 = 1.13
            // walls_sl_plates_d_concrete_fr-ne0_ht-lte5 => 671 / 592 = 1.13
            // walls_sl_plates_d_concrete_fr-ne0_ht-lte7 => 658 / 634 = 1.04
            // walls_sl_plates_t_concrete_fr-eq0 => 661 / 582 = 1.14
            // walls_sl_plates_t_concrete_fr-ne0_ht-lte5 => 661 / 582 = 1.14
            // walls_sl_plates_t_concrete_fr-ne0_ht-lte7 => 640 / 602 = 1.06

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
        // walls_sl_plates_s_interax_s => 913 / 701 = 1.30
        // walls_sl_plates_s_interax_d => 916 / 698 = 1.31
        // walls_sl_plates_d_interax_s => 903 / 708 = 1.28
        // walls_sl_plates_d_interax_d => 905 / 704 = 1.29
        // walls_sl_plates_t_interax_s => 904 / 683 = 1.32
        // walls_sl_plates_t_interax_d => 903 / 682 = 1.32

        let colStartFirst = 2;
        let colEndFirst = 8;
        let rowEndFirst = 24;
        //  c2-8 / r23 => 5.16 / 4.00 = 1.29

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
            // walls_sl_plates_s_sheet_fr-eq0.png => 816 / 772 = 1.06
            // walls_sl_plates_s_sheet_fr-eq0_img2.png => 1155 / 984 = 1.17
            // walls_sl_plates_d_sheet_fr-eq0.png => 1043 / 986 = 1.06
            // walls_sl_plates_d_sheet_fr-eq0_img2.png => 1092 / 978 = 1.12
            // walls_sl_plates_t_sheet_fr-eq0.png => 1023 / 969 = 1.06
            // walls_sl_plates_t_sheet_fr-eq0_img2.png => 1142 / 972 = 1.17

            let colStartSecond = 3;
            let colEndSecond = 8;
            let rowEndSecond = 24;
            // c3-8 / r22 => 4.23 / 3.67 = 1.15
            // c3-8 / r23 => 4.23 / 4.00 = 1.10
            // c3-8 / r24 => 4.23 / 4.00 = 1.06

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
                row = row + rowEndSecond;
            }

            let colStartSecond2 = 3;
            let colEndSecond2 = 8;
            let rowEndSecond2 = 22;
            if (offerInfo.numberOfPlates === 'd') { rowEndSecond = 23; }

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
            // walls_sl_plates_s_sheet_fr-ne0 => 988 / 928 = 1.06
            // walls_sl_plates_s_sheet_fr-ne0_img2 => 448 / 748 = 0.60
            // walls_sl_plates_s_sheet_fr-ne0_img3 => 983 / 881 = 1.11
            // walls_sl_plates_s_sheet_fr-ne0_img4 => 448 / 748 = 0.60
            // walls_sl_plates_d_sheet_fr-ne0 => 632 / 602 = 1.05
            // walls_sl_plates_d_sheet_fr-ne0_img2 => 285 / 491 = 0.58
            // walls_sl_plates_d_sheet_fr-ne0_img3 => 626 / 567 = 1.10
            // walls_sl_plates_d_sheet_fr-ne0_img4 => 285 / 491 = 0.58
            // walls_sl_plates_t_sheet_fr-ne0 => 648 / 613 = 1.05
            // walls_sl_plates_t_sheet_fr-ne0_img2 => 271 / 451 = 0.60
            // walls_sl_plates_t_sheet_fr-ne0_img3 => 1081 / 968 = 1.11
            // walls_sl_plates_t_sheet_fr-ne0_img4 => 271 / 451 = 0.60

            // c1-6 / r22 => 4.33 / 3.67 = 1.18
            // c1-6 / r23 => 4.33 / 3.83 = 1.13
            // c1-6 / r24 => 4.33 / 4.00 = 1.08
            // c1-6 / r25 => 4.33 / 4.17 = 1.04
            // c6-9 / r17 => 1.67 / 2.83 = 0.59

            // four images
            let colStartSecond = 1;
            let colEndSecond = 6;
            let rowEndSecond = 25;
            // c1-6 / r25 => 4.33 / 4.17 = 1.04
            let colStartSecond2 = 6;
            let colEndSecond2 = 9;
            let rowStartSecond2 = row + 4;
            let rowEndSecond2 = rowEndSecond - 4;
            // c6-9 / r17 => 1.67 / 2.83 = 0.59

            if (fs.existsSync(pathSecond1)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond1, row, colStartSecond, row + rowEndSecond, colEndSecond);
            }
            if (fs.existsSync(pathSecond2)) {
                xlUtils.addTwoCellAnchorImage(ws, pathSecond2, rowStartSecond2, colStartSecond2, row + rowEndSecond2, colEndSecond2);
            }
            row = row + rowEndSecond;

            let colStartSecond3 = 1;
            let colEndSecond3 = 6;
            let rowEndSecond3 = 23;
            // c1-6 / r23 => 4.33 / 3.83 = 1.13
            let colStartSecond4 = 6;
            let colEndSecond4 = 9;
            let rowStartSecond4 = row + 3;
            let rowEndSecond4 = rowEndSecond3 - 3;
            // c6-9 / r17 => 1.67 / 2.83 = 0.59

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
    setWallsSl
};