const xl = require('excel4node');
const xlUtils = require('./excelService/excelUtils');
const systemService = require('./systemService');
const moment = require('moment');

// main function
const generateReportSessions = (sessions, users, excelName, language) => {
    return new Promise((resolve, reject) => {
        // add wb
        let wb = new xl.Workbook();

        // add ws
        let sheetName = `${xlUtils.message('report', language)}_${excelName}`;
        let ws = wb.addWorksheet(sheetName);
        // col width
        for (let i = 1; i <= 13; i++) {
            ws.column(i).setWidth(15);
        }

        // get unique user ids
        const userIds = [];
        sessions.forEach(session => {
            let userId = userIds.find(el => el.equals(session.userId));
            if (!userId) {
                userIds.push(session.userId);
            }
        });

        // build first row
        let row = 1;
        ws.cell(row, 1).string('Nume').style({font: {bold: true}});
        ws.cell(row, 2).string('Email').style({font: {bold: true}});
        ws.cell(row, 3).string('Nr. oferte').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 4).string('Nr. sisteme total').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 5).string('Nr. sisteme pereti').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 6).string('Nr. sisteme placari').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 7).string('Nr. sisteme plafoane').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 8).string('m2 de sistem').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 9).string('m2 de placi').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 10).string('ml de profile').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 11).string('Rez foc').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 12).string('Rez umiditate').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 13).string('Rez acustica').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 14).string('Bloc locuinte').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 15).string('Cladire birouri').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 16).string('Hala industriala sau depozit').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 17).string('Complex comercial').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 18).string('Hotel').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 19).string('Spital').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 20).string('Divertisment(piscina, cinema, sala concrete etc.)').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, 21).string('Invatamant').style({
            font: {bold: true},
            alignment: {horizontal: 'center', vertical: 'center'}
        });
        row++;

        userIds.forEach(userId => {
            let offers = 0;
            let systems = 0;
            let systemsWalls = 0;
            let systemsLinnings = 0;
            let systemsCeilings = 0;
            let systemsSQM = 0;
            let platesSQM = 0;
            let jointsML = 0;
            let systemsRezFoc = 0;
            let systemsRezUmid = 0;
            let systemsRezAcus = 0;
            let typeObjective = 0;
            let typeObjective2 = 0;
            let typeObjective3 = 0;
            let typeObjective4 = 0;
            let typeObjective5 = 0;
            let typeObjective6 = 0;
            let typeObjective7 = 0;
            let typeObjective8 = 0;

            // calculate cell values
            let filteredOffers = sessions.filter(el => el.userId.equals(userId));
            if (filteredOffers) {
                filteredOffers.forEach(offer => {
                    if (offer.data && offer.data.typeObjective) {
                        switch (offer.data.typeObjective) {
                            case 'Bloc locuinte':
                                typeObjective++;
                                break;
                            case 'Cladire birouri':
                                typeObjective2++;
                                break;
                            case 'Hala industriala sau depozit':
                                typeObjective3++;
                                break;
                            case 'Complex comercial':
                                typeObjective4++;
                                break;
                            case 'Hotel':
                                typeObjective5++;
                                break;
                            case 'Spital':
                                typeObjective6++;
                                break;
                            case 'Divertisment(piscina, cinema, sala concrete etc.)':
                                typeObjective7++;
                                break;
                            case 'Invatamant':
                                typeObjective8++;
                                break;
                        }
                    }

                    offer.session.forEach(system => {
                        let systemType = systemService.getSystemType(system);
                        if (systemType.type === 'ceilings') {
                            systemsCeilings++;
                        }
                        if (systemType.type === 'linnings') {
                            systemsLinnings++;
                        }
                        if (systemType.type === 'walls') {
                            systemsWalls++;
                        }
                        if (system.fireResistance !== '0m') {
                            systemsRezFoc++;
                        }
                        if (system.moistureResistance !== '0') {
                            systemsRezUmid++;
                        }
                        if (system.soundInsulation !== 'Nu') {
                            systemsRezAcus++;
                        }
                        if (system.consumption.length > 0) {
                            system.consumption.forEach(consumption => {
                                if (consumption && consumption.category === '0') {
                                    platesSQM += consumption.amount * system.surface;
                                }
                            });
                        }
                        if (system.jointLength) {
                            jointsML += system.jointLength;
                        }
                        systemsSQM += system.surface || 1;
                        systems++;
                    });
                    offers++;
                });
            }

            // build excel row
            let user = users.find(el => el._id.equals(userId));
            if (user) {
                let name = user ? `${user.firstName} ${user.lastName}` : '';
                let email = user ? user.emailAddress : '';
                ws.cell(row, 1).string(name);
                ws.cell(row, 2).string(email);
                ws.cell(row, 3).number(offers).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 4).number(systems).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 5).number(systemsWalls).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 6).number(systemsLinnings).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 7).number(systemsCeilings).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 8).number(systemsSQM).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 9).number(platesSQM).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 10).number(jointsML).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 11).number(systemsRezFoc).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 12).number(systemsRezUmid).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 13).number(systemsRezAcus).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 14).number(typeObjective).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 15).number(typeObjective2).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 16).number(typeObjective3).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 17).number(typeObjective4).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 18).number(typeObjective5).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 19).number(typeObjective6).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 20).number(typeObjective7).style({alignment: {horizontal: 'center', vertical: 'center'}});
                ws.cell(row, 21).number(typeObjective8).style({alignment: {horizontal: 'center', vertical: 'center'}});
                row++;
            }
        });

        let fileName = `${Date.now()}_${xlUtils.message('report_admin', language)}_${excelName}.xlsx`;
        wb.write(`${global.ROOT_PATH}/uploads/${fileName}`, function (err) {
            if (!err) {
                resolve(fileName);
            }
        });
    });
}

