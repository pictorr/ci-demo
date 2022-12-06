const xl = require('excel4node');
const xlUtils = require('./excelUtils');
const systemService = require("../systemService");

// main function
const setFooter = (ws, row, offer, products, language, user) => {
    row = xlUtils.setLogo(ws, row);

    let descriptionLabel = getFooterLabel(offer, language);
    let descriptionComplete = [
        {
            bold: true,
            size: 8,
            name: 'Arial',
            value: xlUtils.message('text3', language),
        },
        {
            bold: false,
            size: 8,
            name: 'Arial',
            value: `\n${ descriptionLabel }`,
        }
    ];
    let numberOfRows = Math.round(descriptionLabel.length / xlUtils.COL_ALL_WIDTH / 2);
    for (let i = row; i <= row + numberOfRows; i++) {
        ws.row(i).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
    }
    ws.cell(row, 1, row + numberOfRows, 9, true).string(descriptionComplete).style(xlUtils.initialStyles).style({
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row += numberOfRows + 2;

    ws.cell(row, 1, row, 9, true).string(user.company ? user.company : '-').style(xlUtils.initialStyles).style({
        font: {bold: true},
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row++;

    let userInfo = `${ user.firstName || '' } ${ user.lastName || '' }     M: ${ user.phoneNumber || '' }     E: ${ user.emailAddress }`;
    ws.cell(row, 1, row, 9, true).string(userInfo).style(xlUtils.initialStyles).style({
        font: {bold: true},
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row += 2;

    ws.addPageBreak('row', row - 1);

    return row;
}

const getFooterLabel = (offer, language) => {
    let systemInfo = systemService.getSystemType(offer);
    let label = '';
    if (systemInfo.type === 'walls') {
        label += `${ systemInfo.type }_${ systemInfo.wallsType }`;
    } else if (systemInfo.type === 'linnings') {
        label += `${ systemInfo.type }_${ systemInfo.linningsType }`;
    } else if (systemInfo.type === 'ceilings') {
        label += `${ systemInfo.type }_${ systemInfo.ceilingsType }`;
    }
    return xlUtils.message(label, language);
}

module.exports = {
    setFooter
};