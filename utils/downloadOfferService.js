
const fs = require('fs');
const FormData = require('form-data');
const xl = require('excel4node');
const xlUtils = require('./excelService/excelUtils');
const xlHeader = require('./excelService/header');
const xlFeatures = require('./excelService/features');
const xlDescription = require('./excelService/description');
const xlConsumptions = require('./excelService/consumptions');
const xlUpperGripConsumptions = require('./excelService/upperGripConsumptions');
const xlConsumptionsNotes = require('./excelService/consumptionsNotes');
const xlImages = require('./excelService/images');
const xlFooter = require('./excelService/footer');

// main function
const generateExcelFromOffer = (session, user, products, language, offerId) => {
    return new Promise((resolve, reject) => {
        let workbook = new xl.Workbook(xlUtils.workbookOptions);

        let sessionData = {
            company: '',
            contactPerson: '',
            email: '',
            phoneNumber: '',
            objective: '',
            location: '',
            description: '',
            validationDate: '',
        };
        if (session.data) {
            sessionData = session.data;
        }
        let materials = [];
        let systems = [];
        if (offerId) {
            // single offer
            let findOffer = session.session.find(el => el._id.equals(offerId));

            if (findOffer) {
                let sheetName = xlUtils.message('tab_offer', language);
                if (!!findOffer.excelName) {
                    sheetName = findOffer.excelName;
                    sheetName = sheetName.replace(/[^a-zA-Z0-9 _.]/ig, "");
                    if (sheetName.length > 24) { sheetName = sheetName.substring(0, 24); }
                }

                let worksheet = workbook.addWorksheet(sheetName, xlUtils.worksheetOptions);
                let rowNumber = xlHeader.setHeader(worksheet, 1, session, sessionData, products, language, findOffer);
                rowNumber = xlFeatures.setFeatures(worksheet, rowNumber, findOffer, products, language);
                rowNumber = xlDescription.setDescription(worksheet, rowNumber, findOffer, products, language);
                let cSurfaceCell, cSumCell;
                [rowNumber, cSurfaceCell, cSumCell] = xlConsumptions.setConsumptions(worksheet, rowNumber, findOffer, products, language, materials, systems);
                rowNumber = xlUpperGripConsumptions.setUpperGripConsumptions(worksheet, rowNumber, findOffer, products, language, materials, cSurfaceCell, cSumCell, systems);
                rowNumber = xlConsumptionsNotes.setConsumptionsNotes(worksheet, rowNumber, findOffer, products, language);
                rowNumber = xlImages.setImages(worksheet, rowNumber, findOffer, products, language);
                xlFooter.setFooter(worksheet, rowNumber, findOffer, products, language, user);
            } else {
                reject();
            }
        } else {
            // session with multiple offers
            if (session.session) {
                session.session.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
                for (let i = 0; i < session.session.length; i++) {
                    let offer = session.session[i];
                    let index = i;
                    let sheetName = `${index + 1}_${xlUtils.message('tab_offer', language)}`;
                    if (!!offer.excelName) {
                        sheetName = offer.excelName;
                        sheetName = sheetName.replace(/[^a-zA-Z0-9 _.]/ig, "");
                        if (sheetName.match(/^[0-9]+$/) != null) {
                            sheetName = `${sheetName}_`;
                        }
                        if (sheetName.length > 24) { sheetName = sheetName.substring(0, 24); }
                        sheetName = `${index + 1}_${sheetName}`;
                    }
                    let worksheet = workbook.addWorksheet(sheetName, xlUtils.worksheetOptions);
                    let rowNumber = xlHeader.setHeader(worksheet, 1, session, sessionData, products, language, offer);
                    rowNumber = xlFeatures.setFeatures(worksheet, rowNumber, offer, products, language);
                    rowNumber = xlDescription.setDescription(worksheet, rowNumber, offer, products, language);
                    let cSurfaceCell, cSumCell;
                    [rowNumber, cSurfaceCell, cSumCell] = xlConsumptions.setConsumptions(worksheet, rowNumber, offer, products, language, materials, systems);
                    rowNumber = xlUpperGripConsumptions.setUpperGripConsumptions(worksheet, rowNumber, offer, products, language, materials, cSurfaceCell, cSumCell, systems);
                    rowNumber = xlConsumptionsNotes.setConsumptionsNotes(worksheet, rowNumber, offer, products, language);
                    rowNumber = xlImages.setImages(worksheet, rowNumber, offer, products, language);
                    xlFooter.setFooter(worksheet, rowNumber, offer, products, language, user);
                }

            } else {
                reject();
            }
        }

        if (!offerId) {
            let uniqueMaterialsRefs = [];
            let worksheetMaterials = workbook.addWorksheet(xlUtils.message('tab_materials', language), xlUtils.worksheetOptions);
            let rowNumberMaterials = xlHeader.setHeaderBasic(worksheetMaterials, 1, session, sessionData, products, language, 'tab_materials_title');
            setEnhancedMaterialsCentralization(workbook, worksheetMaterials, rowNumberMaterials, materials, language, uniqueMaterialsRefs, products);

            let worksheetSystems = workbook.addWorksheet(xlUtils.message('tab_systems', language), xlUtils.worksheetOptions);
            let rowNumberSystems = xlHeader.setHeaderBasic(worksheetSystems, 1, session, sessionData, products, language, 'tab_systems_title');
            setEnhancedSystemsCentralization(workbook, worksheetSystems, rowNumberSystems, systems, language);

            // overwrite "pret unitar" for each individual tab from "centralizare materiale" tab
            workbook.sheets.forEach((sheet, index) => {
                if (index < workbook.sheets.length - 2) {
                    let tabMaterials = materials.filter(el => el.sheetName === sheet.name);
                    tabMaterials.forEach(material => {
                        let found = uniqueMaterialsRefs.find(el => el.codSap === material.codSap);

                        if (found) {
                            let cell = xl.getExcelRowCol(material.pricePerUnitMeasureCell);
                            sheet.cell(cell.row, cell.col).formula(`=${found.sheetName}!${found.pricePerUnitMeasureCell}`).style(xlUtils.initialStyles).style({
                                alignment: { horizontal: 'center' },
                                numberFormat: '#,##0.00; (#,##0.00); -'
                            });
                        }
                    });
                }
            });

            // mutat centralizatoarele sa fie primele tab-uri
            workbook.sheets.unshift(workbook.sheets.pop());
            workbook.sheets.unshift(workbook.sheets.pop());
        }

        let fileName = `${Date.now()}_${xlUtils.message('tab_offer', language)}`;
        workbook.write(`${global.ROOT_PATH}/uploads/${fileName}.xlsx`, async function (err) {
            if (!err) {
                if (!user.isAdmin && user.functionalitiesAccess === false) {
                    const readableStream = fs.createReadStream(`${global.ROOT_PATH}/uploads/${fileName}.xlsx`);
                    const writableStream = fs.createWriteStream(`${global.ROOT_PATH}/uploads/${fileName}.pdf`);

                    const form = new FormData();
                    form.append('file', readableStream);

                    form.submit(`http://localhost:${global.DOCKER_PORT}/forms/libreoffice/convert`, function (err, res) {
                        res.pipe(writableStream);
                    });

                    writableStream.on('finish', () => {
                        console.log('resolve pdf file');
                        resolve(`${fileName}.pdf`);
                    });
                } else {
                    console.log('resolve xlsx file');
                    resolve(`${fileName}.xlsx`);
                }
            }
        });
    });
}