const generateReportSessions1 = (sessions, users, excelName, language) => {
    return new Promise((resolve, reject) => {
        // add wb
        let wb = new xl.Workbook();

        // add ws
        let sheetName = `${xlUtils.message('report', language)}_1_${excelName}`;
        let ws = wb.addWorksheet(sheetName);

        let offerTypes = [
            {
                label: 'Perete D',
                value: 'walls_d',
            },
            {
                label: 'Perete S',
                value: 'walls_s',
            },
            {
                label: 'Perete SL',
                value: 'walls_sl',
            },
            {
                label: 'Perete SLA',
                value: 'walls_sla',
            },
            {
                label: 'Placare cu fixari',
                value: 'linnings_f',
            },
            {
                label: 'Placare cu independente',
                value: 'linnings_i',
            },
            {
                label: 'Placare linare',
                value: 'linnings_l',
            },
            {
                label: 'Placare lipire',
                value: 'linnings_p',
            },
            {
                label: 'Placare noisy cu fixari',
                value: 'linnings_nf',
            },
            {
                label: 'Placare noisy cu independente',
                value: 'linnings_ni',
            },
            {
                label: 'Placare noisy UU',
                value: 'linnings_nuu',
            },
            {
                label: 'Plafoane suspendate',
                value: 'ceilings_s',
            },
            {
                label: 'Plafoane independente',
                value: 'ceilings_ss',
            },
        ];
        let objectiveTypes = [
            {
                label: 'Total',
                value: 0
            },
            {
                label: 'Bloc locuinte',
                value: 1
            },
            {
                label: 'Cladire birouri',
                value: 2
            },
            {
                label: 'Hala industriala sau depozit',
                value: 3
            },
            {
                label: 'Complex comercial',
                value: 4
            },
            {
                label: 'Hotel',
                value: 5
            },
            {
                label: 'Spital',
                value: 6
            },
            {
                label: 'Divertisment(piscina, cinema, sala concrete etc.)',
                value: 7
            },
            {
                label: 'Invatamant',
                value: 8
            },
        ];
        let fireResTypes = [
            {
                label: 'EI0',
                value: 0
            },
            {
                label: 'EI15',
                value: 15
            },
            {
                label: 'EI30',
                value: 30
            },
            {
                label: 'EI45',
                value: 45
            },
            {
                label: 'EI60',
                value: 60
            },
            {
                label: 'EI90',
                value: 90
            },
            {
                label: 'EI120',
                value: 120
            },
            {
                label: 'EI180',
                value: 180
            },
        ];

        // init array
        let array = [];
        for (let i = 0; i < offerTypes.length; i++) {
            let iVal = offerTypes[i].value;
            for (let j = 0; j < objectiveTypes.length; j++) {
                let jVal = objectiveTypes[j].value;
                for (let k = 0; k < fireResTypes.length; k++) {
                    let kVal = fireResTypes[k].value;
                    array[`${iVal}_objType_${jVal}_fr_${kVal}`] = 0;
                }
            }
        }

        sessions.forEach(session => {
            let project = session.data;
            let offers = session.session;

            // objective type
            let objType = null;
            if (project.typeObjective) {
                let findObj = objectiveTypes.find(el => el.label === project.typeObjective);
                if (findObj) {
                    objType = findObj.value;
                }
            }

            if (objType) {
                offers.forEach(offer => {

                    // offer type
                    let systemType = systemService.getSystemType(offer);
                    let offerType = `${systemType.type}_`;
                    if (systemType.type === 'ceilings') {
                        offerType += systemType.ceilingsType;
                    } else if (systemType.type === 'linnings') {
                        offerType += systemType.linningsType;
                    } else if (systemType.type === 'walls') {
                        offerType += systemType.wallsType;
                    }

                    // fire res type
                    let fireRes = offer.fireResistance.slice(0, -1);

                    // nr oferte
                    array[`${offerType}_objType_${objType}_fr_${fireRes}`] += 1;
                    array[`${offerType}_objType_0_fr_${fireRes}`] += 1;
                });
            }
        });

        // col width
        ws.column(1).setWidth(30);
        for (let i = 2; i <= 73; i++) {
            ws.column(i).setWidth(8);
        }

        let row = 1;
        let col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('').style({font: {bold: true}});
        ws.cell(row, col + 1, row, col + 8, true).string(objectiveTypes[0].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}, left: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 9, row, col + 16, true).string(objectiveTypes[1].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 17, row, col + 24, true).string(objectiveTypes[2].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 25, row, col + 32, true).string(objectiveTypes[3].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 33, row, col + 40, true).string(objectiveTypes[4].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 41, row, col + 48, true).string(objectiveTypes[5].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 49, row, col + 56, true).string(objectiveTypes[6].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 57, row, col + 64, true).string(objectiveTypes[7].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 65, row, col + 72, true).string(objectiveTypes[8].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });


        row++;
        col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('NR oferte').style({
            font: {bold: true},
            alignment: {wrapText: true, vertical: 'center'},
            border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}}
        });
        objectiveTypes.forEach(objectiveType => {
            fireResTypes.forEach(fireResType => {
                col++;
                if (fireResType.value === 180) {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                } else {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                }
            });
        });

        offerTypes.forEach(offerType => {
            row++;
            col = 1;
            ws.cell(row, col).string(offerType.label).style({font: {bold: true}, border: {right: {style: 'medium', color: 'black'}}});
            objectiveTypes.forEach(objectiveType => {
                fireResTypes.forEach(fireResType => {
                    col++;
                    let propertyName = `${offerType.value}_objType_${objectiveType.value}_fr_${fireResType.value}`;
                    if (fireResType.value === 180) {
                        ws.cell(row, col).number(Number(array[propertyName].toFixed(2))).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'},
                            border: {right: {style: 'medium', color: 'black'}},
                        });
                    } else {
                        ws.cell(row, col).number(Number(array[propertyName].toFixed(2))).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'},
                        });
                    }
                });
            });
        });

        let fileName = `${Date.now()}_${xlUtils.message('report', language)}_1_${excelName}.xlsx`;
        wb.write(`${global.ROOT_PATH}/uploads/${fileName}`, function (err) {
            if (!err) {
                resolve(fileName);
            }
        });
    });
}

