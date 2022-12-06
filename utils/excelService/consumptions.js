const xl = require('excel4node');
const xlUtils = require('./excelUtils');

// main function
const setConsumptions = (ws, row, offer, products, language, materials, systems) => {
    // set logo
    row = xlUtils.setLogo(ws, row);

    // table first row
    ws.row(row).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 5, true).string(xlUtils.message('consumptions_title', language)).style(xlUtils.initialStyles).style({
        font: {bold: true},
        border: {
            top: {style: 'thin', color: 'black'},
            bottom: {style: 'thin', color: 'black'},
            left: {style: 'thin', color: 'black'}
        }
    });
    ws.cell(row, 6, row, 7, true).string(`${ xlUtils.message('surface', language) } =`).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'right'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 8).formula(`ROUND(${ offer.surface }, 2)`).style(xlUtils.initialStyles).style({
        alignment: {horizontal: 'center'},
        font: {bold: true},
        border: {top: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}},
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    let surfaceCell = xl.getExcelCellRef(row, 8);
    let cSurfaceCell = xl.getExcelCellRef(row, 8);
    ws.cell(row, 9).string(xlUtils.message('square_meter_abrev', language)).style(xlUtils.initialStyles).style({
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
    ws.row(row).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
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
    ws.cell(row, 5).string(`${ xlUtils.message('consumption', language) } /\n${ xlUtils.message('square_meter_abrev', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 6).string(`${ xlUtils.message('consumption', language) } /\n${ xlUtils.message('surface', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 7).string(`${ xlUtils.message('price', language) } /\n${ xlUtils.message('unit_measure_abrev', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 8).string(`${ xlUtils.message('price', language) } /\n${ xlUtils.message('square_meter_abrev', language) }`).style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, horizontal: 'center'},
        font: {bold: true},
        border: {bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 9).string(`${ xlUtils.message('value', language) } /\n${ xlUtils.message('surface', language) }`).style(xlUtils.initialStyles).style({
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
    if (offer.consumption && offer.consumption.length > 0) {
        offer.consumption.forEach(consumption => {
            if (!consumption.codSap || consumption.codSap.includes('placa') || consumption.amount === 0) {
                return;
            }
            let productName = consumption.productName;
            // let findProduct = products.find(product => product.codSap === consumption.codSap);
            // if (findProduct) {
            //     productName = findProduct.name;
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
            ws.cell(row, 3).string(productName).style(xlUtils.initialStyles).style({
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
            ws.cell(row, 6).formula(`ROUND(${ quantityCell } * ${ surfaceCell }, 2)`).style(xlUtils.initialStyles).style({
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
            ws.cell(row, 9).formula(`ROUND(${ priceQuantityCell } * ${ surfaceCell }, 2)`).style(xlUtils.initialStyles).style({
                alignment: {horizontal: 'center'},
                border: {right: {style: 'thin', color: 'black'}},
                numberFormat: '#,##0.00; (#,##0.00); -'
            });
            row++;
        });
    }
    let lastTableRow = firstTableRow + indexConsumption - 1;

    // table last row
    ws.cell(row, 1, row, 5, true).style(xlUtils.initialStyles).style({
        border: {
            top: {style: 'thin', color: 'black'},
        }
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
        border: {top: {style: 'thin', color: 'black'}},
        numberFormat: '#,##0.00; (#,##0.00); -'
    });
    let pricePerSquareMeterCell = xl.getExcelCellRef(row, 8);
    let cSumCell = xl.getExcelCellRef(row, 9);
    row = row + 2;

    ws.cell(row, 1, row, 6, true).style(xlUtils.initialStyles).string(xlUtils.message('external_products', language));
    row += 2;

    // centralizare sisteme
    let systemsObj = {
        sheetName: ws.name,
        surfaceCell: surfaceCell,
        pricePerSquareMeterCell: pricePerSquareMeterCell,
        code: offer.systemCode
    }
    systems.push(systemsObj);

    ws.addPageBreak('row', row - 1);
    return [row, cSurfaceCell, cSumCell];
}

module.exports = {
    setConsumptions
};