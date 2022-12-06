const xl = require('excel4node');
const translationsDetails = require('./constants');
const xlUtils = require('./excelUtils');

// offer header
const setHeader = (ws, row, session, sessionData, products, language, offer) => {
    // set column width
    ws.column(1).setWidth(1 / 2 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(2).setWidth(3 / 2 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(3).setWidth(3 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(7).setWidth(0.85 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(8).setWidth(0.85 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(9).setWidth(1.3 * xlUtils.DEFAULT_COL_WIDTH);

    // set logo
    row = xlUtils.setLogo(ws, row);

    // header title
    ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 3);
    ws.cell(row, 1, row, 9, true).string(xlUtils.message('header_title', language))
        .style(xlUtils.initialStyles).style({
        font: {bold: true, size: 16},
    });
    row++;

    let date = Date.now();
    if (session.createdOn) {
        date = new Date(session.createdOn);
    }
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_date', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).date(date)
        .style(xlUtils.initialStyles).style({numberFormat: 'dd/mm/yyyy'});
    row++;

    if (sessionData.validationDate) {
        date = new Date(sessionData.validationDate);
        ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_expire', language)}:`)
            .style(xlUtils.initialStyles);
        ws.cell(row, 3).date(date)
            .style(xlUtils.initialStyles).style({numberFormat: 'dd/mm/yyyy'});
        row++;
    }

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_company', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.company).style(xlUtils.initialStyles);
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_contact', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.contactPerson).style(xlUtils.initialStyles);
    row++;

    let rowHeight = Math.ceil(sessionData.objective.length / xlUtils.COL_C_WIDTH);
    ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_objective', language)}:`)
        .style(xlUtils.initialStyles).style({alignment: {wrapText: true}});
    ws.cell(row, 3).string(sessionData.objective).style({alignment: {wrapText: true, vertical: 'center'}});
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_location', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.location).style(xlUtils.initialStyles);
    row++;

    rowHeight = Math.ceil(sessionData.description.length / xlUtils.COL_C_WIDTH);
    ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_description', language)}:`)
        .style(xlUtils.initialStyles).style({alignment: {wrapText: true}});
    ws.cell(row, 3).string(sessionData.description).style(xlUtils.initialStyles).style({
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_code', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.code || '-')
        .style(xlUtils.initialStyles).style({
        fill: {type: 'pattern', patternType: 'solid', bgColor: 'red', fgColor: 'red'}
    });

    ws.cell(row, 4, row, 9, true).style(xlUtils.initialStyles);
    row++;

    let boq = offer.systemName.replace('Creare oferta - ', '');
    if (offer.excelName && offer.excelName.length > 0) {
        boq = offer.excelName;
    }
    if(!offer.excelName?.length) {
        boq = xlUtils.message(translationsDetails[boq], language);
    }

    ws.cell(row, 1, row, 9, true).string(`${xlUtils.message('header_boq', language)}: ${boq}`)
        .style(xlUtils.initialStyles).style({
        font: {bold: true},
        alignment: {wrapText: true},
    });
    row++;

    let systemName = translationsDetails[offer.systemName.replace('Creare oferta - ', '')];
    systemName = xlUtils.message(systemName, language);

    ws.cell(row, 1, row, 9, true).string(`${xlUtils.message('system_type', language)}: ${systemName}`)
        .style(xlUtils.initialStyles).style({
        font: {bold: true},
        alignment: {wrapText: true},
    });
    row++;

    let systemCode = offer.systemCodeTable;
    ws.cell(row, 1, row, 9, true).string(`${xlUtils.message('system_code', language)}: ${systemCode}`)
        .style(xlUtils.initialStyles).style({
        font: {bold: true},
        alignment: {wrapText: true},
    });
    row += 2;

    return row;
}

// centralization header
const setHeaderBasic = (ws, row, session, sessionData, products, language, title) => {
    // set logo
    row = xlUtils.setLogoCentral(ws, row);

    // header title
    ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
    ws.cell(row, 1, row, 9, true).string(xlUtils.message(title, language))
        .style(xlUtils.initialStyles).style({
        font: {bold: true, size: 12},
    });
    row++;

    let date = Date.now();
    if (session.createdOn) {
        date = new Date(session.createdOn);
    }
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_date', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).date(date)
        .style(xlUtils.initialStyles).style({numberFormat: 'dd/mm/yyyy'});
    row++;

    if (sessionData.validationDate) {
        date = new Date(sessionData.validationDate);
        ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_expire', language)}:`)
            .style(xlUtils.initialStyles);
        ws.cell(row, 3).date(date)
            .style(xlUtils.initialStyles).style({numberFormat: 'dd/mm/yyyy'});
        row++;
    }

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_company', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.company).style(xlUtils.initialStyles);
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_contact', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.contactPerson).style(xlUtils.initialStyles);
    row++;

    let rowHeight = Math.ceil(sessionData.objective.length / xlUtils.COL_C_WIDTH);
    ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_objective', language)}:`)
        .style(xlUtils.initialStyles).style({alignment: {wrapText: true}});
    ws.cell(row, 3).string(sessionData.objective).style({alignment: {wrapText: true, vertical: 'center'}});
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_location', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.location).style(xlUtils.initialStyles);
    row++;

    rowHeight = Math.ceil(sessionData.description.length / xlUtils.COL_C_WIDTH);
    ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_description', language)}:`)
        .style(xlUtils.initialStyles).style({alignment: {wrapText: true}});
    ws.cell(row, 3).string(sessionData.description).style(xlUtils.initialStyles).style({
        alignment: {
            wrapText: true,
            vertical: 'center'
        }
    });
    row++;

    ws.cell(row, 1, row, 2, true).string(`${xlUtils.message('header_code', language)}:`)
        .style(xlUtils.initialStyles);
    ws.cell(row, 3).string(sessionData.code || '-')
        .style(xlUtils.initialStyles).style({
        fill: {type: 'pattern', patternType: 'solid', bgColor: 'red', fgColor: 'red'}
    });
    ws.cell(row, 4, row, 9, true).style(xlUtils.initialStyles);
    row += 2;

    return row;
}

module.exports = {
    setHeader,
    setHeaderBasic,
};