const generateReportSessions2 = (sessions, users, excelName, language) => {
    return new Promise((resolve, reject) => {
        // add wb
        let wb = new xl.Workbook();

        // add ws
        let sheetName = `${xlUtils.message('report', language)}_2_${excelName}`;
        let ws = wb.addWorksheet(sheetName);

        let offerTypes = [
            {
                label: 'Perete D',
                value: 'walls_d',
            },
            {
                label: 'Perete S',
                value: 'walls_s',
            },
            {
                label: 'Perete SL',
                value: 'walls_sl',
            },
            {
                label: 'Perete SLA',
                value: 'walls_sla',
            },
            {
                label: 'Placare cu fixari',
                value: 'linnings_f',
            },
            {
                label: 'Placare cu independente',
                value: 'linnings_i',
            },
            {
                label: 'Placare linare',
                value: 'linnings_l',
            },
            {
                label: 'Placare lipire',
                value: 'linnings_p',
            },
            {
                label: 'Placare noisy cu fixari',
                value: 'linnings_nf',
            },
            {
                label: 'Placare noisy cu independente',
                value: 'linnings_ni',
            },
            {
                label: 'Placare noisy UU',
                value: 'linnings_nuu',
            },
            {
                label: 'Plafoane suspendate',
                value: 'ceilings_s',
            },
            {
                label: 'Plafoane independente',
                value: 'ceilings_ss',
            },
        ];
        let objectiveTypes = [
            {
                label: 'Total',
                value: 0
            },
            {
                label: 'Bloc locuinte',
                value: 1
            },
            {
                label: 'Cladire birouri',
                value: 2
            },
            {
                label: 'Hala industriala sau depozit',
                value: 3
            },
            {
                label: 'Complex comercial',
                value: 4
            },
            {
                label: 'Hotel',
                value: 5
            },
            {
                label: 'Spital',
                value: 6
            },
            {
                label: 'Divertisment(piscina, cinema, sala concrete etc.)',
                value: 7
            },
            {
                label: 'Invatamant',
                value: 8
            },
        ];
        let fireResTypes = [
            {
                label: 'EI0',
                value: 0
            },
            {
                label: 'EI15',
                value: 15
            },
            {
                label: 'EI30',
                value: 30
            },
            {
                label: 'EI45',
                value: 45
            },
            {
                label: 'EI60',
                value: 60
            },
            {
                label: 'EI90',
                value: 90
            },
            {
                label: 'EI120',
                value: 120
            },
            {
                label: 'EI180',
                value: 180
            },
        ];

        // init array
        let array = [];
        for (let i = 0; i < offerTypes.length; i++) {
            let iVal = offerTypes[i].value;
            for (let j = 0; j < objectiveTypes.length; j++) {
                let jVal = objectiveTypes[j].value;
                for (let k = 0; k < fireResTypes.length; k++) {
                    let kVal = fireResTypes[k].value;
                    array[`${iVal}_objType_${jVal}_fr_${kVal}`] = 0;
                }
            }
        }

        sessions.forEach(session => {
            let project = session.data;
            let offers = session.session;

            // objective type
            let objType = null;
            if (project.typeObjective) {
                let findObj = objectiveTypes.find(el => el.label === project.typeObjective);
                if (findObj) {
                    objType = findObj.value;
                }
            }

            if (objType) {
                offers.forEach(offer => {

                    // offer type
                    let systemType = systemService.getSystemType(offer);
                    let offerType = `${systemType.type}_`;
                    if (systemType.type === 'ceilings') {
                        offerType += systemType.ceilingsType;
                    } else if (systemType.type === 'linnings') {
                        offerType += systemType.linningsType;
                    } else if (systemType.type === 'walls') {
                        offerType += systemType.wallsType;
                    }

                    // fire res type
                    let fireRes = offer.fireResistance.slice(0, -1);

                    // m2 sistem
                    array[`${offerType}_objType_${objType}_fr_${fireRes}`] += offer.surface;
                    array[`${offerType}_objType_0_fr_${fireRes}`] += offer.surface;
                });
            }
        });

        // col width
        ws.column(1).setWidth(30);
        for (let i = 2; i <= 73; i++) {
            ws.column(i).setWidth(10);
        }

        let row = 1;
        let col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('').style({font: {bold: true}});
        ws.cell(row, col + 1, row, col + 8, true).string(objectiveTypes[0].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}, left: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 9, row, col + 16, true).string(objectiveTypes[1].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 17, row, col + 24, true).string(objectiveTypes[2].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 25, row, col + 32, true).string(objectiveTypes[3].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 33, row, col + 40, true).string(objectiveTypes[4].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 41, row, col + 48, true).string(objectiveTypes[5].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 49, row, col + 56, true).string(objectiveTypes[6].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 57, row, col + 64, true).string(objectiveTypes[7].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 65, row, col + 72, true).string(objectiveTypes[8].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });


        row++;
        col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('m2 sistem').style({
            font: {bold: true},
            alignment: {wrapText: true, vertical: 'center'},
            border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}}
        });
        objectiveTypes.forEach(objectiveType => {
            fireResTypes.forEach(fireResType => {
                col++;
                if (fireResType.value === 180) {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                } else {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                }
            });
        });

        offerTypes.forEach(offerType => {
            row++;
            col = 1;
            ws.cell(row, col).string(offerType.label).style({font: {bold: true}, border: {right: {style: 'medium', color: 'black'}}});
            objectiveTypes.forEach(objectiveType => {
                fireResTypes.forEach(fireResType => {
                    col++;
                    let propertyName = `${offerType.value}_objType_${objectiveType.value}_fr_${fireResType.value}`;
                    if (fireResType.value === 180) {
                        ws.cell(row, col).number(Number(array[propertyName].toFixed(2))).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'},
                            border: {right: {style: 'medium', color: 'black'}},
                        });
                    } else {
                        ws.cell(row, col).number(Number(array[propertyName].toFixed(2))).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}, 
                        });
                    }
                });
            });
        });

        let fileName = `${Date.now()}_${xlUtils.message('report', language)}_2_${excelName}.xlsx`;
        wb.write(`${global.ROOT_PATH}/uploads/${fileName}`, function (err) {
            if (!err) {
                resolve(fileName);
            }
        });
    });
}

