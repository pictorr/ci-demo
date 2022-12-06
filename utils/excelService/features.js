const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('./excelUtils');
const helpers = require('./featureHelpers');
const featureLinks = require('./featureLinks');
const systemService = require('../systemService');
const translationsDetails = require('./constants');

const UPPER_SUPPORT_SHEET = "Tabla cutata de acoperis";

// main function
const setFeatures = (ws, row, offer, products, language) => {
    let systemType = systemService.getSystemType(offer);

    // features title
    ws.cell(row, 1, row, 3, true).string(xlUtils.message('features_title', language))
        .style(xlUtils.initialStyles).style({
        font: {bold: true},
        border: {
            top: {style: 'thin', color: 'black'},
            right: {style: 'thin', color: 'black'},
            bottom: {style: 'thin', color: 'black'},
            left: {style: 'thin', color: 'black'},
        }
    });
    let firstRow = row;
    row++;

    // rez foc
    let fireLabel = helpers.getFireResistance(offer, language);
    ws.cell(row, 1, row, 2, true).string(xlUtils.message('fire_resistance', language))
        .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
    ws.cell(row, 3).string(fireLabel)
        .style(xlUtils.initialStyles).style({
        border: {
            right: {
                style: 'thin',
                color: 'black'
            },
        }
    });
    row++;

    // plafoane - sens protectie
    if (systemType.type === 'ceilings') {
        let directionLabel = helpers.getDirection(offer, language);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('ceilings_direction', language))
            .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
        ws.cell(row, 3).string(directionLabel)
            .style(xlUtils.initialStyles).style({
            border: {
                right: {
                    style: 'thin',
                    color: 'black'
                },
            }
        });
        row++;
    }

    // rez umid
    let moistureLabel = helpers.getMoistureResistance(offer, language);

    ws.cell(row, 1, row, 2, true).string(xlUtils.message('moisture_resistance', language))
        .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
    ws.cell(row, 3).string(moistureLabel)
        .style(xlUtils.initialStyles).style({
        border: {
            right: {
                style: 'thin',
                color: 'black'
            },
        }
    });
    row++;

    // izolare fonica
    ws.cell(row, 1, row, 2, true).string(xlUtils.message('sound_insulation', language))
        .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
    ws.cell(row, 3).string(`Rw = ${ offer.izolareAcustica } dB`)
        .style(xlUtils.initialStyles).style({
        border: {
            right: {
                style: 'thin',
                color: 'black'
            }
        }
    });
    row++;

    // rezistenta efractie
    if (systemType.type === 'walls') {
        let burglaryRes = xlUtils.message('value_not_specified', language);
        if (offer.burglaryResistance !== '0') {
            burglaryRes = `RC${ offer.burglaryResistance }`;
        }
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('burglary_resistance', language))
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(burglaryRes)
            .style(xlUtils.initialStyles).style({
            border: {right: {style: 'thin', color: 'black'}}
        });
        row++;
    }

    // interax sustineri
    if (systemType.type === 'ceilings' && systemType.ceilingsType === 's') {
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('tip_sustineri', language)).style(xlUtils.initialStyles)
            .style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
        ws.cell(row, 3).string(`${ offer.ceilingSupport }@ max ${ offer.interaxSustineri } cm`)
            .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }
    if (systemType.type === 'linnings') {
        let interaxSustineri = helpers.getInteraxSustineri(offer, language);
        if(interaxSustineri === 'fara') {
            interaxSustineri = xlUtils.message(translationsDetails['fara'], language);
        }
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('interax_sustineri', language)).style(xlUtils.initialStyles)
            .style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
        ws.cell(row, 3).string(interaxSustineri)
            .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }

    // inaltime
    let heightHeader = helpers.getHeightHeader(offer, language);
    let height = helpers.getHeight(offer, language);
    ws.cell(row, 1, row, 2, true).string(heightHeader).style(xlUtils.initialStyles)
        .style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
    ws.cell(row, 3).string(height)
        .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
    row++;

    // greutate sistem
    let weight = helpers.getWeight(offer, language);
    ws.cell(row, 1, row, 2, true).string(xlUtils.message('system_weight', language))
        .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
    ws.cell(row, 3).string(`${ weight } kg/${ xlUtils.message('square_meter_abrev', language) }`)
        .style(xlUtils.initialStyles).style({
        border: {
            right: {
                style: 'thin',
                color: 'black'
            }
        }
    });
    row++;

    // grosime
    if (systemType.type === 'linnings' || systemType.type === 'walls') {
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('thickness', language))
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(`${ offer.thicknessSystem } mm`)
            .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }

    // profile metalice - tip montant
    if (systemType.type === 'ceilings') {
        let profileHeader = helpers.getCeilingsHeader(offer, language);
        let profileLabel = helpers.getCeilingsPrimaryProfile(offer, language);
        ws.cell(row, 1, row, 2, true).string(profileHeader)
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(profileLabel)
            .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
        row++;

        if (systemType.ceilingsType === 's') {
            profileLabel = helpers.getCeilingsSecondaryProfile(offer, language);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('profile_type_secondary', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(profileLabel)
                .style(xlUtils.initialStyles).style({border: {right: {style: 'thin', color: 'black'}}});
            row++;
        }
    }
    if (systemType.type === 'linnings') {
        if (['f', 'i', 'l', 'p'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('montant_type', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        } else if (['nf', 'ni', 'nuu'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsNoisyProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('montant_type', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        }
    }
    if (systemType.type === 'walls') {
        let label = helpers.getLinningsProfile(offer, language);
        let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
        ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('montant_type', language))
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(label)
            .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }

    // tip ghidaj inferior
    if (systemType.type === 'linnings') {
        if (['f', 'i', 'l', 'p'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsLowerProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('lower_guiding', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        } else if (['nf', 'ni', 'nuu'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsNoisyLowerProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('lower_guiding', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        }
    }
    if (systemType.type === 'walls') {
        let label = helpers.getLinningsLowerProfile(offer, language);
        let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
        ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('lower_guiding', language))
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(label)
            .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }

    // tip ghidaj superior
    if (systemType.type === 'linnings') {
        if (['f', 'i', 'l', 'p'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsUpperProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('upper_guiding', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        } else if (['nf', 'ni', 'nuu'].includes(systemType.linningsType)) {
            let label = helpers.getLinningsNoisyUpperProfile(offer, language);
            let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('upper_guiding', language))
                .style(xlUtils.initialStyles).style({
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(label)
                .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
            row++;
        }
    }
    if (systemType.type === 'walls') {
        let label = helpers.getLinningsNoisyUpperProfile(offer, language);
        let rowHeight = Math.ceil(label.length / xlUtils.COL_C_WIDTH);
        ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('upper_guiding', language))
            .style(xlUtils.initialStyles).style({
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(label)
            .style(xlUtils.initialStyles).style({alignment: {wrapText: true}, border: {right: {style: 'thin', color: 'black'}}});
        row++;
    }

    // tip ghidaj perimetral
    if (systemType.type === 'ceilings') {
        let profileLabel = helpers.getCeilingsAuxProfile(offer, language);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('aux_guiding', language))
            .style({
                alignment: {wrapText: true},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
        ws.cell(row, 3).string(profileLabel)
            .style(xlUtils.initialStyles).style({
            alignment: {wrapText: true},
            border: {
                right: {
                    style: 'thin',
                    color: 'black'
                }
            }
        });
        row++;
    }

    // tip placi
    if (systemType.type === 'ceilings') {
        if (systemType.ceilingsType === 's') {
            let platesFaceB = helpers.getWallsPlatesFaceB(offer);
            let rowHeight = Math.ceil(platesFaceB.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type', language)).style({
                alignment: {wrapText: true, vertical: 'center'},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(platesFaceB)
                .style(xlUtils.initialStyles).style({
                alignment: {wrapText: true, vertical: 'center'},
                border: {
                    right: {
                        style: 'thin',
                        color: 'black'
                    }
                }
            });
            row++;
        } else {
            let platesFaceB = helpers.getWallsPlatesFaceB(offer);
            let rowHeight = Math.ceil(platesFaceB.length / xlUtils.COL_C_WIDTH);
            if (rowHeight < 2) {
                rowHeight = 2;
            }
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_lower', language)).style({
                alignment: {wrapText: true, vertical: 'center'},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(platesFaceB)
                .style(xlUtils.initialStyles).style({
                alignment: {wrapText: true, vertical: 'center'},
                border: {
                    right: {
                        style: 'thin',
                        color: 'black'
                    }
                }
            });
            row++;

            if (offer.face1.plate1 !== '') {
                platesFaceB = helpers.getWallsPlatesFaceA(offer);
                let rowHeightB = Math.ceil(platesFaceB.length / xlUtils.COL_C_WIDTH);
                if (rowHeightB < 2) {
                    rowHeightB = 2;
                }
                ws.row(row).setHeight(rowHeightB * xlUtils.DEFAULT_ROW_HEIGHT);
                ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_upper', language)).style({
                    alignment: {wrapText: true, vertical: 'center'},
                    font: {bold: true},
                    border: {left: {style: 'thin', color: 'black'}}
                });
                ws.cell(row, 3).string(platesFaceB)
                    .style(xlUtils.initialStyles).style({
                    alignment: {wrapText: true, vertical: 'center'},
                    border: {
                        right: {
                            style: 'thin',
                            color: 'black'
                        }
                    }
                });
                row++;

            } else {
                ws.row(row).setHeight(2 * xlUtils.DEFAULT_ROW_HEIGHT);
                ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_upper', language)).style({
                    alignment: {wrapText: true, vertical: 'center'},
                    font: {bold: true},
                    border: {left: {style: 'thin', color: 'black'}}
                });
                ws.cell(row, 3).string(xlUtils.message('value_not_specified', language))
                    .style(xlUtils.initialStyles).style({
                    alignment: {wrapText: true, vertical: 'center'},
                    border: {
                        right: {
                            style: 'thin',
                            color: 'black'
                        }
                    }
                });
                row++;

            }

        }
    }

    // tip placi
    if (systemType.type === 'linnings') {
        if (['f', 'i', 'l', 'p'].includes(systemType.linningsType)) {
            let plates = helpers.getLinningsPlates(offer);
            let rowHeight = Math.ceil(plates.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type', language)).style({
                alignment: {wrapText: true, vertical: 'center'},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(plates)
                .style(xlUtils.initialStyles).style({
                alignment: {wrapText: true, vertical: 'center'},
                border: {
                    right: {
                        style: 'thin',
                        color: 'black'
                    }
                }
            });
            row++;
        } else if (['nf', 'ni', 'nuu'].includes(systemType.linningsType)) {
            let plates = helpers.getWallsPlatesFaceA(offer);
            let rowHeight = Math.ceil(plates.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_a', language)).style({
                alignment: {wrapText: true, vertical: 'center'},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(plates)
                .style(xlUtils.initialStyles).style({
                alignment: {wrapText: true, vertical: 'center'},
                border: {
                    right: {
                        style: 'thin',
                        color: 'black'
                    }
                }
            });
            row++;

            plates = helpers.getWallsPlatesFaceB(offer);
            rowHeight = Math.ceil(plates.length / xlUtils.COL_C_WIDTH);
            ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
            ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_b', language)).style({
                alignment: {wrapText: true, vertical: 'center'},
                font: {bold: true},
                border: {left: {style: 'thin', color: 'black'}}
            });
            ws.cell(row, 3).string(plates)
                .style(xlUtils.initialStyles).style({
                alignment: {wrapText: true, vertical: 'center'},
                border: {
                    right: {
                        style: 'thin',
                        color: 'black'
                    }
                }
            });
            row++;
        }
    }

    // tip placi
    if (systemType.type === 'walls') {
        let plates = helpers.getWallsPlatesFaceA(offer);
        let rowHeight = Math.ceil(plates.length / xlUtils.COL_C_WIDTH);
        ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_a', language)).style({
            alignment: {wrapText: true, vertical: 'center'},
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(plates)
            .style(xlUtils.initialStyles).style({
            alignment: {wrapText: true, vertical: 'center'},
            border: {
                right: {
                    style: 'thin',
                    color: 'black'
                }
            }
        });
        row++;

        plates = helpers.getWallsPlatesFaceB(offer);
        rowHeight = Math.ceil(plates.length / xlUtils.COL_C_WIDTH);
        ws.row(row).setHeight(rowHeight * xlUtils.DEFAULT_ROW_HEIGHT);
        ws.cell(row, 1, row, 2, true).string(xlUtils.message('plates_type_b', language)).style({
            alignment: {wrapText: true, vertical: 'center'},
            font: {bold: true},
            border: {left: {style: 'thin', color: 'black'}}
        });
        ws.cell(row, 3).string(plates)
            .style(xlUtils.initialStyles).style({
            alignment: {wrapText: true, vertical: 'center'},
            border: {
                right: {
                    style: 'thin',
                    color: 'black'
                }
            }
        });
        row++;
    }

    // let lastRow = row;
    // tip suport superior

    if (systemType.type !== 'ceilings') {
        let support = xlUtils.message('upper_support_concrete', language);

        if (offer.support === UPPER_SUPPORT_SHEET) {
            support = xlUtils.message('upper_support_sheet', language);
        }

        ws.cell(row, 1, row, 2, true).string(xlUtils.message('upper_support', language))
            .style(xlUtils.initialStyles).style({font: {bold: true}, border: {left: {style: 'thin', color: 'black'}}});
        ws.cell(row, 3).string(support)
            .style(xlUtils.initialStyles).style({
            border: {
                right: {
                    style: 'thin',
                    color: 'black'
                }
            }
        });
        row++;
    }

    // tip izolatie
    let woolType = helpers.getWoolType(offer, language);
    let rowHeightWool = Math.ceil(woolType.length / xlUtils.COL_C_WIDTH);
    ws.row(row).setHeight(rowHeightWool * xlUtils.DEFAULT_ROW_HEIGHT);
    ws.cell(row, 1, row, 2, true).string(xlUtils.message('wool_type', language)).style({
        alignment: {wrapText: true, vertical: 'center'},
        font: {bold: true},
        border: {left: {style: 'thin', color: 'black'}, bottom: {style: 'thin', color: 'black'}}
    });
    ws.cell(row, 3).string(woolType)
        .style(xlUtils.initialStyles).style({
        alignment: {wrapText: true, vertical: 'center'},
        border: {
            right: {style: 'thin', color: 'black'},
            bottom: {style: 'thin', color: 'black'},
        }
    });
    row++;

    // features image
    let lastRow = firstRow + 10;
    if (systemType.type === 'walls') {
        if (systemType.wallsType === 'd' || systemType.wallsType === 'ss' && offer.soundInsulation.toLowerCase().includes('yes')) {
            // 910 / 550 => 1.65
            lastRow = firstRow + 10;
        } else if (systemType.wallsType === 's' || systemType.wallsType === 'ss' && offer.soundInsulation.toLowerCase().includes('no') || systemType.wallsType === 'sl' || systemType.wallsType === 'sla') {
            // 810 / 620 => 1.30
            lastRow = firstRow + 12;
        }
    }
    if (systemType.type === 'linnings') {
        if (systemType.linningsType === 'l' || offer.soundInsulation.toLowerCase().includes('yes')) {
            // 910 / 550 => 1.65
            lastRow = firstRow + 10;
        } else if (systemType.wallsType === 'p' || offer.soundInsulation.toLowerCase().includes('no')) {
            // 810 / 620 => 1.30
            lastRow = firstRow + 12;
        }
    }
    if (systemType.type === 'ceilings') {
        lastRow = firstRow + 10;
    }
    let features3DImage = helpers.get3DImage(offer);

    if (features3DImage) {
        if (fs.existsSync(features3DImage.path)) {
            if (systemType.type === 'walls' && offer.burglaryResistance && offer.burglaryResistance === '4') {
                xlUtils.addTwoCellAnchorImageWithOffset(ws, features3DImage.path, firstRow, 5, lastRow, 8);
            } else if (systemType.type === 'linnings' && systemType.linningsType === 'p') {
                xlUtils.addTwoCellAnchorImageWithOffset(ws, features3DImage.path, firstRow, 5, lastRow, 8);
            } else {
                xlUtils.addTwoCellAnchorImageWithOffset(ws, features3DImage.path, firstRow, 4, lastRow, 9);
            }
        }
        ws.cell(lastRow + 1, 4, lastRow + 1, 8, true).string(xlUtils.message('features_image', language))
            .style(xlUtils.initialStyles).style({
            font: {italics: true},
            alignment: {vertical: 'center', horizontal: 'center'},
            border: {left: {style: 'thin', color: 'black'}},
        });
        row++;
        // ws.cell(lastRow + 2, 4, lastRow + 2, 8, true).string(features3DImage.label)
        //     .style(xlUtils.initialStyles).style({
        //     font: {italics: true},
        //     alignment: {vertical: 'center', horizontal: 'center'},
        //     border: {left: {style: 'thin', color: 'black'}},
        // });
        // row++;
    }
    row++;

    let systemName = translationsDetails[offer.systemName.replace('Creare oferta - ', '')];
    systemName = xlUtils.message(systemName, language);
    
    let links = featureLinks.getLinks(offer, language);
    links.pdfLabel = systemName.toLowerCase();
    links.dwgLabel = systemName.toLowerCase();

    let bookletLabel = xlUtils.message(translationsDetails[links.bookletLabel], language);
    links.bookletLabel = bookletLabel;
    

    ws.cell(row, 1, row, 2, true).string(`${ xlUtils.message('details_pdf', language) }:`)
        .style(xlUtils.initialStyles).style({
        alignment: {vertical: 'center'}
    });
    ws.cell(row, 3).formula(`HYPERLINK("${ links.pdf }", "${ links.pdfLabel }")`)
        .style(xlUtils.initialStyles).style({
        font: {color: 'blue', underline: true},
        alignment: {vertical: 'center'}
    });
    row++;

    ws.cell(row, 1, row, 2, true).string(`${ xlUtils.message('details_dwg', language) }:`)
        .style(xlUtils.initialStyles).style({
        alignment: {vertical: 'center'}
    });
    ws.cell(row, 3).formula(`HYPERLINK("${ links.dwg }", "${ links.dwgLabel }")`)
        .style(xlUtils.initialStyles).style({
        font: {color: 'blue', underline: true},
        alignment: {vertical: 'center'}
    });
    row++;

    ws.cell(row, 1, row, 2, true).string(`${ xlUtils.message('details_booklet', language) }:`)
        .style(xlUtils.initialStyles).style({
        alignment: {vertical: 'center'}
    });
    ws.cell(row, 3).formula(`HYPERLINK("${ links.booklet }", "${ links.bookletLabel }")`)
        .style(xlUtils.initialStyles).style({
        font: {color: 'blue', underline: true},
        alignment: {vertical: 'center'}
    });
    row++;

    return row;
}


module.exports = {
    setFeatures
};