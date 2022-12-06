const xl = require('excel4node');
const xlUtils = require('./excelUtils');
const systemService = require('../systemService');

// main function
const setDescription = (ws, row, offer, products, language) => {
    let label = getDescriptionLabel(offer, language);

    if(offer.systemName.includes("Smart") && label.includes('walls')) {
        label = label.replace('walls_s', 'walls_d');
    }

    let descriptionLabel = xlUtils.message(label, language);
    let endText =xlUtils.message('text12', language);

    if (label.includes('linnings_p') || label.includes('ceilings_')) {
        endText = xlUtils.message('text13', language);
    }
    let descriptionComplete = [
        {
            bold: true,
            size: 8,
            name: 'Arial',
            value: xlUtils.message('text11', language),
        },
        {
            bold: false,
            size: 8,
            name: 'Arial',
            value: `\n${descriptionLabel}\n`,
        },
        {
            bold: false,
            size: 8,
            name: 'Arial',
            color: 'red',
            value: endText,
        },
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
    ws.addPageBreak('row', row - 1);

    return row;
}

const getDescriptionLabel = (offer, language) => {
    let systemType = systemService.getSystemType(offer);
    let label = '';
    if (systemType.type === 'walls') {
        label += `${systemType.type}_${systemType.wallsType}`;
        if (systemType.wallsType !== 's') {
            label += `_plates_${systemType.numberOfPlates}`;
        }
        if (systemType.wallsType === 's') {
            if (systemType.separativiType === 'asimetric') {
                label += `_asimetric`;
            } else if (systemType.separativiType === 'intermediar') {
                label += `_intermediar`;
                label += `_plates_${systemType.numberOfPlates}`;
            } else {
                label += `_plates_${systemType.numberOfPlates}`;
            }
        }
        if (systemType.wallsType === 'd' && offer.burglaryResistance && offer.burglaryResistance === '4') {
            label += `_rc4`;
        }
    } else if (systemType.type === 'linnings') {
        label += `${systemType.type}_${systemType.linningsType}`;
        label += `_plates_${systemType.numberOfPlates}`;
    } else if (systemType.type === 'ceilings') {
        label += `${systemType.type}_${systemType.ceilingsType}`;
        label += `_plates_${systemType.numberOfPlates}`;
        if (systemType.ceilingsType === 's') {
            // suspendate
            if (offer.profileType.includes('/')) {
                // profil dublat
                label += `_profile_2`;
            } else {
                // profil simplu
                label += `_profile_1`;
            }
        } else if (systemType.ceilingsType === 'ss') {
            // autoportante
            if (offer.profileType.includes('/')) {
                // profil dublat
                if (offer.profileType.split('/')[0].toLowerCase().includes('cw')) {
                    label += `_profile_cw`;
                } else if (offer.profileType.split('/')[0].toLowerCase().includes('ua')) {
                    label += `_profile_ua`;
                }
            } else {
                // profil simplu
                if (offer.profileType.toLowerCase().includes('cw')) {
                    label += `_profile_cw`;
                } else if (offer.profileType.toLowerCase().includes('ua')) {
                    label += `_profile_ua`;
                }
            }
        }
    }

    return label;
}

module.exports = {
    setDescription
};