const generateReportSessions3 = (sessions, users, excelName, language) => {
    return new Promise((resolve, reject) => {
        // add wb
        let wb = new xl.Workbook();

        // add ws
        let sheetName = `${xlUtils.message('report', language)}_3_${excelName}`;
        let ws = wb.addWorksheet(sheetName);

        let offerTypes = [
            {
                label: 'Perete D',
                value: 'walls_d',
            },
            {
                label: 'Perete S',
                value: 'walls_s',
            },
            {
                label: 'Perete SL',
                value: 'walls_sl',
            },
            {
                label: 'Perete SLA',
                value: 'walls_sla',
            },
            {
                label: 'Placare cu fixari',
                value: 'linnings_f',
            },
            {
                label: 'Placare cu independente',
                value: 'linnings_i',
            },
            {
                label: 'Placare linare',
                value: 'linnings_l',
            },
            {
                label: 'Placare lipire',
                value: 'linnings_p',
            },
            {
                label: 'Placare noisy cu fixari',
                value: 'linnings_nf',
            },
            {
                label: 'Placare noisy cu independente',
                value: 'linnings_ni',
            },
            {
                label: 'Placare noisy UU',
                value: 'linnings_nuu',
            },
            {
                label: 'Plafoane suspendate',
                value: 'ceilings_s',
            },
            {
                label: 'Plafoane independente',
                value: 'ceilings_ss',
            },
        ];
        let objectiveTypes = [
            {
                label: 'Total',
                value: 0
            },
            {
                label: 'Bloc locuinte',
                value: 1
            },
            {
                label: 'Cladire birouri',
                value: 2
            },
            {
                label: 'Hala industriala sau depozit',
                value: 3
            },
            {
                label: 'Complex comercial',
                value: 4
            },
            {
                label: 'Hotel',
                value: 5
            },
            {
                label: 'Spital',
                value: 6
            },
            {
                label: 'Divertisment(piscina, cinema, sala concrete etc.)',
                value: 7
            },
            {
                label: 'Invatamant',
                value: 8
            },
        ];
        let fireResTypes = [
            {
                label: 'EI0',
                value: 0
            },
            {
                label: 'EI15',
                value: 15
            },
            {
                label: 'EI30',
                value: 30
            },
            {
                label: 'EI45',
                value: 45
            },
            {
                label: 'EI60',
                value: 60
            },
            {
                label: 'EI90',
                value: 90
            },
            {
                label: 'EI120',
                value: 120
            },
            {
                label: 'EI180',
                value: 180
            },
        ];

        // init array
        let array = [];
        for (let i = 0; i < offerTypes.length; i++) {
            let iVal = offerTypes[i].value;
            for (let j = 0; j < objectiveTypes.length; j++) {
                let jVal = objectiveTypes[j].value;
                for (let k = 0; k < fireResTypes.length; k++) {
                    let kVal = fireResTypes[k].value;
                    array[`${iVal}_objType_${jVal}_fr_${kVal}`] = 0;
                }
            }
        }

        sessions.forEach(session => {
            let project = session.data;
            let offers = session.session;

            // objective type
            let objType = null;
            if (project.typeObjective) {
                let findObj = objectiveTypes.find(el => el.label === project.typeObjective);
                if (findObj) {
                    objType = findObj.value;
                }
            }

            if (objType) {
                offers.forEach(offer => {

                    // offer type
                    let systemType = systemService.getSystemType(offer);
                    let offerType = `${systemType.type}_`;
                    if (systemType.type === 'ceilings') {
                        offerType += systemType.ceilingsType;
                    } else if (systemType.type === 'linnings') {
                        offerType += systemType.linningsType;
                    } else if (systemType.type === 'walls') {
                        offerType += systemType.wallsType;
                    }

                    // fire res type
                    let fireRes = offer.fireResistance.slice(0, -1);

                    // m2 placi
                    offer.consumption.forEach(product => {
                        if (product.category === '0') {
                            array[`${offerType}_objType_${objType}_fr_${fireRes}`] += product.amount * offer.surface;
                            array[`${offerType}_objType_0_fr_${fireRes}`] += product.amount * offer.surface;
                        }
                    });
                });
            }
        });

        // col width
        ws.column(1).setWidth(30);
        for (let i = 2; i <= 73; i++) {
            ws.column(i).setWidth(10);
        }

        let row = 1;
        let col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('').style({font: {bold: true}});
        ws.cell(row, col + 1, row, col + 8, true).string(objectiveTypes[0].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}, left: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 9, row, col + 16, true).string(objectiveTypes[1].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 17, row, col + 24, true).string(objectiveTypes[2].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 25, row, col + 32, true).string(objectiveTypes[3].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 33, row, col + 40, true).string(objectiveTypes[4].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 41, row, col + 48, true).string(objectiveTypes[5].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 49, row, col + 56, true).string(objectiveTypes[6].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 57, row, col + 64, true).string(objectiveTypes[7].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });
        ws.cell(row, col + 65, row, col + 72, true).string(objectiveTypes[8].label).style({
            font: {bold: true},
            border: {right: {style: 'medium', color: 'black'}},
            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
        });


        row++;
        col = 1;
        ws.row(row).setHeight(xlUtils.DEFAULT_ROW_HEIGHT * 2);
        ws.cell(row, 1).string('m2 placi').style({
            font: {bold: true},
            alignment: {wrapText: true, vertical: 'center'},
            border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}}
        });
        objectiveTypes.forEach(objectiveType => {
            fireResTypes.forEach(fireResType => {
                col++;
                if (fireResType.value === 180) {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {right: {style: 'medium', color: 'black'}, bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                } else {
                    ws.cell(row, col).string(fireResType.label).style({
                        font: {bold: true},
                        border: {bottom: {style: 'medium', color: 'black'}},
                        alignment: {wrapText: true, horizontal: 'center', vertical: 'center'}
                    });
                }
            });
        });

        offerTypes.forEach(offerType => {
            row++;
            col = 1;
            ws.cell(row, col).string(offerType.label).style({font: {bold: true}, border: {right: {style: 'medium', color: 'black'}}});
            objectiveTypes.forEach(objectiveType => {
                fireResTypes.forEach(fireResType => {
                    col++;
                    let propertyName = `${offerType.value}_objType_${objectiveType.value}_fr_${fireResType.value}`;
                    if (fireResType.value === 180) {
                        ws.cell(row, col).number(array[propertyName]).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'},
                            border: {right: {style: 'medium', color: 'black'}},
                        });
                    } else {
                        ws.cell(row, col).number(array[propertyName]).style({
                            alignment: {wrapText: true, horizontal: 'center', vertical: 'center'},
                        });
                    }
                });
            });
        });

        let fileName = `${Date.now()}_${xlUtils.message('report', language)}_3_${excelName}.xlsx`;
        wb.write(`${global.ROOT_PATH}/uploads/${fileName}`, function (err) {
            if (!err) {
                resolve(fileName);
            }
        });
    });
}