const setEnhancedMaterialsCentralization = (wb, ws, row, materials, language, uniqueMaterialsRefs, products) => {
    // set column width
    ws.column(1).setWidth(0.5 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(2).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(3).setWidth(3 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(5).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(7).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);

    let uniqueMaterials = [];
    materials.forEach(material => {
        let materialFound = uniqueMaterials.findIndex(el => el.codSap === material.codSap);
        if (materialFound !== -1) {
            let amount = { sheetName: material.sheetName, amountPerSurface: material.amountPerSurface };
            let price = { sheetName: material.sheetName, pricePerSurface: material.pricePerSurface };
            uniqueMaterials[materialFound].amountPerSurface.push(amount);
            uniqueMaterials[materialFound].pricePerSurface.push(price);
        } else {

            // product name
            let productNameValue = material.productNameValue;
            let productFound = products.find(el => el.codSap === material.codSap);
            if (productFound) {
                productNameValue = productFound.name;
            }

            let materialObj = {
                sheetName: material.sheetName,
                codSap: material.codSap,
                category: material.category,
                rowHeight: material.rowHeight,
                codSapCell: material.codSapCell,
                productNameCell: material.productNameCell,
                unitMeasureCell: material.unitMeasureCell,
                pricePerUnitMeasureCell: material.pricePerUnitMeasureCell,
                pricePerUnitMeasureValue: material.pricePerUnitMeasureValue,
                amountPerSurface: [{ sheetName: material.sheetName, amountPerSurface: material.amountPerSurface }],
                pricePerSurface: [{ sheetName: material.sheetName, pricePerSurface: material.pricePerSurface }],
                productNameValue: productNameValue,
            }
            uniqueMaterials.push(materialObj);
        }
    });

    uniqueMaterials.sort((a, b) => {
        return a.category - b.category || a.codSap - b.codSap;
    });

    ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
    ws.cell(row, 1).string(xlUtils.message('number_abrev', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
            left: { style: 'thin', color: 'black' }
        }
    });
    ws.cell(row, 2).string(xlUtils.message('sap_code', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 3).string(xlUtils.message('product_name', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 4).string(xlUtils.message('unit_measure_abrev', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 5).string(xlUtils.message('tab_materials_subtitle', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });

    ws.cell(row, 6).string(`${xlUtils.message('price', language)} /\n${xlUtils.message('unit_measure_abrev', language)}`).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 7).string(xlUtils.message('value', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            right: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    row++;

    let firstTableRow = row;
    uniqueMaterials.forEach((material, index) => {
        ws.row(row).setHeight(material.rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1).number(index + 1).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { left: { style: 'thin', color: 'black' } }
        });
        ws.cell(row, 2).formula(`=${material.sheetName}!${material.codSapCell}`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        });
        // ref product name
        // ws.cell(row, 3).formula(`=${ material.sheetName }!${ material.productNameCell }`).style(xlUtils.initialStyles).style({
        //     alignment: {horizontal: 'center', wrapText: true},
        // });
        ws.cell(row, 3).string(material.productNameValue).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', wrapText: true },
        });
        ws.cell(row, 4).formula(`=${material.sheetName}!${material.unitMeasureCell}`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        });
        let formulaAmount = '=ROUND(';
        material.amountPerSurface.forEach((el, materialIndex) => {
            if (materialIndex !== 0) {
                formulaAmount += ` + ${el.sheetName}!${el.amountPerSurface}`;
            } else {
                formulaAmount += `${el.sheetName}!${el.amountPerSurface}`;
            }
        });
        formulaAmount += ', 2)';
        ws.cell(row, 5).formula(formulaAmount).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
        ws.cell(row, 6).formula(`ROUND(${material.pricePerUnitMeasureValue}, 2)`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });

        // get pret unitar cell reference and cod sap
        let pretUnitarObj = {
            sheetName: ws.name,
            codSap: material.codSap,
            pricePerUnitMeasureCell: xl.getExcelCellRef(row, 6),
            pricePerUnitMeasureValue: material.pricePerUnitMeasureValue,
        }
        uniqueMaterialsRefs.push(pretUnitarObj);

        let rowColE = xl.getExcelCellRef(row, 5);
        let rowColF = xl.getExcelCellRef(row, 6);
        ws.cell(row, 7).formula(`ROUND(${rowColE} * ${rowColF}, 2)`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: { right: { style: 'thin', color: 'black' } },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
        row++;
    });

    ws.cell(row, 1, row, 6, true).style(xlUtils.initialStyles).string(xlUtils.message('total_curency', language)).style({
        alignment: { horizontal: 'right' },
        border: { top: { style: 'thin', color: 'black' } },
        font: { bold: true }
    });
    ws.cell(row, 7).formula(`ROUND(SUM(${xl.getExcelCellRef(firstTableRow, 7)} : ${xl.getExcelCellRef(row - 1, 7)}), 2)`).style({
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: { top: { style: 'thin', color: 'black' } },
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    row += 2;

    ws.cell(row, 1, row, 6, true).style(xlUtils.initialStyles).string(xlUtils.message('external_products', language));
    row++;
}

const setEnhancedSystemsCentralization = (wb, ws, row, systems, language) => {
    // set column width
    ws.column(1).setWidth(0.5 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(2).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(3).setWidth(2.5 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(5).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);
    ws.column(7).setWidth(1.25 * xlUtils.DEFAULT_COL_WIDTH);

    ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
    ws.cell(row, 1).string(xlUtils.message('number_abrev', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
            left: { style: 'thin', color: 'black' }
        }
    });
    ws.cell(row, 2, row, 3, true).string(xlUtils.message('tab_systems_subtitle', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 4).string(xlUtils.message('surface', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 5).string(`${xlUtils.message('price', language)} /\n${xlUtils.message('square_meter_abrev', language)}`).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    ws.cell(row, 6).string(xlUtils.message('value', language)).style({
        font: { bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
            top: { style: 'thin', color: 'black' },
            right: { style: 'thin', color: 'black' },
            bottom: { style: 'thin', color: 'black' },
        }
    });
    row++;

    let firstTableRow = row;
    systems.forEach((system, index) => {
        ws.cell(row, 1).number(index + 1).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { left: { style: 'thin', color: 'black' } }
        });
        ws.cell(row, 2, row, 3, true).string(system.sheetName).style(xlUtils.initialStyles).style({
            alignment: { vertical: 'center', wrapText: true },
        });
        ws.cell(row, 4).formula(`=${system.sheetName}!${system.surfaceCell}`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
        ws.cell(row, 5).formula(`=${system.sheetName}!${system.pricePerSquareMeterCell}`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
        ws.cell(row, 6).formula(`ROUND(${xl.getExcelCellRef(row, 4)} * ${xl.getExcelCellRef(row, 5)}, 2)`).style(xlUtils.initialStyles).style({
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: { right: { style: 'thin', color: 'black' } },
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
        row++;
    });

    ws.cell(row, 1, row, 5, true).style(xlUtils.initialStyles).string(xlUtils.message('total_curency', language)).style({
        alignment: { horizontal: 'right' },
        border: { top: { style: 'thin', color: 'black' } },
        font: { bold: true }
    });
    ws.cell(row, 6).formula(`ROUND(SUM(${xl.getExcelCellRef(firstTableRow, 6)} : ${xl.getExcelCellRef(row - 1, 6)}), 2)`).style({
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: { top: { style: 'thin', color: 'black' } },
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    row++;
}

module.exports = {
    generateExcelFromOffer
};