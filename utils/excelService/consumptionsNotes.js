const xl = require('excel4node');
const xlUtils = require('./excelUtils');
const systemService = require('../systemService');

// main function
const setConsumptionsNotes = (ws, row, offer, products, language) => {
    row = xlUtils.setLogo(ws, row);
    let consumptionsLabel = getConsumptionsLabel(offer, language);
    let midText = xlUtils.message('text22', language);
    if (consumptionsLabel.original.includes('linnings_p')) {
        midText = xlUtils.message('text23', language);
    }

    let consumptionsComplete = [
        {
            bold: true,
            size: 8,
            name: 'Arial',
            value: xlUtils.message('text21', language),
        },
        {
            bold: false,
            size: 8,
            name: 'Arial',
            value: `\n${consumptionsLabel.text1}\n`,
        },
        {
            bold: true,
            size: 8,
            name: 'Arial',
            value: midText,
        },
        {
            bold: false,
            size: 8,
            name: 'Arial',
            value: `\n${consumptionsLabel.text2}`,
        },
    ];
    let numberOfRows = Math.round((consumptionsLabel.text1.length + consumptionsLabel.text2.length) / xlUtils.COL_ALL_WIDTH / 2);
    for (let i = row; i <= row + numberOfRows; i++) {
        ws.row(i).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
    }
    ws.cell(row, 1, row + numberOfRows, 9, true).string(consumptionsComplete).style(xlUtils.initialStyles).style({
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row += numberOfRows + 2;
    ws.addPageBreak('row', row - 1);

    return row;
}

const getConsumptionsLabel = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = {};
    let text = '';
    if (systemType.type === 'walls') {

        systemType.wallsType = systemType.wallsType.replace("s", "d");
        systemType.name = systemType.name.replace(" S ", " ");

        text += `${ systemType.type }_${ systemType.wallsType }`;
        if (systemType.separativiType === 'asimetric') {
            text += '_plates_d';
        } else {
            text += `_plates_${ systemType.numberOfPlates }`;
        }
        if (offer.support.toLowerCase().includes('beton')) {
            text += `_support_0`;
        } else if (offer.support.toLowerCase().includes('tabla')) {
            text += `_support_1`;
        }
    } else if (systemType.type === 'linnings') {
        text += `${ systemType.type }_${ systemType.linningsType }`;
        text += `_plates_${ systemType.numberOfPlates }`;
        if (offer.support.toLowerCase().includes('beton')) {
            text += `_support_0`;
        } else if (offer.support.toLowerCase().includes('tabla')) {
            text += `_support_1`;
        } else if (systemType.linningsType === 'p') {
            text += `_support_0`;
        }
    } else if (systemType.type === 'ceilings') {
        text += `${ systemType.type }_${ systemType.ceilingsType }`;
        text += `_plates_${ systemType.numberOfPlates }`;
        if (systemType.ceilingsType === 's') {
            // suspendate
            if (offer.ceilingSupport) {
                if (offer.ceilingSupport.toLowerCase().includes('brida ac')) {
                    text += `_support_6`;
                } else if (offer.ceilingSupport.toLowerCase().includes('racord')) {
                    text += `_support_5`;
                } else if (offer.ceilingSupport.toLowerCase().includes('tija m8')) {
                    text += `_support_4`;
                } else if (offer.ceilingSupport.toLowerCase().includes('nonius')) {
                    text += `_support_3`;
                } else if (offer.ceilingSupport.toLowerCase().includes('tirant')) {
                    text += `_support_2`;
                } else if (offer.ceilingSupport.toLowerCase().includes('brida')) {
                    text += `_support_1`;
                }
            }
        } else if (systemType.ceilingsType === 'ss') {
            if (offer.profileType.includes('/')) {
                // profil dublat
                if (offer.profileType.split('/')[0].toLowerCase().includes('cw')) {
                    text += `_profile_cw`;
                } else if (offer.profileType.split('/')[0].toLowerCase().includes('ua')) {
                    text += `_profile_ua`;
                }
            } else {
                // profil simplu
                if (offer.profileType.toLowerCase().includes('cw')) {
                    text += `_profile_cw`;
                } else if (offer.profileType.toLowerCase().includes('ua')) {
                    text += `_profile_ua`;
                }
            }
        }
    }

    label.original = text;
    label.text1 = xlUtils.message(`${text}_text_1`, language);
    label.text2 = xlUtils.message(`${text}_text_2`, language);

    return label;
}

module.exports = {
    setConsumptionsNotes
};