const generateUsersReport = (users, language) => {
    return new Promise((resolve, reject) => {
        // add wb
        let wb = new xl.Workbook();

        // add ws
        let ws = wb.addWorksheet(`${xlUtils.message('report_users', language)}`);
        // col width
        for (let i = 1; i <= 8; i++) {
            ws.column(i).setWidth(15);
        }

        // build first row
        let row = 1;
        ws.cell(row, 1).string('Nume').style({font: {bold: true}});
        ws.cell(row, 2).string('Email').style({font: {bold: true}});
        ws.cell(row, 3).string('Nr. telefon').style({font: {bold: true}});
        ws.cell(row, 4).string('Limba').style({font: {bold: true}});
        ws.cell(row, 5).string('Status').style({font: {bold: true}});
        ws.cell(row, 6).string('Rol').style({font: {bold: true}});
        ws.cell(row, 7).string('Data inregistrare').style({font: {bold: true}});
        ws.cell(row, 8).string('Ultima logare').style({font: {bold: true}});
        ws.cell(row, 9).string('Numar autentificari').style({font: {bold: true}});
        row++;

        users.forEach(user => {
            let logins;
            if (user.logins && user.logins.length) {
                logins = `${user.logins.length}`;
            } else {
                logins = '-';
            }
            ws.cell(row, 1).string(`${user.firstName} ${user.lastName}`);
            ws.cell(row, 2).string(user.emailAddress);
            ws.cell(row, 3).string(user.phoneNumber);
            ws.cell(row, 4).string(user.language);
            ws.cell(row, 5).string(user.activated ? 'activ' : 'inactiv');
            ws.cell(row, 6).string(user.isMasterAdmin ? 'masterAdmin' : user.isAdmin ? 'admin' : 'general');
            ws.cell(row, 7).string(user.createdOn ? moment(user.createdOn).format('DD-MM-YYYY') : '-');
            ws.cell(row, 8).string(user.lastLogin ? moment(user.lastLogin).format('DD-MM-YYYY') : '-');
            ws.cell(row, 9).string(logins);
            row++;
        });

        let fileName = `${Date.now()}_${xlUtils.message('report_users', language)}.xlsx`;
        wb.write(`${global.ROOT_PATH}/uploads/${fileName}`, function (err) {
            if (!err) {
                resolve(fileName);
            }
        });
    });
}

module.exports = {
    generateReportSessions,
    generateReportSessions1,
    generateReportSessions2,
    generateReportSessions3,
    generateUsersReport
};