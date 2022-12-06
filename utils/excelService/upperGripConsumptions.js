const xl = require('excel4node');
const xlUtils = require('./excelUtils');

const UPPER_SUPPORT_SHEET = "Tabla cutata de acoperis";

// main function
const setUpperGripConsumptions = (ws, row, offer, products, language, materials, cSurfaceCell, cSumCell, systems) => {
    let check = checkHasUpperGrip(offer);
    if (!check) {
        return row;
    }

    // set logo
    row = xlUtils.setLogo(ws, row);

    // TABLE START
    // table first row
    
    let titleLabel = getTableTitle(offer, language);
    
    ws.row(row).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 5, true).string(titleLabel).style(xlUtils.initialStyles).style({
        font: {bold: true},
        border: {
            top: {style: 'thin', color: 'black'},
            bottom: {style: 'thin', color: 'black'},
            left: {style: 'thin', color: 'black'} 
        },
        alignment: {wrapText: true}
    });
    ws.cell(row, 6, row, 7, true).string(`${ xlUtils.message('joint_length', language) } =`).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'right'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 8).formula(`ROUND(${ 1 * offer.jointLength / offer.surface } * ${ cSurfaceCell }, 2)`).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}},
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    let jointLengthCell = xl.getExcelCellRef(row, 8);
    ws.cell(row, 9).string('ml').style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {
            top: {style: 'thin', color: 'black'},
            bottom: {style: 'thin', color: 'black'},
            right: {style: 'thin', color: 'black'}
        }
    });
    row++;

    // table second row
    ws.row(row).setHeight(3 * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1).string(xlUtils.message('number_abrev', language)).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}, left: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 2).string(xlUtils.message('sap_code', language)).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 3).string(xlUtils.message('product_name', language)).style(xlUtils.initialStyles).style({
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 4).string(xlUtils.message('unit_measure_abrev', language)).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 5).string(`${ xlUtils.message('consumption', language) } /\n${ xlUtils.message('joint_ml', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 6).string(`${ xlUtils.message('consumption', language) } /\n${ xlUtils.message('joint_length', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 7).string(`${ xlUtils.message('price', language) } /\n${ xlUtils.message('unit_measure_abrev', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 8).string(`${ xlUtils.message('price', language) } /\n${ xlUtils.message('joint_ml', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 9).string(`${ xlUtils.message('value', language) } /\n${ xlUtils.message('joint_length', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {right: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}}
    });
    row++;

    let firstTableRow = row;
    let indexConsumption = 0;
    // table product rows
    offer.consumption.sort((a, b) => {
        return a.category - b.category || a.codSap - b.codSap;
    });
    if (offer.consumptionExterior && offer.consumptionExterior.length > 0) {
        offer.consumptionExterior.forEach(consumption => {
            if (!consumption.codSap || consumption.codSap.includes('placa') || consumption.amount === 0) {
                return;
            }
            let upperProductName = consumption.productName;
            // let findUpperProduct = products.find(product => product.codSap === consumption.codSap);
            // if (findUpperProduct) {
            //     upperProductName = findUpperProduct.name;
            // }

            let rowHeight = Math.ceil(consumption.productName.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);

            indexConsumption++;
            ws.cell(row, 1).number(indexConsumption).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 2).string(consumption.codSap).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'}
            });
            ws.cell(row, 3).string(upperProductName).style(xlUtils.initialStyles).style({
                alignment: {wrapText: true}
            });
            ws.cell(row, 4).string(consumption.unitMeasure).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
            });
            ws.cell(row, 5).formula(`ROUND(${ consumption.amount }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });
            let quantityCell = xl.getExcelCellRef(row, 5);
            ws.cell(row, 6).formula(`ROUND(${ quantityCell } * ${ jointLengthCell }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });
            ws.cell(row, 7).formula(`ROUND(${ consumption.price }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });

            // centralizare materiale
            let materialsObj = {
                sheetName: ws.name,
                codSap: consumption.codSap,
                category: consumption.category,
                rowHeight: rowHeight,
                codSapCell: xl.getExcelCellRef(row, 2),
                productNameCell: xl.getExcelCellRef(row, 3),
                unitMeasureCell: xl.getExcelCellRef(row, 4),
                amountPerSurface: xl.getExcelCellRef(row, 6),
                pricePerUnitMeasureCell: xl.getExcelCellRef(row, 7),
                pricePerUnitMeasureValue: consumption.price,
                pricePerSurface: xl.getExcelCellRef(row, 9),
                productNameValue: consumption.productName,
            }
            materials.push(materialsObj);

            let priceCell = xl.getExcelCellRef(row, 7);
            ws.cell(row, 8).formula(`ROUND(${ priceCell } * ${ quantityCell }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });
            let priceQuantityCell = xl.getExcelCellRef(row, 8);
            ws.cell(row, 9).formula(`ROUND(${ priceQuantityCell } * ${ jointLengthCell }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                border: {right: {style: 'thin', color: 'black'}},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });
            row++;
        });
    }
    let lastTableRow = firstTableRow + indexConsumption - 1;

    // row - total (RON)
    ws.cell(row, 1, row, 5, true).style(xlUtils.initialStyles).style({
        border: {top: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 6, row, 7, true).string(xlUtils.message('total_curency', language)).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'right'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}}
    });

    ws.cell(row, 8).formula(`ROUND(SUM(${ xl.getExcelCellRef(firstTableRow, 8) } : ${ xl.getExcelCellRef(lastTableRow, 8) }), 2)`).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}},
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    ws.cell(row, 9).formula(`ROUND(SUM(${ xl.getExcelCellRef(firstTableRow, 9) } : ${ xl.getExcelCellRef(lastTableRow, 9) }), 2)`).style({
        font: {bold: true},
        alignment: {horizontal: 'center'},
        border: {
            top: {style: 'thin', color: 'black'},
        },
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    let cUpperSumCell = xl.getExcelCellRef(row, 9);
    row++;

    // row - total suprafata (ron)
    ws.cell(row, 1, row, 4, true).style(xlUtils.initialStyles)
        .style({
            border: {top: {style: 'thin', color: 'black'}}
        });
    ws.cell(row, 5, row, 7, true).string(xlUtils.message('total_surface_curency', language)).style(xlUtils.initialStyles)
        .style({
            alignment: {horizontal: 'right'},
            font: {bold: true},
            border: {top: {style: 'thin', color: 'black'}}
        });
    ws.cell(row, 9).formula(`ROUND(${ cSumCell } + ${ cUpperSumCell }, 2)`).style({
        font: {bold: true},
        alignment: {horizontal: 'center'},
        border: {top: {style: 'thin', color: 'black'}},
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    let totalSumCell = xl.getExcelCellRef(row, 9);
    ws.cell(row, 8)
        .formula(`ROUND(${totalSumCell} / ${cSurfaceCell}, 2)`)
        .style(xlUtils.initialStyles)
        .style({
            alignment: {horizontal: 'center'},
            font: {bold: true},
            border: {top: {style: 'thin', color: 'black'}},
            numberFormat: '#,##0.00; (#,##0.00); -'
        });
    systems[systems.length - 1].pricePerSquareMeterCell =  xl.getExcelCellRef(row, 8);

    row = row + 2;

    // TABLE END

    ws.cell(row, 1, row, 6, true).style(xlUtils.initialStyles).string(xlUtils.message('external_products', language));
    row += 2;

    ws.addPageBreak('row', row - 1);

    return row;
}

const checkHasUpperGrip = (offer) => {
    let offerInfo = xlUtils.getSystemType(offer);
    if (offerInfo.systemType === 'walls') {
        if (offer.fireResistance.slice(0, -1) === '0') {
            return false;
        }
        if (offer.support.toLowerCase().includes('beton') && offer.height < 5) {
            return false;
        }
        if (offer.consumptionExterior.length < 4) {
            return false;
        }
    } else if (offerInfo.systemType === 'linings') {
        if (offer.consumptionExterior.length < 4 && offer.interaxSustineri && offer.interaxSustineri !== '0' && offer.interaxSustineri !== '1') {
            return false;
        }
        if (offer.support.toLowerCase().includes('beton') && offer.height < 5) {
            return false;
        }
        if (offer.consumptionExterior.length < 4) {
            return false;
        }
    } else if (offerInfo.systemType === 'ceilings') {
        return false;
    }

    return true;
}

const getTableTitle = (offer, language) => {
    let support = xlUtils.message('upper_support_concrete', language);

    if (offer.support === UPPER_SUPPORT_SHEET) {
        support = xlUtils.message('upper_support_sheet', language);
    }

    let title = xlUtils.message('upper_consumptions_title', language);
    title += `\n${ xlUtils.message('upper_consumptions_title_support', language) }: ${ support }`;

    return title;
}

module.exports = {
    setUpperGripConsumptions
};