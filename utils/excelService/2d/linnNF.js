const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setLinnNF = (ws, row, offer, products, language) => {
    let basePath = `${global.ROOT_PATH}/resources/2d/linnings/`;
    basePath += 'linnings_nf';

    // number of plates
    basePath += '_plates_t';

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
        // linnings_nf_plates_t_interax_s_s => 1656 / 980 = 1.69
        // linnings_nf_plates_t_interax_s_d => 1603 / 988 = 1.62
        // linnings_nf_plates_t_interax_d_s => 1586 / 977 = 1.62
        // linnings_nf_plates_t_interax_d_d => 1589 / 978 = 1.62

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 24;
        if (offer.interax.includes('/') && !offer.interax.split('/')[0].toLowerCase().includes('h') && !offer.interax.split('/')[1].toLowerCase().includes('h')) {
            rowEndFirst = 23;
        }
        //  c2-10 / r23 => 6.49 / 3.83 = 1.69
        //  c2-10 / r24 => 6.49 / 4.00 = 1.62

        if (fs.existsSync(pathFirst)) {
            xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
            row = row + rowEndFirst;
        }

        // secondPath
        let pathSecond = basePath;
        pathSecond += '_concrete' + '.png';

        // FILES
        // linnings_nf_plates_t_concrete => 976 / 970 = 1.00

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 25;
        //  c3-8 / r25 => 4.23 / 4.17 = 1.01

        if (fs.existsSync(pathSecond)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartSecond, row + rowEndSecond, colEndSecond);
            row = row + rowEndSecond + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);
    }

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
        // linnings_nf_plates_t_interax_s_s => 1656 / 980 = 1.69
        // linnings_nf_plates_t_interax_s_d => 1603 / 988 = 1.62
        // linnings_nf_plates_t_interax_d_s => 1586 / 977 = 1.62
        // linnings_nf_plates_t_interax_d_d => 1589 / 978 = 1.62

        let colStartFirst = 2;
        let colEndFirst = 10;
        let rowEndFirst = 24;
        if (offer.interax.includes('/') && !offer.interax.split('/')[0].toLowerCase().includes('h') && !offer.interax.split('/')[1].toLowerCase().includes('h')) {
            rowEndFirst = 23;
        }
        //  c2-10 / r23 => 6.49 / 3.83 = 1.69
        //  c2-10 / r24 => 6.49 / 4.00 = 1.62

        if (fs.existsSync(pathFirst)) {
            xlUtils.addTwoCellAnchorImage(ws, pathFirst, row, colStartFirst, row + rowEndFirst, colEndFirst);
            row = row + rowEndFirst + 1;
        }

        // set page break
        ws.addPageBreak('row', row - 1);

        // set logo
        row = xlUtils.setLogoNoSpace(ws, row);

        // secondPath
        let pathSecond = basePath;
        let pathSecond2 = basePath;
        pathSecond += '_sheet' + '.png';
        pathSecond2 += '_sheet' + '_img2' + '.png';

        // FILES
        // linnings_nf_plates_t_sheet => 971 / 973 = 1.00
        // linnings_nf_plates_t_sheet_img2 => 913 / 958 = 0.95

        let colStartSecond = 3;
        let colEndSecond = 8;
        let rowEndSecond = 25;
        let rowEndSecond2 = 27;
        //  c3-8 / r25 => 4.23 / 4.17 = 1.01
        //  c3-8 / r27 => 4.23 / 4.50 = 0.94

        if (fs.existsSync(pathSecond)) {
            xlUtils.addTwoCellAnchorImage(ws, pathSecond, row, colStartSecond, row + rowEndSecond, colEndSecond);
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
    setLinnNF
};