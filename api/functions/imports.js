const databaseService = require('../../utils/databaseService/databaseService.js');
const utilityService = require('../../utils/utilityService.js');
const xlsx = require('node-xlsx');
const { uniqBy } = require('lodash');

/**
 * Saving the ceiling systems in the database after prework
 * @param {*} req
 * @param {*} language
 * @returns
 */
const sendCeiling = (req, language) => {
    return new Promise((resolve, reject) => {
        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_systems_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;
                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let plates = utilityService.buildStructureCeilingProfile(obj[sheetTabIndex]);
                        let systemCodes = utilityService.putSystemCodesCeiling(obj[sheetTabIndex], importName);

                        databaseService.deletePreviousImportedPlates({importName: importName}, language).then(() => {
                            plates.forEach((plate, index) => {
                                saveImportedPlates(plate, language, "all", req.body.importName);
                            })
                        })
                        // also add sheet name
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                            databaseService.saveToUploads(objUploads, language);
                        })
                        databaseService.deletePreviousSystemCodes({importName: importName}, language).then(() => {
                            let promises = [];

                            systemCodes.forEach(systemCode => {
                                promises.push(databaseService.saveSystemCode(systemCode));
                            })

                            return Promise.all(promises);
                        });
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Saving the walls systems in the database after prework
 * @param {*} req
 * @param {*} language
 * @returns
 */
const sendSystemsData = (req, language) => {
    return new Promise((resolve, reject) => {

        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_systems_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;
                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let platesAccordingToProfileTypeAndInterax = utilityService.buildStructurePlatesAccordingToProfileTypeAndInterax(obj[sheetTabIndex]);
                        let platesAccordingToFireResistance = utilityService.buildStructurePlatesAccordingToFireResistance(obj[sheetTabIndex]);
                        let platesAccordingToMoistureResistance = utilityService.buildStructurePlatesAccordingToMoistureResistance(obj[sheetTabIndex]);
                        let platesAccordingTBurglaryResistance = utilityService.buildStructurePlatesAccordingToBurglaryResistance(obj[sheetTabIndex]);
                        let systemCodes = utilityService.putSystemCodes(obj[sheetTabIndex], importName);

                        databaseService.deletePreviousImportedPlates({importName: importName}, language).then(() => {
                            platesAccordingToProfileTypeAndInterax.forEach(plate => {
                                saveImportedPlates(plate, language, "profileTypeAndInterax", req.body.importName);
                            })
                            platesAccordingToFireResistance.forEach(plate => {
                                saveImportedPlates(plate, language, "fireResistance", req.body.importName);
                            })
                            platesAccordingToMoistureResistance.forEach(plate => {
                                saveImportedPlates(plate, language, "moistureResistance", req.body.importName);
                            })
                            platesAccordingTBurglaryResistance.forEach(plate => {
                                saveImportedPlates(plate, language, "burglaryResistance", req.body.importName);
                            })
                        })

                        // also add sheet name
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                            databaseService.saveToUploads(objUploads, language);
                        })
                        databaseService.deletePreviousSystemCodes({importName: importName}, language).then(() => {
                            let promises = [];

                            systemCodes.forEach(systemCode => {
                                promises.push(databaseService.saveSystemCode(systemCode));
                            })

                            return Promise.all(promises);
                        })
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Saving the plating systems in the database after prework
 * @param {*} req
 * @param {*} language
 * @returns
 */
const sendPlatingSystemsData = (req, language) => {
    return new Promise((resolve, reject) => {

        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_systems_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;
                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let platesAccordingToProfileTypeAndInterax = utilityService.buildStructurePlatesAccordingToProfileTypeAndInteraxPlating(obj[sheetTabIndex]);
                        let platesAccordingToFireResistance = utilityService.buildStructurePlatesAccordingToFireResistancePlating(obj[sheetTabIndex]);
                        let platesAccordingToMoistureResistance = utilityService.buildStructurePlatesAccordingToMoistureResistancePlating(obj[sheetTabIndex]);

                        let systemCodes = utilityService.putSystemCodesPlating(obj[sheetTabIndex], importName);

                        databaseService.deletePreviousImportedPlatingPlates({importName: importName}, language).then(() => {
                            platesAccordingToProfileTypeAndInterax.forEach(plate => {
                                saveImportedPlatingPlates(plate, language, "profileTypeAndInterax", req.body.importName);
                            })
                            platesAccordingToFireResistance.forEach(plate => {
                                saveImportedPlatingPlates(plate, language, "fireResistance", req.body.importName);
                            })
                            platesAccordingToMoistureResistance.forEach(plate => {
                                saveImportedPlatingPlates(plate, language, "moistureResistance", req.body.importName);
                            })
                        })

                        // also add sheet name
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                            databaseService.saveToUploads(objUploads, language);
                        })
                        databaseService.deletePreviousSystemCodes({importName: importName}, language)
                        .then(() => {
                            return databaseService.saveAllSystemCodes(systemCodes);
                        });
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Saving the Noisy plates in the database after prework
 * @param {*} req
 * @param {*} language
 * @returns
 */
const sendNoisyPlatingSystemsData = (req, language) => {
    return new Promise((resolve, reject) => {

        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_systems_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;
                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let platesAccordingToProfileTypeAndInterax = utilityService.buildStructureNoisyPlatesInteraxAndProfileType(obj[sheetTabIndex]);
                        let platesAccordingToFireResistance = utilityService.buildStructureNoisyPlatesFireResistance(obj[sheetTabIndex]);
                        let platesAccordingToMoistureResistance = utilityService.buildStructureNoisyPlatesMoistureResistance(obj[sheetTabIndex]);
                        let systemCodes = utilityService.putSystemCodesNoisy(obj[sheetTabIndex], importName);

                        databaseService.deletePreviousImportedNoisyPlatingPlates({importName: importName}, language).then(() => {
                            platesAccordingToProfileTypeAndInterax.forEach(plate => {
                                saveImportedNoisyPlatingPlates(plate, language, "profileTypeAndInterax", req.body.importName);
                            })
                            platesAccordingToFireResistance.forEach(plate => {
                                saveImportedNoisyPlatingPlates(plate, language, "fireResistance", req.body.importName);
                            })
                            platesAccordingToMoistureResistance.forEach(plate => {
                                saveImportedNoisyPlatingPlates(plate, language, "moistureResistance", req.body.importName);
                            })
                        })

                        // also add sheet name
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                            databaseService.saveToUploads(objUploads, language);
                        })
                        databaseService.deletePreviousSystemCodes({importName: importName}, language).then(() => {
                            let promises = [];

                            systemCodes.forEach(systemCode => {
                                promises.push(databaseService.saveSystemCode(systemCode));
                            })

                            return Promise.all(promises);
                        })
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Save plates DB
 * @param req
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveImportedNoisyPlatingPlates = (data, language, type, name) => {
    return new Promise((resolve, reject) => {
        let allPlates = []
        data.plates.forEach(plate => {
            allPlates.push({
                face1: {
                    plate1: plate.face1[0],
                    plate2: plate.face1[1],
                    plate3: plate.face1[2],
                },
                face2: {
                    plate1: plate.face2[0],
                    plate2: plate.face2[1],
                    plate3: plate.face2[2],
                },
            })
        })
        const platesData = {
            importName: name,
            conditions: {
                conditionType: type,
                profileType: data.profileType,
                profileType1: data.profileType1,
                profileType2: data.profileType2,
                heightMin: data.hMin,
                heightMax: data.hMax,
                fireResistance: data.fireResistance + (type === 'fireResistance' ? 'm' : ''),
                interaxSustineri: data.interaxSustineri,
                interax: data.interax,
                interax1: data.interax1,
                interax2: data.interax2,
                moistureResistance: data.moistureResistance,
            },
            plates: allPlates
        };

        return databaseService.saveImportedNoisyPlatingPlates(platesData, language)
            .then(() => resolve())
            .catch(err => reject(err));
    })
};

/**
 * Getting imported plates
 * @param language
 * @returns {Promise}
 **/
const getImportedPlates = (systemName, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '';
        if (systemName === 'Simplu') {
            queryName = 'Sisteme - Simplu Placat'
        }
        if (systemName === 'Dublu') {
            queryName = 'Sisteme - Dublu Placat'
        }
        if (systemName === 'Triplu') {
            queryName = 'Sisteme - Triplu Placat'
        }
        if (systemName === 'Plafoane Simple') {
            queryName = 'Sisteme - Plafoane Simple'
        }
        if (systemName === 'Plafoane Duble') {
            queryName = 'Sisteme - Plafoane Duble'
        }
        if (systemName === 'Plafoane Triple') {
            queryName = 'Sisteme - Plafoane Triple'
        }
        if (systemName === 'Plafoane Cvadruple') {
            queryName = 'Sisteme - Plafoane Cvadruple'
        }
        if (systemName === 'Pereti Smart Simplu') {
            queryName = 'Pereti Smart - Simplu Placat'
        }
        if (systemName === 'Pereti Smart Dublu') {
            queryName = 'Pereti Smart - Dublu Placat'
        }

        return databaseService.getImportedPlates({importName: queryName}, {}, null, language)
            .then(importedPlates => {
                let importedSystems = [];
                importedPlates.forEach(importedPlate => {
                    importedSystems.push({
                        importName: importedPlate.importName,
                        conditions: {
                            ceilingType: importedPlate.conditions.ceilingType,
                            profileType: importedPlate.conditions.profileType,
                            heightMin: importedPlate.conditions.heightMin,
                            heightMax: importedPlate.conditions.heightMax,
                            fireResistance: importedPlate.conditions.fireResistance,
                            interax: importedPlate.conditions.interax,
                            moistureResistance: importedPlate.conditions.moistureResistance,
                            burglaryResistance: importedPlate.conditions.burglaryResistance,
                            conditionType: importedPlate.conditions.conditionType
                        },
                        plates: importedPlate.plates.map(plate => ({
                            face1: {
                                plate1: plate.face1 && plate.face1.plate1 ? plate.face1.plate1 : "",
                                plate2: plate.face1 && plate.face1.plate2 ? plate.face1.plate2 : "",
                                plate3: plate.face1 && plate.face1.plate3 ? plate.face1.plate3 : "",

                            },
                            face2: {
                                plate1: plate.face2 && plate.face2.plate1 ? plate.face2.plate1 : "",
                                plate2: plate.face2 && plate.face2.plate2 ? plate.face2.plate2 : "",
                                plate3: plate.face2 && plate.face2.plate3 ? plate.face2.plate3 : "",
                                plate4: plate.face2 && plate.face2.plate4 ? plate.face2.plate4 : "",
                            },
                        }))
                    })
                })
                return resolve({
                    importedPlates: importedSystems
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Getting imported plates
 * @param language
 * @returns {Promise}
 **/
 const getSystemsInfo = (language) => {
    return new Promise((resolve, reject) => {
        let importedSystems = {};

        let promises = [];
        promises.push(databaseService.getImportedSpecialWalls({}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(plate => {
                    let type = '';
                    if (plate.conditions.structureLink <= 1) {
                        type = 'S';
                    }
                    if (plate.conditions.structureLink === 2) {
                        type = 'SL';
                    }
                    if (plate.conditions.structureLink === 3) {
                        type = 'SLA';
                    }
                    if (plate.importName.includes("Inter") || plate.importName.includes("Asimetrici")) {
                        type = '';
                    }
                    if (!importedSystems[plate.importName + ' ' + type]?.length) {
                        importedSystems[plate.importName + ' ' + type] = [];
                        importedSystems[plate.importName + ' ' + type + ' Inaltime'] = 0;
                        importedSystems[plate.importName + ' ' + type + ' BurglaryInfo'] = [];
                    }

                    importedSystems[plate.importName + ' ' + type + ' Inaltime'] = importedSystems[plate.importName + ' ' + type + ' Inaltime'] < plate.conditions.heightMax ? plate.conditions.heightMax : importedSystems[plate.importName + ' ' + type + ' Inaltime'];
                    importedSystems[plate.importName + ' ' + type].push(parseInt(plate.conditions.fireResistance.replace('m', '')));
                    if (importedSystems[plate.importName + ' ' + type + ' BurglaryInfo'] === undefined) {
                        importedSystems[plate.importName + ' ' + type + ' BurglaryInfo'] = [];
                    }
                    if (plate.conditions.burglaryResistance) {
                        importedSystems[plate.importName + ' ' + type + ' BurglaryInfo'].push(parseInt(plate.conditions.burglaryResistance));
                    }
                })
            }));
        promises.push(databaseService.getImportedNoisyPlatingSystems({}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(plate => {
                    let type = '';
                    if (plate.conditions.interaxSustineri === '0') {
                        type = 'Independente';
                    }
                    if (plate.conditions.interaxSustineri === '1') {
                        type = 'UU';
                    }
                    if (plate.conditions.interaxSustineri === '250') {
                        type = 'Fixari';
                    }

                    if (!importedSystems[plate.importName + ' ' + type]?.length) {
                        importedSystems[plate.importName + ' ' + type] = [];
                        importedSystems[plate.importName + ' ' + type + ' Inaltime'] = 0;
                    }

                    importedSystems[plate.importName + ' ' + type + ' Inaltime'] = importedSystems[plate.importName + ' ' + type + ' Inaltime'] < plate.conditions.heightMax ? plate.conditions.heightMax : importedSystems[plate.importName + ' ' + type + ' Inaltime'];
                    importedSystems[plate.importName + ' ' + type].push(parseInt(plate.conditions.fireResistance.replace('m', '')));
                })
            }));
        promises.push(databaseService.getImportedPlates({}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(plate => {
                    if (plate.importName.includes("Plafoane")) {
                        if (!importedSystems[plate.importName + plate.conditions.ceilingType]?.length) {
                            importedSystems[plate.importName + plate.conditions.ceilingType] = [];
                            importedSystems[plate.importName + plate.conditions.ceilingType + ' BurglaryInfo'] = [];
                            importedSystems[plate.importName + plate.conditions.ceilingType + ' Inaltime'] = 0;
                        }
                        importedSystems[plate.importName + plate.conditions.ceilingType].push(parseInt(plate.conditions.fireResistance.replace('m', '')));
                        importedSystems[plate.importName + plate.conditions.ceilingType + ' Inaltime'] = importedSystems[plate.importName + plate.conditions.ceilingType + ' Inaltime'] < plate.conditions.heightMax ? plate.conditions.heightMax : importedSystems[plate.importName + plate.conditions.ceilingType + ' Inaltime'];
                        if (plate.conditions.burglaryResistance) {
                            importedSystems[plate.importName + plate.conditions.ceilingType + ' BurglaryInfo'].push(parseInt(plate.conditions.burglaryResistance));
                        }
                    }
                    else {
                        if (!importedSystems[plate.importName]?.length) {
                            importedSystems[plate.importName] = [];
                            importedSystems[plate.importName + ' BurglaryInfo'] = [];
                            importedSystems[plate.importName + ' Inaltime'] = 0;
                        }
                        if (importedSystems[plate.importName + ' BurglaryInfo'] === undefined) {
                            importedSystems[plate.importName + ' BurglaryInfo'] = [];
                        }
                        importedSystems[plate.importName].push(parseInt(plate.conditions.fireResistance.replace('m', '')));
                        importedSystems[plate.importName + ' Inaltime'] = importedSystems[plate.importName + ' Inaltime'] < plate.conditions.heightMax ? plate.conditions.heightMax : importedSystems[plate.importName + ' Inaltime'];
                        if (plate.conditions.burglaryResistance) {
                            importedSystems[plate.importName + ' BurglaryInfo'].push(parseInt(plate.conditions.burglaryResistance));
                        }
                    }
                })
            }));
        promises.push(databaseService.getImportedPlatingPlates({}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(plate => {
                    let type = '';
                    if (plate.conditions.interaxSustineri === '0') {
                        type = 'Independente';
                    }
                    if (plate.conditions.interaxSustineri === '2') {
                        type = 'Liniare';
                    }
                    if (plate.conditions.interaxSustineri === '2.5') {
                        type = 'Liniare';
                    }
                    if (plate.conditions.interaxSustineri === '125') {
                        type = 'Fixari';
                    }
                    if (plate.conditions.interaxSustineri === '250') {
                        type = 'Fixari';
                    }
                    if (!importedSystems[plate.importName + ' ' + type]?.length) {
                        importedSystems[plate.importName + ' ' + type] = [];
                        importedSystems[plate.importName + ' ' + type + ' Inaltime'] = 0;
                    }

                    importedSystems[plate.importName + ' ' + type + ' Inaltime'] = importedSystems[plate.importName + ' ' + type + ' Inaltime'] < plate.conditions.heightMax ? plate.conditions.heightMax : importedSystems[plate.importName + ' ' + type + ' Inaltime'];
                    importedSystems[plate.importName + ' ' + type].push(parseInt(plate.conditions.fireResistance.replace('m', '')));
                })
            }));

        return Promise.all(promises).then(() => {
            for (const [key] of Object.entries(importedSystems)) {
                if (key.includes("Inaltime") === false) {
                    importedSystems[key] = utilityService.sortArray(uniqBy(importedSystems[key]), 'ASC');
                }
            }
            return resolve({
                systemsInformation: importedSystems
            })
        }).catch(err => reject(err));

    });
};

/**
 * Getting imported plates
 * @param language
 * @returns {Promise}
 **/
const getImportedSpecialWalls = (systemName, structureLink, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '', structureLinkQuery = 0;
        if (systemName === 'Asimetrici') {
            queryName = 'Pereti Separativi - Asimetrici'
        }
        if (systemName === 'Dublu Intermediar') {
            queryName = 'Pereti Separativi - Dublu Intermediar'
        }
        if (systemName === 'Triplu Intermediar') {
            queryName = 'Pereti Separativi - Triplu Intermediar'
        }
        if (systemName === 'Simplu') {
            queryName = 'Pereti Separativi - Simplu Placat'
        }
        if (systemName === 'Dublu') {
            queryName = 'Pereti Separativi - Dublu Placat'
        }
        if (systemName === 'Triplu') {
            queryName = 'Pereti Separativi - Triplu Placat'
        }
        if (structureLink === 'Pereti S') {
            structureLinkQuery = 1;
        }
        if (structureLink === 'Pereti SL') {
            structureLinkQuery = 2;
        }
        if (structureLink === 'Pereti SLA') {
            structureLinkQuery = 3;
        }
        let importedSystems = [];

        let promises = [];
        promises.push(databaseService.getImportedSpecialWalls({importName: queryName, "conditions.structureLink": structureLinkQuery, "conditions.conditionType": "profileTypeAndInterax"}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(importedPlate => {
                    importedSystems.push({
                        importName: importedPlate.importName,
                        conditions: {
                            profileType: importedPlate.conditions.profileType.replace("/", ''),
                            heightMin: importedPlate.conditions.heightMin,
                            heightMax: importedPlate.conditions.heightMax,
                            fireResistance: importedPlate.conditions.fireResistance,
                            structureLink: importedPlate.conditions.structureLink,
                            interax: importedPlate.conditions.interax.replace("/", ''),
                            moistureResistance: importedPlate.conditions.moistureResistance,
                            burglaryResistance: importedPlate.conditions.burglaryResistance,
                            conditionType: importedPlate.conditions.conditionType
                        },
                        plates: importedPlate.plates.map(plate => ({
                            face1: {
                                plate1: plate.face1.plate1,
                                plate2: plate.face1.plate2,
                                plate3: plate.face1.plate3,
                            },
                            face2: {
                                plate1: plate.face2.plate1,
                                plate2: plate.face2.plate2,
                                plate3: plate.face2.plate3,
                            },
                        }))
                    })
                })

            }));
        promises.push(databaseService.getImportedSpecialWalls({importName: queryName, "conditions.conditionType": { $in: ["fireResistance", "moistureResistance", "burglaryResistance"]}}, {}, null, language)
            .then(importedPlates => {
                importedPlates.forEach(importedPlate => {
                    importedSystems.push({
                        importName: importedPlate.importName,
                        conditions: {
                            profileType: importedPlate.conditions.profileType.replace("/", ''),
                            heightMin: importedPlate.conditions.heightMin,
                            heightMax: importedPlate.conditions.heightMax,
                            fireResistance: importedPlate.conditions.fireResistance,
                            structureLink: importedPlate.conditions.structureLink,
                            interax: importedPlate.conditions.interax.replace("/", ''),
                            moistureResistance: importedPlate.conditions.moistureResistance,
                            burglaryResistance: importedPlate.conditions.burglaryResistance,
                            conditionType: importedPlate.conditions.conditionType
                        },
                        plates: importedPlate.plates.map(plate => ({
                            face1: {
                                plate1: plate.face1.plate1,
                                plate2: plate.face1.plate2,
                                plate3: plate.face1.plate3,
                            },
                            face2: {
                                plate1: plate.face2.plate1,
                                plate2: plate.face2.plate2,
                                plate3: plate.face2.plate3,
                            },
                        }))
                    })
                })

            }));
        return Promise.all(promises).then(() => {
            return resolve({
                importedPlates: importedSystems
            })
        }).catch(err => reject(err));

    });
};

/**
 * Getting all thicknesses
 * @param language
 * @returns {Promise}
 **/
const getThicknesses = (systemName, height, structureLink, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '', structureLinkQuery = -1, query;
        if (systemName.includes('Plafoane') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Plafoane Simple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Plafoane Duble'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Plafoane Triple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Plafoane Cvadruple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Simple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Duble'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Triple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Placari Cvadruple'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Noisy Simple'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Noisy Duble'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Noisy Triple'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Simplu')) {
            queryName = 'Sisteme - Simplu Placat'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Dublu')) {
            queryName = 'Sisteme - Dublu Placat'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Triplu')) {
            queryName = 'Sisteme - Triplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Simplu')) {
            queryName = 'Pereti Separativi - Simplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Dublu')) {
            queryName = 'Pereti Separativi - Dublu Placat'
        }
        if (systemName.includes('Pereti S') && systemName.includes('Triplu')) {
            queryName = 'Pereti Separativi - Triplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Asimetrici')) {
            queryName = 'Pereti Separativi - Asimetrici'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Intermediar') && systemName.includes('Dublu')) {
            queryName = 'Pereti Separativi - Dublu Intermediar'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Intermediar') && systemName.includes('Triplu')) {
            queryName = 'Pereti Separativi - Triplu Intermediar'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Simple') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Simple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Duble') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Duble'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Simple') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Simple'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Duble') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Duble'
        }
        if (structureLink.includes('Pereti S')) {
            structureLinkQuery = 1;
        }
        if (structureLink.includes('Pereti SL')) {
            structureLinkQuery = 2;
        }
        if (structureLink.includes('Pereti SLA')) {
            structureLinkQuery = 3;
        }

        let interaxSustineri = [];
        if (systemName.includes("ixari")) {
            interaxSustineri = [125, 250]
        }

        if (systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (systemName.includes("liniare")) {
            interaxSustineri = [2, 2.5]
        }

        if (systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (systemName.includes("UU")) {
            interaxSustineri = [1]
        }
        if (structureLinkQuery !== -1) {
            query = {
                importName: queryName,
                structureLink: structureLinkQuery
            }
        }
        else {
            query = {
                importName: queryName,
            }
        }
        if (structureLink.includes("Plafoane")) {
            query = {
                importName: queryName,
                support: structureLink.includes("Autoportante") ? "0" : {$in: ["1", "2", "3", "4", "5", "6"]},
            }
        }
        if (interaxSustineri.length > 0) {
            query = {
                ...query,
                interaxSustineri: { $in: interaxSustineri }
            }
        }
        return databaseService.getThicknesses(query, {}, null, language)
            .then(systemCodes => {
                let importedThicknesses = [];
                systemCodes.forEach(system => {
                    if (system.hMin < height && system.hMax >= height) {
                        importedThicknesses.push(system.thickness)
                    }
                })
                importedThicknesses = uniqBy(importedThicknesses);
                utilityService.sortArray(importedThicknesses, 'ASC')
                return resolve({
                    importedThicknesses: importedThicknesses
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Getting all thicknesses
 * @param language
 * @returns {Promise}
 **/
 const getSoundInsulationValues = (systemName, height, structureLink, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '', structureLinkQuery = -1, query;
        if (systemName.includes('Plafoane') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Plafoane Simple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Plafoane Duble'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Plafoane Triple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Plafoane Cvadruple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Simple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Duble'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Triple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Placari Cvadruple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Lipire')) {
            queryName = 'Sisteme - Placari Lipire'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Noisy Simple'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Noisy Duble'
        }
        if (systemName.includes('Noisy') &&  systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Noisy Triple'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Simplu')) {
            queryName = 'Sisteme - Simplu Placat'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Dublu')) {
            queryName = 'Sisteme - Dublu Placat'
        }
        if (systemName.includes('Placat') &&  systemName.includes('Triplu')) {
            queryName = 'Sisteme - Triplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Simplu')) {
            queryName = 'Pereti Separativi - Simplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Dublu')) {
            queryName = 'Pereti Separativi - Dublu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Triplu')) {
            queryName = 'Pereti Separativi - Triplu Placat'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Asimetrici')) {
            queryName = 'Pereti Separativi - Asimetrici'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Dublu') &&  systemName.includes('Intermediar')) {
            queryName = 'Pereti Separativi - Dublu Intermediar'
        }
        if (systemName.includes('Pereti S') &&  systemName.includes('Triplu') &&  systemName.includes('Intermediar')) {
            queryName = 'Pereti Separativi - Triplu Intermediar'
        }
        if (systemName.includes('Pereti Smart') &&  systemName.includes('Simplu')) {
            queryName = 'Pereti Smart - Simplu Placat'
        }
        if (systemName.includes('Pereti Smart') &&  systemName.includes('Dublu')) {
            queryName = 'Pereti Smart - Dublu Placat'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Simple') && systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Simple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Duble') && systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Duble'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Simple') && systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Simple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Duble') && systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Duble'
        }
        if (structureLink.includes('Pereti S') && structureLink.includes('Smart') === false) {
            structureLinkQuery = 1;
        }
        if (structureLink.includes('Pereti SL') && structureLink.includes('Smart') === false) {
            structureLinkQuery = 2;
        }
        if (structureLink.includes('Pereti SLA') && structureLink.includes('Smart') === false) {
            structureLinkQuery = 3;
        }

        let interaxSustineri = [];
        if (systemName.includes("ixari")) {
            interaxSustineri = [125, 250]
        }

        if (systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (systemName.includes("liniare")) {
            interaxSustineri = [2, 2.5]
        }

        if (systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (systemName.includes("UU")) {
            interaxSustineri = [1]
        }
        if (structureLinkQuery !== -1) {
            query = {
                importName: queryName,
                structureLink: structureLinkQuery
            }
        }
        else {
            query = {
                importName: queryName,
            }
        }
        if (structureLink.includes("Plafoane")) {
            query = {
                importName: queryName,
                support: structureLink.includes("Autoportante") ? "0" : {$in: ["1", "2", "3", "4", "5", "6"]},
            }
        }
        if (interaxSustineri.length > 0) {
            query = {
                ...query,
                interaxSustineri: { $in: interaxSustineri }
            }
        }

        query = {
            ...query,
            hMax: {  $gte: parseFloat(height) },
            hMin: {  $lt: parseFloat(height) },
            systemAccess: '0',
        }

        return databaseService.getThicknesses(query, {}, null, language)
            .then(systemCodes => {
                let minVal = 1000, maxVal = 0, importedThicknesses = [];
                systemCodes.forEach(system => {
                    if (minVal > system.valueSoundInsulation) {
                        minVal = system.valueSoundInsulation
                    }
                    if (maxVal < system.valueSoundInsulation) {
                        maxVal = system.valueSoundInsulation
                    }
                    importedThicknesses.push(system.thickness)
                })
                importedThicknesses = uniqBy(importedThicknesses);
                utilityService.sortArray(importedThicknesses, 'ASC')
                return resolve({
                    importedValues: {
                        min: minVal,
                        max: maxVal
                    },
                    importedThicknesses: importedThicknesses
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Getting imported plates
 * @param language
 * @returns {Promise}
 **/
const getImportedNoisyPlatingSystems = (systemName, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '';
        if (systemName === 'Duble') {
            queryName = 'Sisteme - Placari Noisy Duble'
        }
        if (systemName === 'Triple') {
            queryName = 'Sisteme - Placari Noisy Triple'
        }
        return databaseService.getImportedNoisyPlatingSystems({importName: queryName}, {}, null, language)
            .then(importedPlates => {
                let importedSystems = [];
                importedPlates.forEach(importedPlate => {
                    importedSystems.push({
                        importName: importedPlate.importName,
                        conditions: {
                            profileType: importedPlate.conditions.profileType,
                            heightMin: importedPlate.conditions.heightMin,
                            heightMax: importedPlate.conditions.heightMax,
                            fireResistance: importedPlate.conditions.fireResistance,
                            interax: importedPlate.conditions.interax,
                            moistureResistance: importedPlate.conditions.moistureResistance,
                            interaxSustineri: importedPlate.conditions.interaxSustineri,
                            conditionType: importedPlate.conditions.conditionType
                        },
                        plates: importedPlate.plates.map(plate => ({
                            face1: {
                                plate1: plate.face1.plate1,
                                plate2: plate.face1.plate2,
                                plate3: plate.face1.plate3,
                            },
                            face2: {
                                plate1: plate.face2.plate1,
                                plate2: plate.face2.plate2,
                                plate3: plate.face2.plate3,
                            },
                        }))
                    })
                })
                return resolve({
                    importedPlates: importedSystems
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Getting imported plates
 * @param language
 * @returns {Promise}
 **/
const getImportedPlatingPlates = (systemName, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '';
        if (systemName === 'Cvadruple') {
            queryName = 'Sisteme - Placari Cvadruple'
        }
        if (systemName === 'Triple') {
            queryName = 'Sisteme - Placari Triple'
        }
        if (systemName === 'Duble') {
            queryName = 'Sisteme - Placari Duble'
        }
        if (systemName === 'Simple') {
            queryName = 'Sisteme - Placari Simple'
        }
        if (systemName === 'Lipire') {
            queryName = 'Sisteme - Placari Lipire'
        }
        if (systemName === 'Placari Smart Simple') {
            queryName = 'Sisteme - Placari Smart Simple'
        }
        if (systemName === 'Placari Smart Duble') {
            queryName = 'Sisteme - Placari Smart Duble'
        }
        return databaseService.getImportedPlatingPlates({importName: queryName}, {}, null, language)
            .then(importedPlates => {
                let importedSystems = [];
                importedPlates.forEach(importedPlate => {
                    let plates = [];
                    importedPlate.plates.forEach(plate =>
                        plates.push({
                            plate1: plate.plate1,
                            plate2: plate.plate2,
                            plate3: plate.plate3,
                            plate4: plate.plate4,
                        })
                    )
                    importedSystems.push({
                        importName: importedPlate.importName,
                        conditions: {
                            profileType: importedPlate.conditions.profileType,
                            heightMin: importedPlate.conditions.heightMin,
                            heightMax: importedPlate.conditions.heightMax,
                            fireResistance: importedPlate.conditions.fireResistance,
                            interax: importedPlate.conditions.interax,
                            moistureResistance: importedPlate.conditions.moistureResistance,
                            interaxSustineri: importedPlate.conditions.interaxSustineri,
                            conditionType: importedPlate.conditions.conditionType
                        },
                        plates: plates,
                    })
                })
                return resolve({
                    importedPlates: importedSystems
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Save plates DB
 * @param req
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveImportedPlates = (data, language, type, name) => {
    return new Promise((resolve, reject) => {
        let allPlates = []
        data.plates.forEach(plate => {
            allPlates.push({
                face1: {
                    plate1: plate.face1[0],
                    plate2: plate.face1[1],
                    plate3: plate.face1[2],
                },
                face2: {
                    plate1: plate.face2[0],
                    plate2: plate.face2[1],
                    plate3: plate.face2[2],
                    plate4: plate.face2[3],
                },
            })
        })
        const platesData = {
            importName: name,
            conditions: {
                conditionType: type,
                ceilingType: data.ceilingType,
                profileType: data.profileType,
                heightMin: data.hMin,
                heightMax: data.hMax,
                fireResistance: data.fireResistance + (type === 'fireResistance' ? 'm' : ''),
                interax: data.interax,
                moistureResistance: data.moistureResistance,
                burglaryResistance: data.burglaryResistance
            },
            plates: allPlates
        };

        return databaseService.saveImportedPlates(platesData, language)
            .then(() => resolve())
            .catch(err => reject(err));
    })
};

/**
 * Save plates DB
 * @param req
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveImportedPlatingPlates = (data, language, type, name) => {
    return new Promise((resolve, reject) => {
        let allPlates = []
        data.plates.forEach(plate => {
            allPlates.push({
                plate1: plate.platesName[0],
                plate2: plate.platesName[1],
                plate3: plate.platesName[2],
                plate4: plate.platesName[3],
            })
        })
        const platesData = {
            importName: name,
            conditions: {
                conditionType: type,
                profileType: data.profileType,
                heightMin: data.hMin,
                heightMax: data.hMax,
                fireResistance: data.fireResistance + (type === 'fireResistance' ? 'm' : ''),
                interax: data.interax,
                moistureResistance: data.moistureResistance,
                burglaryResistance: data.burglaryResistance,
                interaxSustineri: data.interaxSustineri
            },
            plates: allPlates
        };

        return databaseService.saveImportedPlatingPlates(platesData, language)
            .then(() => resolve())
            .catch(err => reject(err));
    })
};

/**
 * Seding consumption data from the spreadsheet in the database
 * @param req {Object}
 * @param language {String}
 * @returns {Promise}
 *
 */
const sendConsumptionsData = (req, language) => {
    return new Promise((resolve, reject) => {
        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_consumptions_not_found', language));
        } else {
            // check permissions
            return databaseService.getUserByField({_id: utilityService.castToObjectId(req.decoded.id)}, {}, null, language)
                .then(user => {
                    if (user && !user.isAdmin && !user.isMasterAdmin) {
                        return reject(utilityService.parseCodeMessage('permission_denied', language));
                    }

                    return utilityService.upload('systemDocuments', req, null, 'file')
                        .then(uploadResults => {
                            let importName = req.body.importName;
                            let obj = xlsx.parse('.' + uploadResults[0].file);
                            let sourceFileName = req.files.file[0].originalname;

                            let sheetTabNames = obj.map(tab => tab.name.trim());
                            let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                            if (sheetTabIndex === -1) {
                                return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                            } else {
                                return databaseService.getProductsByField({language: 'ro'}, {}, null, language)
                                    .then(products => {
                                        let consumptions = utilityService.buildStructureConsumptions(obj[sheetTabIndex].data, importName, products);
                                        consumptions.forEach((c) => {
                                            if (c.productName.includes('Mineral'))
                                                Object.assign(c, {productSlug: 'mineral_wool', ...c})
                                        })
                                        console.log(consumptions);
                                        console.log('import name : ' + importName);
                                        console.log('last cod sap imported : ' + consumptions[consumptions.length - 1].codSap);
                                        console.log('number of conditions imported : ' + consumptions.length);
                                        databaseService.deleteArrayConsumptions({importName: importName}, language).then(() => {
                                            databaseService.saveArrayConsumptions(consumptions, language);
                                        })

                                        // also add sheet name
                                        let objUploads = {
                                            user: req.decoded.id,
                                            importName: importName,
                                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                                            sourceFileName: sourceFileName,
                                        };
                                        databaseService.deleteOldUploads({importName: importName}, language).then(() => {
                                            databaseService.saveToUploads(objUploads, language);
                                        })

                                    })
                                    .catch(err => reject(err))
                            }
                        })
                        .then(() => resolve())
                        .catch(err => reject(err));

                })
                .catch(err => reject(err))

        }
    });
};

/**
 * Imports/Saves products from the spreadsheet in the database
 * @param req {Object}
 * @param language {String}
 * @returns {Promise}
 */
const importProducts = (req, language) => {
    return new Promise((resolve, reject) => {
        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_products_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;

                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let products = utilityService.importProducts(obj[sheetTabIndex].data, importName, language);
                        console.log('products imported : ' + products.length);

                        databaseService.deletePreviousProducts({language: language}, language).then(() => {
                            products.forEach(product => {
                                databaseService.saveProduct(product, language);
                            })
                        })

                        let promises = [];
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            language: language,
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName, language: language || 'ro'}, language).then(() => {
                            promises.push(databaseService.saveToUploads(objUploads, language));
                        });

                        return Promise.all(promises);
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Saves allowed plates from the spreadsheet in the database
 * @param req {Object}
 * @param language {String}
 * @returns {Promise}
 */
const sendAllowedPlatesData = (req, language) => {
    return new Promise((resolve, reject) => {
        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('please_add_spreadsheet', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;

                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        // get products

                        return databaseService.getProductsByField({}, {}, null, language)
                            .then(products => {
                                let allowedPlates = utilityService.buildAllowedPlatesArray(importName, obj[sheetTabIndex].data, products);

                                // also add sheet name
                                let objUploads = {
                                    user: req.decoded.id,
                                    importName: importName,
                                    fileName: uploadResults[0].file.replace('/uploads/', ''),
                                    sourceFileName: sourceFileName,
                                };
                                databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                                    databaseService.saveToUploads(objUploads, language);
                                })
                                databaseService.deletePreviousAllowedPlates({importName: importName}, language).then(() => {
                                    let promises = [];
                                    allowedPlates.forEach(allowedPlate => {
                                        promises.push(databaseService.saveAllowedPlates(allowedPlate, language));
                                    })
                                    return Promise.all(promises);
                                })

                            })
                            .catch(err => reject(err))
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Get all allowed plates from the database
 * @param language {String}
 * @returns {Promise}
 **/
const getAllowedPlates = language => {
    return new Promise((resolve, reject) => {
        return databaseService.getAllowedPlatesByField({}, {}, null, language)
            .then(plates => {
                return resolve({
                    plates: plates.map(plate => ({
                        _id: plate._id,
                        plateName: plate.plateName,
                        fireResistance: plate.fireResistance,
                        canReplacePlate: plate.canReplacePlate,
                    }))
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Get all products from the database
 * @param language
 * @returns {Promise}
 */
const getProducts = language => {
    return new Promise((resolve, reject) => {
        return databaseService.getProductsByField({language: language}, {}, null, language)
            .then(products => {
                return resolve({
                    products: products.map(product => ({
                        _id: product._id,
                        codSap: product.codSap,
                        type: product.type,
                        name: product.name,
                        width: product.width,
                        productLength: product.productLength,
                        saleUM: product.saleUM,
                        excelUM: product.excelUM,
                        deliveryUM: product.deliveryUM,
                        packing: product.packing,
                        weight: product.weight,
                        saleWeight: product.saleWeight,
                        price: product.price,
                        salePrice: product.salePrice,
                        plateThickness: product.plateThickness,
                        category: product.category,
                        language: product.language,
                    }))
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Get imported conditions consumptions from database
 * @param language
 * @returns {Promise}
 */
const getImportedConsumptions = (systemName, language) => {
    return new Promise((resolve, reject) => {
        let queryName = '';
        if (systemName === 'Simplu') {
            queryName = 'Consumuri - Simplu Placat';
        }
        if (systemName === 'Dublu') {
            queryName = 'Consumuri - Dublu Placat';
        }
        if (systemName === 'Triplu') {
            queryName = 'Consumuri - Triplu Placat';
        }
        if (systemName === 'Separativi Simplu') {
            queryName = 'Consumuri Separativi - Simplu Placat';
        }
        if (systemName === 'Separativi Dublu') {
            queryName = 'Consumuri Separativi - Dublu Placat';
        }
        if (systemName === 'Separativi Triplu') {
            queryName = 'Consumuri Separativi - Triplu Placat';
        }
        if (systemName === 'Cvadruple') {
            queryName = 'Consumuri - Placari Cvadruple';
        }
        if (systemName === 'Triple') {
            queryName = 'Consumuri - Placari Triple';
        }
        if (systemName === 'Duble') {
            queryName = 'Consumuri - Placari Duble';
        }
        if (systemName === 'Simple') {
            queryName = 'Consumuri - Placari Simple';
        }
        if (systemName === 'Lipire') {
            queryName = 'Consumuri - Placari Lipire';
        }
        if (systemName === 'Noisy Triple') {
            queryName = 'Consumuri - Placari Noisy Triple';
        }
        if (systemName === 'Noisy Duble') {
            queryName = 'Consumuri - Placari Noisy Duble';
        }
        if (systemName === 'Plafoane Cvadruple') {
            queryName = 'Consumuri - Plafoane Cvadruple';
        }
        if (systemName === 'Plafoane Triple') {
            queryName = 'Consumuri - Plafoane Triple';
        }
        if (systemName === 'Plafoane Duble') {
            queryName = 'Consumuri - Plafoane Duble';
        }
        if (systemName === 'Plafoane Simple') {
            queryName = 'Consumuri - Plafoane Simple';
        }
        if (systemName === 'Separativi Asimetrici') {
            queryName = 'Consumuri Separativi - Asimetrici'
        }
        if (systemName === 'Separativi Dublu Intermediar') {
            queryName = 'Consumuri Separativi - Dublu Intermediar'
        }
        if (systemName === 'Separativi Triplu Intermediar') {
            queryName = 'Consumuri Separativi - Triplu Intermediar'
        }
        if(systemName === 'Pereti Smart Simplu') {
            queryName = 'Consumuri - Pereti Smart Simplu Placat';
        }
        if(systemName === 'Pereti Smart Dublu') {
            queryName = 'Consumuri - Pereti Smart Dublu Placat';
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Simple') && systemName.includes('Smart')) {
            queryName = 'Consumuri - Plafoane Smart Simple'
        }
        if (systemName.includes('Plafoane') &&  systemName.includes('Duble') && systemName.includes('Smart')) {
            queryName = 'Consumuri - Plafoane Smart Duble'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Simple') && systemName.includes('Smart')) {
            queryName = 'Consumuri - Placari Smart Simple'
        }
        if (systemName.includes('Placari') &&  systemName.includes('Duble') && systemName.includes('Smart')) {
            queryName = 'Consumuri - Placari Smart Duble'
        }

        return databaseService.getProductsByField({language: language}, {}, null, language)
            .then(products => {

                return databaseService.getImportedConsumptions({importName: queryName}, {}, null, language)
                    .then(importedConsumptions => {
                        let importedSystems = [];
                        importedConsumptions.forEach(importedConsumption => {
                            let supportType = {};
                            let ceilingSupport = null;
                            let support = null;

                            if (importedConsumption.conditions.ceilingSupport && importedConsumption.importName.toLowerCase().includes('plafoane')) {
                                if (importedConsumption.conditions.ceilingSupport === '0') {
                                    ceilingSupport = 'Autoportant';
                                } else if (importedConsumption.conditions.ceilingSupport === '1') {
                                    ceilingSupport = 'Brida';
                                } else if (importedConsumption.conditions.ceilingSupport === '2') {
                                    ceilingSupport = 'Tirant';
                                } else if (importedConsumption.conditions.ceilingSupport === '3') {
                                    ceilingSupport = 'Nonius';
                                } else if (importedConsumption.conditions.ceilingSupport === '4') {
                                    ceilingSupport = 'Tija M8';
                                } else if (importedConsumption.conditions.ceilingSupport === '5') {
                                    ceilingSupport = 'Racord lemn';
                                } else if (importedConsumption.conditions.ceilingSupport === '6') {
                                    ceilingSupport = 'Brida AC';
                                }
                                supportType = {ceilingSupport: ceilingSupport}
                            }

                            if (importedConsumption.conditions.support) {
                                if (importedConsumption.conditions.support === '0') {
                                    support = 'beton';
                                } else if (importedConsumption.conditions.support === '1') {
                                    support = 'tabla';
                                } else if (importedConsumption.conditions.support === '2') {
                                    support = 'zidarie';
                                } else if (importedConsumption.conditions.support === '3') {
                                    support = 'tencuieli';
                                } else if (importedConsumption.conditions.support === '4') {
                                    support = 'altele';
                                }
                                supportType = {support: support}
                            }

                            // if (language !== ro) => update "productName" and "price" properties from "products" collection
                            // alternative => add "language" property in "importedConsumptionsSchema" model and have list of consumptions different based on country
                            let langProductName = importedConsumption.productName;
                            let langProductPrice = importedConsumption.price;
                            let langProductUnitMeasure = importedConsumption.unitMeasure;

                            if (language !== 'ro') {
                                const findProduct = products.find(el => el.codSap === importedConsumption.codSap);
                                if (findProduct) {
                                    langProductName = findProduct.name;
                                    langProductPrice = findProduct.price;
                                    langProductUnitMeasure = findProduct.excelUM;
                                }
                            }
                            importedSystems.push({
                                importName: importedConsumption.importName,
                                conditions: {
                                    ...supportType,
                                    profileType: importedConsumption.conditions.profileType,
                                    primaryProfileType: importedConsumption.conditions.primaryProfileType, // plafoane
                                    secondaryProfileType: importedConsumption.conditions.secondaryProfileType, // plafoane
                                    thickness: importedConsumption.conditions.thickness,
                                    distance: importedConsumption.conditions.distance,
                                    structureLink: importedConsumption.conditions.structureLink,
                                    interax: importedConsumption.conditions.interax,
                                    primaryInterax: importedConsumption.conditions.primaryInterax, // plafoane
                                    secondaryInterax: importedConsumption.conditions.secondaryInterax, // plafoane
                                    interaxSustineri: importedConsumption.conditions.interaxSustineri,
                                    heightMin: importedConsumption.conditions.heightMin,
                                    heightMax: importedConsumption.conditions.heightMax,
                                    soundInsulation: importedConsumption.conditions.soundInsulation && importedConsumption.conditions.soundInsulation.includes("cu") === false ? 'cu' : importedConsumption.conditions.soundInsulation,
                                    fireResistance: importedConsumption.conditions.fireResistance,
                                    moistureResistance: importedConsumption.conditions.moistureResistance,
                                    burglaryResistance: importedConsumption.conditions.burglaryResistance,
                                    depthPlate: importedConsumption.conditions.depthPlate,
                                    finishing: importedConsumption.conditions.finishing,
                                    accessory: importedConsumption.conditions.accessory,
                                    consumptionType: importedConsumption.conditions.consumptionType,
                                    basePlate: importedConsumption.conditions.basePlate, // plafoane
                                },
                                codSap: importedConsumption.codSap,
                                productName: langProductName,
                                quantity: importedConsumption.quantity,
                                quantityFormula: importedConsumption.quantityFormula,
                                price: langProductPrice,
                                unitMeasure: importedConsumption.unitMeasure,
                                weight: importedConsumption.weight,
                                category: importedConsumption.category,
                            })
                        })
                        return resolve({
                            importedConsumptions: importedSystems
                        })
                    })
                    .catch(err => reject(err));

            })
            .catch(err => reject(err))

    });
};

const getUploads = language => {
    return new Promise((resolve, reject) => {
        return databaseService.getUploads({}, {}, null, language)
            .then(uploads => {
                return resolve({
                    uploads: uploads.map(upload => ({
                        _id: upload._id,
                        importName: upload.importName,
                        user: upload.user,
                        language: upload.language,
                        fileName: upload.fileName,
                        sourceFileName: upload.sourceFileName,
                        createdAt: upload.createdAt,
                        updatedAt: upload.updatedAt,
                    }))
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Save allowed plates DB
 * @param req
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveAllowedPlates = (req, data, language) => {
    return new Promise((resolve, reject) => {
        const platesData = {
            plateName: data.plateName,
            fireResistance: data.height,
            canReplacePlate: data.canReplacePlate,
        };

        return databaseService.saveAllowedPlates(platesData, language)
            .then(() => resolve())
            .catch(err => reject(err));
    })
};

/**
 * Delete old allowed plates DB
 * @param language
 * @returns {Promise}
 */
const deletePreviousAllowedPlates = language => {
    return new Promise((resolve, reject) => {
        return databaseService.deletePreviousAllowedPlates({}, language)
            .then(() => resolve())
            .catch(err => reject(err));
    });
};

/**
 * Saving the Special Walls plates in the database after prework
 * @param {*} req
 * @param {*} language
 * @returns
 */
 const sendSpecialWalls = (req, language) => {
    return new Promise((resolve, reject) => {

        if (!((req.files || {}).file || []).length) {
            return reject(utilityService.parseCodeMessage('spreadsheet_systems_not_found', language));
        } else {
            return utilityService.upload('systemDocuments', req, null, 'file')
                .then(uploadResults => {
                    let importName = req.body.importName;
                    let obj = xlsx.parse('.' + uploadResults[0].file);
                    let sourceFileName = req.files.file[0].originalname;
                    let sheetTabNames = obj.map(tab => tab.name.trim());
                    let sheetTabIndex = utilityService.getSheetTabIndex(sheetTabNames, importName);
                    if (sheetTabIndex === -1) {
                        return reject(utilityService.parseCodeMessage('import_spreadsheet_error', language));
                    } else {
                        let platesAccordingToProfileTypeAndInterax = utilityService.buildStructureSpecialWallsInteraxAndProfileType(obj[sheetTabIndex]);
                        let platesAccordingToFireResistance = utilityService.buildStructureSpecialWallsFireResistance(obj[sheetTabIndex]);
                        let platesAccordingToMoistureResistance = utilityService.buildStructureSpecialWallsMoistureResistance(obj[sheetTabIndex]);
                        let platesAccordingTBurglaryResistance = utilityService.buildStructureSpecialWallsAccordingToBurglaryResistance(obj[sheetTabIndex]);
                        let systemCodes = utilityService.putSystemCodesSpecialWalls(obj[sheetTabIndex], importName);

                        databaseService.deletePreviousImportedSpecialWalls({importName: importName}, language).then(() => {
                            platesAccordingToProfileTypeAndInterax.forEach(plate => {
                                saveSpecialWalls(plate, language, "profileTypeAndInterax", req.body.importName);
                            })
                            platesAccordingToFireResistance.forEach(plate => {
                                saveSpecialWalls(plate, language, "fireResistance", req.body.importName);
                            })
                            platesAccordingToMoistureResistance.forEach(plate => {
                                saveSpecialWalls(plate, language, "moistureResistance", req.body.importName);
                            })
                            platesAccordingTBurglaryResistance.forEach(plate => {
                                saveSpecialWalls(plate, language, "burglaryResistance", req.body.importName);
                            })
                        })

                        // also add sheet name
                        let objUploads = {
                            user: req.decoded.id,
                            importName: importName,
                            fileName: uploadResults[0].file.replace('/uploads/', ''),
                            sourceFileName: sourceFileName,
                        };
                        databaseService.deletePreviousUploads({importName: importName}, language).then(() => {
                            databaseService.saveToUploads(objUploads, language);
                        })

                        databaseService.deletePreviousSystemCodes({importName: importName}, language).then(() => {
                            let promises = [];

                            systemCodes.forEach(systemCode => {
                                promises.push(databaseService.saveSystemCode(systemCode));
                            })

                            return Promise.all(promises);
                        })
                    }
                })
                .then(() => resolve())
                .catch(err => reject(err));
        }
    });
};

/**
 * Save plates DB
 * @param req
 * @param data
 * @param language
 * @returns {Promise}
 */
const saveSpecialWalls = (data, language, type, name) => {
    return new Promise((resolve, reject) => {
        let allPlates = []
        data.plates.forEach(plate => {
            allPlates.push({
                face1: {
                    plate1: plate.face1[0],
                    plate2: plate.face1[1],
                    plate3: plate.face1[2],
                },
                face2: {
                    plate1: plate.face2[0],
                    plate2: plate.face2[1],
                    plate3: plate.face2[2],
                },
            })
        })
        const platesData = {
            importName: name,
            conditions: {
                conditionType: type,
                profileType: data.profileType,
                profileType1: data.profileType1,
                profileType2: data.profileType2,
                heightMin: parseFloat(data.hMin),
                heightMax: parseFloat(data.hMax),
                fireResistance: data.fireResistance + (type === 'fireResistance' ? 'm' : ''),
                structureLink: data.structureLink,
                interax: data.interax,
                interax1: data.interax1,
                interax2: data.interax2,
                moistureResistance: data.moistureResistance,
                burglaryResistance: data.burglaryResistance,
            },
            plates: allPlates
        };

        return databaseService.saveImportedSpecialWalls(platesData, language)
            .then(() => resolve())
            .catch(err => reject(err));
    })
};

module.exports = {
    sendSystemsData,
    sendConsumptionsData,
    sendAllowedPlatesData,
    saveAllowedPlates,
    deletePreviousAllowedPlates,
    getAllowedPlates,
    importProducts,
    getProducts,
    getImportedPlates,
    getImportedConsumptions,
    getUploads,
    sendPlatingSystemsData,
    saveImportedPlatingPlates,
    getImportedPlatingPlates,
    sendNoisyPlatingSystemsData,
    getImportedNoisyPlatingSystems,
    sendSpecialWalls,
    getImportedSpecialWalls,
    getThicknesses,
    sendCeiling,
    getSoundInsulationValues,
    getSystemsInfo,
}
