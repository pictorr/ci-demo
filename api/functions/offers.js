const databaseService = require('../../utils/databaseService/databaseService.js');
const { desc, asc } = require('../../utils/constants.js');
const utilityService = require('../../utils/utilityService.js');
const downloadOfferService = require('../../utils/downloadOfferService.js');
const { query } = require('express');
const { systemCodes } = require('../../utils/databaseService/database/models.js');

/**
 * Saves a offer in the database
 * @param data {Object}
 * @param decoded {Object} 
 * @param language {String}
 * @returns {Promise}
 */
const saveOffer = (data, decoded, language) => {
	return new Promise((resolve, reject) => {
        const offerData = {
            createdAt: new Date(),
            userId: utilityService.castToObjectId(decoded.id),
            savedOfferId: utilityService.castToObjectId(data.savedOfferId),
            soundInsulationMin: data.soundInsulationMin,
            intermediatePlate: data.intermediatePlate,
            soundInsulationMax: data.soundInsulationMax,
            basedPlates: data.basedPlates,
            thickness: data.thickness,
            excelName: data.excelName,
            thicknessSystem: data.thicknessSystem ? data.thicknessSystem.toString() : null,
            ceilingSupport: data.ceilingSupport,
            protectionSense: data.protectionSense,
            distance: data.distance,
            status: data.status,
            surface: data.surface,
            profileType: data.profileType,
            height: data.height,
            fireResistance: data.fireResistance,
            moistureResistance: data.moistureResistance,
            burglaryResistance: data.burglaryResistance,
            soundInsulation: data.soundInsulation,
            interax: data.interax,
            interaxSustineri: data.interaxSustineri,
            support: data.support,
            finishing: data.finishing,
            systemCode: data.systemCode,
            systemCodeTable: data.systemCodeTable,
            structureLink: data.structureLink,
            codSap1: data.codSap1,
            codSap2: data.codSap2,
            codSap3: data.codSap3,
            codSap4: data.codSap4,
            izolareAcustica: data.izolareAcustica,
            plate: {
                face1: {
                    plate1: data.face1 && data.face1.plate1 ? data.face1.plate1 : "",
                    plate2: data.face1 && data.face1.plate2 ? data.face1.plate2 : "",
                    plate3: data.face1 && data.face1.plate3 ? data.face1.plate3 : "",
                },
                face2: {
                    plate1: data.face2 && data.face2.plate1 ? data.face2.plate1 : "",
                    plate2: data.face2 && data.face2.plate2 ? data.face2.plate2 : "",
                    plate3: data.face2 && data.face2.plate3 ? data.face2.plate3 : "",
                    plate4: data.face2 && data.face2.plate4 ? data.face2.plate4 : "",
                },
            },
            initialPlate: {
                face1: {
                    plate1: data.initialFace1.plate1 ? data.initialFace1.plate1 : "" ,
                    plate2: data.initialFace1.plate2 ? data.initialFace1.plate2 : "" ,
                    plate3: data.initialFace1.plate3 ? data.initialFace1.plate3 : "" ,
                },
                face2: {
                    plate1: data.initialFace2.plate1 ? data.initialFace2.plate1 : "" ,
                    plate2: data.initialFace2.plate2 ? data.initialFace2.plate2 : "" ,
                    plate3: data.initialFace2.plate3 ? data.initialFace2.plate3 : "" ,
                    plate4: data.initialFace2.plate4 ? data.initialFace2.plate4 : "" ,
                },
            },
            price: data.price,
            consumption: data.consumption,
            consumptionExterior: data.consumptionExterior,
            systemName: data.systemName,
        };

        return databaseService.saveOffer(offerData, language).then(() => resolve());
    });
};

/**
 * Saves a offer in the database
 * @param data {Object}
 * @param decoded {Object} 
 * @param language {String}
 * @returns {Promise}
 */
 const savePlatingOffer = (data, decoded, language) => {
	return new Promise((resolve, reject) => {

        const offerData = {
            createdAt: new Date(),
            userId: utilityService.castToObjectId(decoded.id),
            savedOfferId: utilityService.castToObjectId(data.savedOfferId),
            status: data.status,
            soundInsulationMin: data.soundInsulationMin,
            soundInsulationMax: data.soundInsulationMax,
            basedPlates: data.basedPlates,
            thickness: data.thickness,
            excelName: data.excelName,
            surface: data.surface,
            thicknessSystem: data.thicknessSystem.toString(),
            profileType: data.profileType,
            height: data.height,
            fireResistance: data.fireResistance,
            moistureResistance: data.moistureResistance,
            burglaryResistance: data.burglaryResistance,
            soundInsulation: data.soundInsulation,
            interaxSustineri: data.interaxSustineri,
            interax: data.interax,
            systemCode: data.systemCode,
            systemCodeTable: data.systemCodeTable,
            izolareAcustica: data.izolareAcustica,
            support: data.support,
            finishing: data.finishing,
            codSap1: data.codSap1,
            codSap2: data.codSap2,
            codSap3: data.codSap3,
            codSap4: data.codSap4,
            platingPlates: {
                plate1: data.platingPlates.plate1,
                plate2: data.platingPlates.plate2,
                plate3: data.platingPlates.plate3,
                plate4: data.platingPlates.plate4,
            },
            platingInitialPlates: {
                plate1: data.platingInitialPlates.plate1,
                plate2: data.platingInitialPlates.plate2,
                plate3: data.platingInitialPlates.plate3,
                plate4: data.platingInitialPlates.plate4,
            },
            price: data.price,
            consumption: data.consumption,
            consumptionExterior: data.consumptionExterior,
            systemName: data.systemName,
        };

        return databaseService.saveOffer(offerData, language).then(() => resolve());
    });
};


/**
 * Saves current offer in the database
 * @param req {Object} - Required for image upload
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const saveCurrentOffer = (req, data, language) => {
	return new Promise((resolve, reject) => {
        const offerData = {
            typeName: data.typeName,
            openSystems: data.openSystems,
            profileType: data.profileType,
            thicknessSystem: data.thicknessSystem,
            ceilingSupport: data.ceilingSupport,
            protectionSense: thisOffer.protectionSense,
            height: data.height,
            fireResistance: data.fireResistance,
            moistureResistance: data.moistureResistance,
            burglaryResistance: data.burglaryResistance,
            soundInsulation: data.soundInsulation,
            interax: data.interax,
            support: data.support,
            finishing: data.finishing,
            face1: {
                plate1: data.face1.plate1,
                plate2: data.face1.plate2,
                plate3: data.face1.plate3,
            },
            face2: {
                plate1: data.face2.plate1,
                plate2: data.face2.plate2,
                plate3: data.face2.plate3,
                plate4: data.face2.plate4,
            },
            systemName: data.systemName,
        };

        let promises = [databaseService.deletePreviousCurrentOffer({}, language)];

        promises.push(databaseService.saveCurrentOffer(offerData, language));
        return Promise.all(promises);
    });
};

/**
 * Get a offer from the database
 * @param offerId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getCurrentOffer = (offerId, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.getCurrentOffer({}, language)
			.then(thisOffer => resolve({
                    typeName: thisOffer.typeName,
                    openSystems: thisOffer.openSystems,
                    profileType: thisOffer.profileType,
                    thicknessSystem: thisOffer.thicknessSystem,
                    protectionSense: thisOffer.protectionSense,
                    height: thisOffer.height,
                    fireResistance: thisOffer.fireResistance,
                    interax: thisOffer.interax,
                    moistureResistance: thisOffer.moistureResistance,
                    burglaryResistance: thisOffer.burglaryResistance,
                    support: thisOffer.support,
                    soundInsulation: thisOffer.soundInsulation,
                    finishing: thisOffer.finishing,
                    plate: {
                        face1: {
                            plate1: thisOffer.face1.plate1,
                            plate2: thisOffer.face1.plate2,
                            plate3: thisOffer.face1.plate3,
                        },
                        face2: {
                            plate1: thisOffer.face2.plate1,
                            plate2: thisOffer.face2.plate2,
                            plate3: thisOffer.face2.plate3,
                        },
                    },
                    price: thisOffer.price,
                    consumption: thisOffer.consumption,
                    consumptionExterior: thisOffer.consumptionExterior,
                    systemName: thisOffer.systemName,
            }))
			.catch(err => reject(err));
	});
};

/**
 * Get a offer from the database
 * @param offerId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getOffer = (offerId, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.getOfferByField({ $or: [{_id: utilityService.castToObjectId(offerId)}, {savedOfferId: utilityService.castToObjectId(offerId)}] }, language)
			.then(thisOffer => { resolve({
				offer: {
                    surface: thisOffer.surface,
                    excelName: thisOffer.excelName,
                    intermediatePlate: thisOffer.intermediatePlate,
                    profileType: thisOffer.profileType,
                    thicknessSystem: thisOffer.thicknessSystem,
                    thickness: thisOffer.thickness,
                    ceilingSupport: thisOffer.ceilingSupport,
                    protectionSense: thisOffer.protectionSense,
                    height: thisOffer.height,
                    fireResistance: thisOffer.fireResistance,
                    interax: thisOffer.interax,
                    moistureResistance: thisOffer.moistureResistance,
                    burglaryResistance: thisOffer.burglaryResistance,
                    soundInsulation: thisOffer.soundInsulation,
                    support: thisOffer.support,
                    interaxSustineri: thisOffer.interaxSustineri,
                    finishing: thisOffer.finishing,
                    izolareAcustica: thisOffer.izolareAcustica ? thisOffer.izolareAcustica : 0,
                    systemCode: thisOffer.systemCode,
                    systemCodeTable: thisOffer.systemCodeTable,
                    codSap1: thisOffer.codSap1,
                    codSap2: thisOffer.codSap2,
                    codSap3: thisOffer.codSap3,
                    codSap4: thisOffer.codSap4,
                    plate: {
                        face1: {
                            plate1: thisOffer.plate.face1.plate1,
                            plate2: thisOffer.plate.face1.plate2,
                            plate3: thisOffer.plate.face1.plate3,
                        },
                        face2: {
                            plate1: thisOffer.plate.face2.plate1,
                            plate2: thisOffer.plate.face2.plate2,
                            plate3: thisOffer.plate.face2.plate3,
                            plate4: thisOffer.plate.face2.plate4,
                        },
                    },
                    initialPlate: {
                        face1: {
                            plate1: thisOffer.initialPlate.face1.plate1,
                            plate2: thisOffer.initialPlate.face1.plate2,
                            plate3: thisOffer.initialPlate.face1.plate3,
                        },
                        face2: {
                            plate1: thisOffer.initialPlate.face2.plate1,
                            plate2: thisOffer.initialPlate.face2.plate2,
                            plate3: thisOffer.initialPlate.face2.plate3,
                            plate4: thisOffer.initialPlate.face2.plate4,
                        },
                    },
                    platingPlates: {
                        plate1: thisOffer.platingPlates.plate1,
                        plate2: thisOffer.platingPlates.plate2,
                        plate3: thisOffer.platingPlates.plate3,
                        plate4: thisOffer.platingPlates.plate4,
                    },
                    platingInitialPlates: {
                        plate1: thisOffer.platingInitialPlates.plate1,
                        plate2: thisOffer.platingInitialPlates.plate2,
                        plate3: thisOffer.platingInitialPlates.plate3,
                        plate4: thisOffer.platingInitialPlates.plate4,
                    },
                    price: thisOffer.price,
                    consumption: thisOffer.consumption,
                    consumptionExterior: thisOffer.consumptionExterior,
                    systemName: thisOffer.systemName,
                }
			})})
			.catch(err => reject(err));
	});
};

/**
 * Get all offers from the database
 * @param savedOfferId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getOffers = (savedOfferId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getOffersByField({
            savedOfferId: utilityService.castToObjectId(savedOfferId),
        }, { $sort: { createdOn: desc } }, null, language)
			.then(offers => {
                utilityService.sortArray(offers, 'ASC', 'price');
				return resolve({
					offers: offers.map(thisOffer => ( {
						_id: thisOffer._id,
                        profileType: thisOffer.profileType,
                        intermediatePlate: thisOffer.intermediatePlate,
                        status: thisOffer.status,
                        ceilingSupport: thisOffer.ceilingSupport,
                        protectionSense: thisOffer.protectionSense,
                        surface: thisOffer.surface,
                        thickness: thisOffer.thickness,
                        thicknessSystem: thisOffer.thicknessSystem,
                        distance: thisOffer.distance,
                        height: thisOffer.height,
                        fireResistance: thisOffer.fireResistance,
                        soundInsulation: thisOffer.soundInsulation,
                        support: thisOffer.support,
                        finishing: thisOffer.finishing,
                        interax: thisOffer.interax,
                        moistureResistance: thisOffer.moistureResistance,
                        burglaryResistance: thisOffer.burglaryResistance,
                        interaxSustineri: thisOffer.interaxSustineri,
                        izolareAcustica: thisOffer.izolareAcustica,
                        systemCode: thisOffer.systemCode,
                        systemCodeTable: thisOffer.systemCodeTable,
                        structureLink: thisOffer.structureLink,
                        codSap1: thisOffer.codSap1,
                        codSap2: thisOffer.codSap2,
                        codSap3: thisOffer.codSap3,
                        codSap4: thisOffer.codSap4,
                        plate: {
                            face1: {
                                plate1: thisOffer.plate.face1.plate1,
                                plate2: thisOffer.plate.face1.plate2,
                                plate3: thisOffer.plate.face1.plate3,
                            },
                            face2: {
                                plate1: thisOffer.plate.face2.plate1,
                                plate2: thisOffer.plate.face2.plate2,
                                plate3: thisOffer.plate.face2.plate3,
                                plate4: thisOffer.plate.face2.plate4,
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: thisOffer.initialPlate.face1.plate1,
                                plate2: thisOffer.initialPlate.face1.plate2,
                                plate3: thisOffer.initialPlate.face1.plate3,
                            },
                            face2: {
                                plate1: thisOffer.initialPlate.face2.plate1,
                                plate2: thisOffer.initialPlate.face2.plate2,
                                plate3: thisOffer.initialPlate.face2.plate3,
                                plate4: thisOffer.initialPlate.face2.plate4,
                            },
                        },
                        platingPlates: {
                            plate1: thisOffer.platingPlates.plate1,
                            plate2: thisOffer.platingPlates.plate2,
                            plate3: thisOffer.platingPlates.plate3,
                            plate4: thisOffer.platingPlates.plate4,
                        },
                        platingInitialPlates: {
                            plate1: thisOffer.platingInitialPlates.plate1,
                            plate2: thisOffer.platingInitialPlates.plate2,
                            plate3: thisOffer.platingInitialPlates.plate3,
                            plate4: thisOffer.platingInitialPlates.plate4,
                        },
                        price: thisOffer.price,
                        consumption: thisOffer.consumption,
                        consumptionExterior: thisOffer.consumptionExterior,
                        systemName: thisOffer.systemName,
					} ))
				})
			})
			.catch(err => {
                reject(err)
            });
	});
};

/**
 * Udates a offer in the database
 * @param req {Object} - Required for image upload
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateOffer = (savedOfferId, data, decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.getOffersByField({
            savedOfferId: utilityService.castToObjectId(savedOfferId),
		}, language)
			.then(offer => {
				if (!offer) {
                    return reject(utilityService.parseCodeMessage('offer_does_not_exist_update', language));
                }
                else {
                    const offerData = {
                        createdAt: new Date(),
						_id: savedOfferId,
                        profileType: data.profileType,
                        protectionSense: data.protectionSense,
                        thicknessSystem: data.thicknessSystem,
                        ceilingSupport: data.ceilingSupport,
                        height: data.height,
                        fireResistance: data.fireResistance,
                        soundInsulation: data.soundInsulation,
                        support: data.support,
                        finishing: data.finishing,
                        interax: data.interax,
                        moistureResistance: data.moistureResistance,
                        burglaryResistance: data.burglaryResistance,
                        izolareAcustica: data.izolareAcustica,                        
                        systemCode: data.systemCode,
                        systemCodeTable: data.systemCodeTable,
                        codSap1: data.codSap1,
                        codSap2: data.codSap2,
                        codSap3: data.codSap3,
                        codSap4: data.codSap4,
                        plate: {
                            face1: {
                                plate1: data.face1 ? data.face1.plate1 : '',
                                plate2: data.face1 ? data.face1.plate2 : '',
                                plate3: data.face1 ? data.face1.plate3 : '',
                            },
                            face2: {
                                plate1: data.face2 ? data.face2.plate1 : '',
                                plate2: data.face2 ? data.face2.plate2 : '',
                                plate3: data.face2 ? data.face2.plate3 : '',
                                plate4: data.face2 ? data.face2.plate4 : '',
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: data.initialFace1 && data.initialFace1.plate1 ? data.initialFace1.plate1 : "" ,
                                plate2: data.initialFace1 && data.initialFace1.plate2 ? data.initialFace1.plate2 : "" ,
                                plate3: data.initialFace1 && data.initialFace1.plate3 ? data.initialFace1.plate3 : "" ,
                            },
                            face2: {
                                plate1: data.initialFace2 && data.initialFace2.plate1 ? data.initialFace2.plate1 : "" ,
                                plate2: data.initialFace2 && data.initialFace2.plate2 ? data.initialFace2.plate2 : "" ,
                                plate3: data.initialFace2 && data.initialFace2.plate3 ? data.initialFace2.plate3 : "" ,
                            },
                        },
                        platingPlates: {
                            plate1: data.platingPlates && data.platingPlates.plate1 ? data.platingPlates.plate1 : "",
                            plate2: data.platingPlates && data.platingPlates.plate2 ? data.platingPlates.plate2 : "",
                            plate3: data.platingPlates && data.platingPlates.plate3 ? data.platingPlates.plate3 : "",
                            plate4: data.platingPlates && data.platingPlates.plate4 ? data.platingPlates.plate4 : "",
                        },
                        platingInitialPlates: {
                            plate1: data.platingInitialPlates && data.platingInitialPlates.plate1 ? data.platingInitialPlates.plate1 : "",
                            plate2: data.platingInitialPlates && data.platingInitialPlates.plate2 ? data.platingInitialPlates.plate2 : "",
                            plate3: data.platingInitialPlates && data.platingInitialPlates.plate3 ? data.platingInitialPlates.plate3 : "",
                            plate4: data.platingInitialPlates && data.platingInitialPlates.plate4 ? data.platingInitialPlates.plate4 : "",
                        },
                        price: data.price,
                        consumption: data.consumption,
                        consumptionExterior: data.consumptionExterior,
                        systemName: data.systemName,
                    };

                    return databaseService.updateOffer({_id: savedOfferId}, offerData, language).then(() => resolve());
                }
        })
    });
};

/**
 * Delete a dinosaur from the database
 * @param language {String}
 * @returns {Promise}
 */
const deletePreviousOffers = (decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.deletePreviousOffers({
            userId: utilityService.castToObjectId(decoded.id)
        }, language)
            .then(() => resolve())
	});
};

/**
 * Delete saved offers from the database
 * @param language {String}
 * @returns {Promise}
 */
const deleteSavedOffers = (decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.deleteSavedOffers({
            userId: utilityService.castToObjectId(decoded.id),
        }, language)
            .then(() => resolve())
	});
};

/**
 * Delete saved offers from the database
 * @param language {String}
 * @returns {Promise}
 */
 const deleteDraftOffers = (decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.deleteDraftOffers({
            userId: utilityService.castToObjectId(decoded.id),
            status: "draft"
        }, language)
            .then(() => resolve())
	});
};

const newOffer = (decoded, language) => {
    return new Promise((resolve, reject) => {
        const data = {
            userId: utilityService.castToObjectId(decoded.id)
        };
        let promises = [];
        promises.push(databaseService.saveSavedOffers(data, language)
            .then(newOffer => {
                return databaseService.updateUser({
                    _id: utilityService.castToObjectId(decoded.id)
                },{
                    $addToSet: {savedOffers: newOffer._id}
                }, language)
                .then(() => {
                    resolve({    
                        id: newOffer._id,
                    })
                })
            }));
    })
}

const downloadOffer = (sessionId, offerId, language, country) => {
    return new Promise((resolve, reject) => {
        return databaseService.getSessionByFields({ _id: utilityService.castToObjectId(sessionId) }, language)
            .then(offers => {
                if (!offers) {
                    return reject(utilityService.parseCodeMessage('saved_offer_does_not_exist_delete', language));
                } else {
                    return databaseService.getUserByField({ _id: utilityService.castToObjectId(offers.userId)}, {} , null, language)
                        .then(user => {
                            return databaseService.getProductsByField({language: country}, {} , null, language)
                                .then(products => {
                                    return(downloadOfferService.generateExcelFromOffer(offers, user, products, language, offerId))
                                        .then(fileName => resolve(fileName));
                                })
                                .catch(err => reject(err))
                        })
                        .catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
    });
}

const downloadSession = (sessionId, language, country) => {
    return new Promise((resolve, reject) => {
        return databaseService.getSessionByFields({ _id: utilityService.castToObjectId(sessionId) }, language)
            .then(session => {
                if (!session) {
                    return reject(utilityService.parseCodeMessage('saved_offer_does_not_exist_delete', language));
                } else {
                    return databaseService.getUserByField({ _id: utilityService.castToObjectId(session.userId)}, {} , null, language)
                        .then(user => {
                            return databaseService.getProductsByField({language: country}, {} , null, language)
                                .then(products => {
                                    return(downloadOfferService.generateExcelFromOffer(session, user, products, language))
                                        .then(fileName =>  resolve(fileName));
                                })
                                .catch(err => reject(err))
                        })
                        .catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
    });
}

/**
 * Get all saved offers from the database for a user
 * @param savedOfferId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getSavedOffers = (decoded, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSavedOffersByFields({
            // savedOfferId: utilityService.castToObjectId(savedOfferId),
            userId: utilityService.castToObjectId(decoded.id),
        }, { $sort: { createdOn: desc } }, null, language)
			.then(savedOffers => {
                return resolve({
					savedOffers: savedOffers.map(thisOffer => ( {
                        _id: thisOffer._id,
                        status: thisOffer.status, 
                        surface: thisOffer.surface, 
                        excelName: thisOffer.excelName, 
                        soundInsulationMin: thisOffer.soundInsulationMin,
                        intermediatePlate: thisOffer.intermediatePlate,
                        soundInsulationMax: thisOffer.soundInsulationMax,
                        basedPlates: thisOffer.basedPlates,
                        thicknessSystem: thisOffer.thicknessSystem, 
                        ceilingSupport: thisOffer.ceilingSupport,
                        protectionSense: thisOffer.protectionSense,
                        profileType: thisOffer.profileType,
                        height: thisOffer.height,
                        fireResistance: thisOffer.fireResistance,
                        soundInsulation: thisOffer.soundInsulation,
                        support: thisOffer.support,
                        finishing: thisOffer.finishing,
                        interax: thisOffer.interax,
                        moistureResistance: thisOffer.moistureResistance,
                        burglaryResistance: thisOffer.burglaryResistance,
                        interaxSustineri: thisOffer.interaxSustineri,
                        izolareAcustica: thisOffer.izolareAcustica,
                        systemCode: thisOffer.systemCode,
                        systemCodeTable: thisOffer.systemCodeTable,
                        codSap1: thisOffer.codSap1,
                        codSap2: thisOffer.codSap2,
                        codSap3: thisOffer.codSap3,
                        codSap4: thisOffer.codSap4,
                        plate: {
                            face1: {
                                plate1: thisOffer.plate.face1 && thisOffer.plate.face1.plate1 ? thisOffer.plate.face1.plate1 : "",
                                plate2: thisOffer.plate.face1 && thisOffer.plate.face1.plate2 ? thisOffer.plate.face1.plate2 : "",
                                plate3: thisOffer.plate.face1 && thisOffer.plate.face1.plate3 ? thisOffer.plate.face1.plate3 : "",
                            },
                            face2: {
                                plate1: thisOffer.plate.face2 && thisOffer.plate.face2.plate1 ? thisOffer.plate.face2.plate1 : "",
                                plate2: thisOffer.plate.face2 && thisOffer.plate.face2.plate2 ? thisOffer.plate.face2.plate2 : "",
                                plate3: thisOffer.plate.face2 && thisOffer.plate.face2.plate3 ? thisOffer.plate.face2.plate3 : "",
                                plate4: thisOffer.plate.face2 && thisOffer.plate.face2.plate4 ? thisOffer.plate.face2.plate4 : "",
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: thisOffer.initialPlate.face1 && thisOffer.initialPlate.face1.plate1 ? thisOffer.initialPlate.face1.plate1 : "" ,
                                plate2: thisOffer.initialPlate.face1 && thisOffer.initialPlate.face1.plate2 ? thisOffer.initialPlate.face1.plate2 : "" ,
                                plate3: thisOffer.initialPlate.face1 && thisOffer.initialPlate.face1.plate3 ? thisOffer.initialPlate.face1.plate3 : "" ,
                            },
                            face2: {
                                plate1: thisOffer.initialPlate.face2 && thisOffer.initialPlate.face2.plate1 ? thisOffer.initialPlate.face2.plate1 : "" ,
                                plate2: thisOffer.initialPlate.face2 && thisOffer.initialPlate.face2.plate2 ? thisOffer.initialPlate.face2.plate2 : "" ,
                                plate3: thisOffer.initialPlate.face2 && thisOffer.initialPlate.face2.plate3 ? thisOffer.initialPlate.face2.plate3 : "" ,
                            },
                        },
                        platingPlates: {
                            plate1: thisOffer.platingPlates && thisOffer.platingPlates.plate1 ? thisOffer.platingPlates.plate1 : "",
                            plate2: thisOffer.platingPlates && thisOffer.platingPlates.plate2 ? thisOffer.platingPlates.plate2 : "",
                            plate3: thisOffer.platingPlates && thisOffer.platingPlates.plate3 ? thisOffer.platingPlates.plate3 : "",
                            plate4: thisOffer.platingPlates && thisOffer.platingPlates.plate4 ? thisOffer.platingPlates.plate4 : "",
                        },
                        platingInitialPlates: {
                            plate1: thisOffer.platingInitialPlates && thisOffer.platingInitialPlates.plate1 ? thisOffer.platingInitialPlates.plate1 : "",
                            plate2: thisOffer.platingInitialPlates && thisOffer.platingInitialPlates.plate2 ? thisOffer.platingInitialPlates.plate2 : "",
                            plate3: thisOffer.platingInitialPlates && thisOffer.platingInitialPlates.plate3 ? thisOffer.platingInitialPlates.plate3 : "",
                            plate4: thisOffer.platingInitialPlates && thisOffer.platingInitialPlates.plate4 ? thisOffer.platingInitialPlates.plate4 : "",
                        },
                        price: thisOffer.price,
                        consumption: thisOffer.consumption,
                        consumptionExterior: thisOffer.consumptionExterior,
                        systemName: thisOffer.systemName,
					} ))
				})
			})
			.catch(err => {
                reject(err)
            });
	});
};

/**
 * Saves a offer in the database
 * @param req {Object} - Required for image upload
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateSavedOffer = (savedOfferId, data, decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.getSavedOffersByFields({
            _id: utilityService.castToObjectId(savedOfferId),
            userId: utilityService.castToObjectId(decoded.id),
		}, language)
			.then(offer => {
				if (!offer) {
                    return reject(utilityService.parseCodeMessage('offer_does_not_exist_update', language));
                }
                else {
                    const offerData = {
                        createdAt: new Date(),
                        status: data.status, 
						_id: savedOfferId,
                        soundInsulationMin: data.soundInsulationMin,
                        intermediatePlate: data.intermediatePlate,
                        soundInsulationMax: data.soundInsulationMax,
                        basedPlates: data.basedPlates,
                        profileType: data.profileType,
                        protectionSense: data.protectionSense,
                        thicknessSystem: data.thicknessSystem,
                        ceilingSupport: data.ceilingSupport,
                        height: data.height,
                        fireResistance: data.fireResistance,
                        soundInsulation: data.soundInsulation,
                        support: data.support,
                        finishing: data.finishing,
                        interax: data.interax,
                        moistureResistance: data.moistureResistance,
                        burglaryResistance: data.burglaryResistance,
                        interaxSustineri: data.interaxSustineri,
                        izolareAcustica: data.izolareAcustica,
                        systemCode: data.systemCode,
                        systemCodeTable: data.systemCodeTable,
                        codSap1: data.codSap1,
                        codSap2: data.codSap2,
                        codSap3: data.codSap3,
                        codSap4: data.codSap4,
                        plate: {
                            face1: {
                                plate1: data.face1 && data.face1.plate1 ? data.face1.plate1 : "",
                                plate2: data.face1 && data.face1.plate2 ? data.face1.plate2 : "",
                                plate3: data.face1 && data.face1.plate3 ? data.face1.plate3 : "",
                            },
                            face2: {
                                plate1: data.face2 && data.face2.plate1 ? data.face2.plate1 : "",
                                plate2: data.face2 && data.face2.plate2 ? data.face2.plate2 : "",
                                plate3: data.face2 && data.face2.plate3 ? data.face2.plate3 : "",
                                plate4: data.face2 && data.face2.plate4 ? data.face2.plate4 : "",
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: data.initialFace1 && data.initialFace1.plate1 ? data.initialFace1.plate1 : "" ,
                                plate2: data.initialFace1 && data.initialFace1.plate2 ? data.initialFace1.plate2 : "" ,
                                plate3: data.initialFace1 && data.initialFace1.plate3 ? data.initialFace1.plate3 : "" ,
                            },
                            face2: {
                                plate1: data.initialFace2 && data.initialFace2.plate1 ? data.initialFace2.plate1 : "" ,
                                plate2: data.initialFace2 && data.initialFace2.plate2 ? data.initialFace2.plate2 : "" ,
                                plate3: data.initialFace2 && data.initialFace2.plate3 ? data.initialFace2.plate3 : "" ,
                            },
                        },
                        platingPlates: {
                            plate1: data.platingPlates && data.platingPlates.plate1 ? data.platingPlates.plate1 : "",
                            plate2: data.platingPlates && data.platingPlates.plate2 ? data.platingPlates.plate2 : "",
                            plate3: data.platingPlates && data.platingPlates.plate3 ? data.platingPlates.plate3 : "",
                            plate4: data.platingPlates && data.platingPlates.plate4 ? data.platingPlates.plate4 : "",
                        },
                        platingInitialPlates: {
                            plate1: data.platingInitialPlates && data.platingInitialPlates.plate1 ? data.platingInitialPlates.plate1 : "",
                            plate2: data.platingInitialPlates && data.platingInitialPlates.plate2 ? data.platingInitialPlates.plate2 : "",
                            plate3: data.platingInitialPlates && data.platingInitialPlates.plate3 ? data.platingInitialPlates.plate3 : "",
                            plate4: data.platingInitialPlates && data.platingInitialPlates.plate4 ? data.platingInitialPlates.plate4 : "",
                        },
                        price: data.price,
                        consumption: data.consumption,
                        consumptionExterior: data.consumptionExterior,
                        systemName: data.systemName,
                        surface: data.surface,
                        jointLength: data.jointLength,
                        excelName: data.excelName,
                    };

                    return databaseService.updateSavedOffer({_id: savedOfferId}, offerData, language).then(() => resolve());
                }
        })
    });
};

/**
 * Saves a offer in the database
 * @param req {Object} - Required for image upload
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const updateSavedPlatingOffer = (savedOfferId, data, decoded, language) => {
	return new Promise((resolve, reject) => {
        return databaseService.getSavedOffersByFields({
            _id: utilityService.castToObjectId(savedOfferId),
            userId: utilityService.castToObjectId(decoded.id),
		}, language)
			.then(offer => {
				if (!offer) {
                    return reject(utilityService.parseCodeMessage('offer_does_not_exist_update', language));
                }
                else {
                    const offerData = {
                        createdAt: new Date(),
                        status: data.status, 
						_id: savedOfferId,
                        soundInsulationMin: data.soundInsulationMin,
                        soundInsulationMax: data.soundInsulationMax,
                        basedPlates: data.basedPlates,
                        profileType: data.profileType,
                        thicknessSystem: data.thicknessSystem,
                        protectionSense: data.protectionSense,
                        thickness: data.thickness,
                        ceilingSupport: data.ceilingSupport,
                        height: data.height,
                        fireResistance: data.fireResistance,
                        soundInsulation: data.soundInsulation,
                        support: data.support,
                        finishing: data.finishing,
                        interax: data.interax,
                        moistureResistance: data.moistureResistance,
                        izolareAcustica: data.izolareAcustica || 0,
                        systemCode: data.systemCode,
                        systemCodeTable: data.systemCodeTable,
                        codSap1: data.codSap1,
                        codSap2: data.codSap2,
                        codSap3: data.codSap3,
                        codSap4: data.codSap4,
                        platingPlates: {
                            plate1: data.platingPlates.plate1,
                            plate2: data.platingPlates.plate2,
                            plate3: data.platingPlates.plate3,
                            plate4: data.platingPlates.plate4,
                        },
                        platingInitialPlates: {
                            plate1: data.platingInitialPlates.plate1,
                            plate2: data.platingInitialPlates.plate2,
                            plate3: data.platingInitialPlates.plate3,
                            plate4: data.platingInitialPlates.plate4,
                        },
                        price: data.price,
                        consumption: data.consumption,
                        consumptionExterior: data.consumptionExterior,
                        systemName: data.systemName,
                    };
                    return databaseService.updateSavedOffer({_id: utilityService.castToObjectId(savedOfferId)}, {$set:offerData}, language).then(() => resolve());
                }
        })
    });
};

/**
 * Get one saved offer from the database
 * @param savedOfferId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getSavedOffer = (savedOfferId, decoded, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSavedOfferByFields({
            _id: utilityService.castToObjectId(savedOfferId),
            userId: utilityService.castToObjectId(decoded.id),
        }, { $sort: { createdOn: desc } }, null, language)
			.then(thisOffer => {
				return resolve({
					savedOffer: {
                        // status: thisOffer.status,
						_id: thisOffer._id,
                        profileType: thisOffer.profileType,
                        soundInsulationMin: thisOffer.soundInsulationMin,
                        soundInsulationMax: thisOffer.soundInsulationMax,
                        intermediatePlate: thisOffer.intermediatePlate,
                        basedPlates: thisOffer.basedPlates,
                        thicknessSystem: thisOffer.thicknessSystem,
                        ceilingSupport: thisOffer.ceilingSupport,
                        protectionSense: thisOffer.protectionSense,
                        height: thisOffer.height,
                        fireResistance: thisOffer.fireResistance,
                        soundInsulation: thisOffer.soundInsulation,
                        support: thisOffer.support,
                        finishing: thisOffer.finishing,
                        interax: thisOffer.interax,
                        moistureResistance: thisOffer.moistureResistance,
                        burglaryResistance: thisOffer.burglaryResistance,
                        interaxSustineri: thisOffer.interaxSustineri,
                        izolareAcustica: thisOffer.izolareAcustica,
                        systemCode: thisOffer.systemCode,
                        systemCodeTable: thisOffer.systemCodeTable,
                        codSap1: thisOffer.codSap1,
                        codSap2: thisOffer.codSap2,
                        codSap3: thisOffer.codSap3,
                        codSap4: thisOffer.codSap4,
                        plate: {
                            face1: {
                                plate1: thisOffer.plate && thisOffer.plate.face1 ? thisOffer.plate.face1.plate1 : '',
                                plate2: thisOffer.plate && thisOffer.plate.face1 ? thisOffer.plate.face1.plate2 : '',
                                plate3: thisOffer.plate && thisOffer.plate.face1 ? thisOffer.plate.face1.plate3 : '',
                            },
                            face2: {
                                plate1: thisOffer.plate && thisOffer.plate.face2 ? thisOffer.plate.face2.plate1 : '',
                                plate2: thisOffer.plate && thisOffer.plate.face2 ? thisOffer.plate.face2.plate2 : '',
                                plate3: thisOffer.plate && thisOffer.plate.face2 ? thisOffer.plate.face2.plate3 : '',
                                plate4: thisOffer.plate && thisOffer.plate.face2 ? thisOffer.plate.face2.plate4 : '',
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: thisOffer.initialPlate && thisOffer.initialPlate.face1 ? thisOffer.initialPlate.face1.plate1 : '',
                                plate2: thisOffer.initialPlate && thisOffer.initialPlate.face1 ? thisOffer.initialPlate.face1.plate2 : '',
                                plate3: thisOffer.initialPlate && thisOffer.initialPlate.face1 ? thisOffer.initialPlate.face1.plate3 : '',
                            },
                            face2: {
                                plate1: thisOffer.initialPlate && thisOffer.initialPlate.face2 ? thisOffer.initialPlate.face2.plate1 : '',
                                plate2: thisOffer.initialPlate && thisOffer.initialPlate.face2 ? thisOffer.initialPlate.face2.plate2 : '',
                                plate3: thisOffer.initialPlate && thisOffer.initialPlate.face2 ? thisOffer.initialPlate.face2.plate3 : '',
                            },
                        },
                        platingPlates: {
                            plate1: thisOffer.platingPlates ? thisOffer.platingPlates.plate1 : '',
                            plate2: thisOffer.platingPlates ? thisOffer.platingPlates.plate2 : '',
                            plate3: thisOffer.platingPlates ? thisOffer.platingPlates.plate3 : '',
                            plate4: thisOffer.platingPlates ? thisOffer.platingPlates.plate4 : '',
                        },
                        platingInitialPlates: {
                            plate1: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate1 : '',
                            plate2: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate2 : '',
                            plate3: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate3 : '',
                            plate4: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate4 : '',
                        },
                        price: thisOffer.price,
                        consumption: thisOffer.consumption,
                        consumptionExterior: thisOffer.consumptionExterior,
                        systemName: thisOffer.systemName,
                        surface: thisOffer.surface,
					}
				})
			})
			.catch(err => {
                reject(err)
            });
            
	});
};

/**
 * Delete a dinosaur from the database
 * @param savedOfferId {String}
 * @param language {String}
 * @returns {Promise}
 */
const deleteSavedOffer = (savedOfferId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSavedOfferByFields({ _id: utilityService.castToObjectId(savedOfferId) }, language)
			.then(savedOffer => {
				if (!savedOffer) {
					return reject(utilityService.parseCodeMessage('saved_offer_does_not_exist_delete', language));
				} else {
					return databaseService.deleteSavedOffer({ _id: savedOffer._id }, language)
						.then(() => resolve())
				}
			})
			.catch(err => reject(err))
	});
};

/**
 * Delete a session from the database
 * @param sessionId {String}
 * @param language {String}
 * @returns {Promise}
 */
 const deleteSession = (sessionId, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSessionByFields({ _id: utilityService.castToObjectId(sessionId) }, language)
			.then(session => {
				if (!session) {
					return reject(utilityService.parseCodeMessage('session_does_not_exist_delete', language));
				} else {
					return databaseService.deleteSession({ _id: session._id }, language)
						.then(() => resolve())
				}
			})
			.catch(err => reject(err))
	});
};

const saveSession = (decoded, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.saveSession({userId: utilityService.castToObjectId(decoded.id)}, language)
                .then((savedUser) => resolve({id:savedUser._id}))
                .catch(err => reject(err))
    })
}

const updateSession = (decoded, data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getSavedSessionByFields({
            _id: utilityService.castToObjectId(data.id),
            userId: utilityService.castToObjectId(decoded.id),
        }, language)
        .then(session => {
            if (!session) {
                return reject(utilityService.parseCodeMessage('session_does_not_exist_update', language));
            }
            else {
                let formData = {
                    data: {
                        company: data.company,
                        contactPerson: data.contactPerson,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        objective: data.objective,
                        typeObjective: data.typeObjective,
                        code: data.code,
                        location: data.location,
                        description: data.description,
                        validationDate: data.validationDate,
                    }
                }
                return databaseService.updateSession({_id: utilityService.castToObjectId(data.id)}, {$set:formData}, language).then(() => resolve());
            }
        })
    })
}

const updateOfferSession = (decoded, data, sessionId, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getSavedSessionByFields({
            _id: utilityService.castToObjectId(sessionId),
            userId: utilityService.castToObjectId(decoded.id),
        }, language)
        .then(session => {
            if (!session) {
                return reject(utilityService.parseCodeMessage('session_does_not_exist_update', language));
            }
            else {
                let promises = [];
                data.forEach(item => {
                    if (session.session.some(session => utilityService.compareIds(session._id, item._id))) {
                        promises.push(databaseService.updateSession({_id: utilityService.castToObjectId(sessionId)}, {$pull:{session:{_id:utilityService.castToObjectId(item._id)}}}, language)
                        .then(() => {
                            return databaseService.updateSession({_id: utilityService.castToObjectId(sessionId)}, {$push:{session: item}}, language);
                        }));
                    }
                    else {
                        promises.push(databaseService.updateSession({_id: utilityService.castToObjectId(sessionId)}, {$push:{session: item}}, language))
                    }
                })
                return Promise.all(promises)
                .then(() => resolve())
                .catch(() => reject())

            }
        })
    })
}

const deleteSessionOffer = (decoded, sessionId, offerId, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getSavedSessionByFields({
            _id: utilityService.castToObjectId(sessionId),
            userId: utilityService.castToObjectId(decoded.id),
        }, language)
        .then(session => {
            if (!session) {
                return reject(utilityService.parseCodeMessage('session_does_not_exist_update', language));
            }
            else {
                databaseService.updateSession({_id: session._id}, {$pull:{session:{_id: utilityService.castToObjectId(offerId)}}}, language)
                .then(() => resolve())
                .catch(() => reject())

            }
        })
    })
}

/**
 * Get all sessions from the database for a user
 * @param language {String}
 * @returns {Promise}
 */
const getSessions = (decoded, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSessionsByFields({
            userId: utilityService.castToObjectId(decoded.id),
        }, { $sort: { createdOn: -1 } }, null, language)
			.then(sessions => {
                utilityService.sortArray(sessions, 'DESC', 'createdOn')
                return resolve(sessions)
			})
			.catch(err => {
                reject(err)
            });
	});
};

/**
 * Get session from the database for a user
 * @param language {String}
 * @returns {Promise}
 */
const getSession = (sessionId, decoded, language) => {
	return new Promise((resolve, reject) => {
		return databaseService.getSessionByFields({
            userId: utilityService.castToObjectId(decoded.id),
            _id: utilityService.castToObjectId(sessionId),
        }, {}, null, language)
			.then(session => {
                let newSession = {data: session.data, createdOn:session.createdOn, session:[] };
                utilityService.sortArray(session.session, 'DESC', 'createdAt');
                session.session.forEach(thisOffer => {
                    newSession.session.push({
                        createdAt: thisOffer.createdAt,
                        _id: thisOffer._id,
                        profileType: thisOffer.profileType,
                        soundInsulationMin: thisOffer.soundInsulationMin,
                        soundInsulationMax: thisOffer.soundInsulationMax,
                        intermediatePlate: thisOffer.intermediatePlate,
                        basedPlates: thisOffer.basedPlates,
                        thicknessSystem: thisOffer.thicknessSystem,
                        protectionSense: thisOffer.protectionSense,
                        ceilingSupport: thisOffer.ceilingSupport,
                        height: thisOffer.height,
                        fireResistance: thisOffer.fireResistance,
                        soundInsulation: thisOffer.soundInsulation,
                        support: thisOffer.support,
                        finishing: thisOffer.finishing,
                        interax: thisOffer.interax,
                        moistureResistance: thisOffer.moistureResistance,
                        burglaryResistance: thisOffer.burglaryResistance,
                        interaxSustineri: thisOffer.interaxSustineri,
                        izolareAcustica: thisOffer.izolareAcustica,
                        systemCode: thisOffer.systemCode,
                        systemCodeTable: thisOffer.systemCodeTable,
                        codSap1: thisOffer.codSap1,
                        codSap2: thisOffer.codSap2,
                        codSap3: thisOffer.codSap3,
                        codSap4: thisOffer.codSap4,
                        plate: {
                            face1: {
                                plate1: thisOffer.face1 ? thisOffer.face1.plate1 : '',
                                plate2: thisOffer.face1 ? thisOffer.face1.plate2 : '',
                                plate3: thisOffer.face1 ? thisOffer.face1.plate3 : '',
                            },
                            face2: {
                                plate1: thisOffer.face2 ? thisOffer.face2.plate1 : '',
                                plate2: thisOffer.face2 ? thisOffer.face2.plate2 : '',
                                plate3: thisOffer.face2 ? thisOffer.face2.plate3 : '',
                                plate4: thisOffer.face2 ? thisOffer.face2.plate4 : '',
                            },
                        },
                        initialPlate: {
                            face1: {
                                plate1: thisOffer.initialFace1 ? thisOffer.initialFace1.plate1 : '',
                                plate2: thisOffer.initialFace1 ? thisOffer.initialFace1.plate2 : '',
                                plate3: thisOffer.initialFace1 ? thisOffer.initialFace1.plate3 : '',
                            },
                            face2: {
                                plate1: thisOffer.initialFace2 ? thisOffer.initialFace2.plate1 : '',
                                plate2: thisOffer.initialFace2 ? thisOffer.initialFace2.plate2 : '',
                                plate3: thisOffer.initialFace2 ? thisOffer.initialFace2.plate3 : '',
                                plate4: thisOffer.initialFace2 ? thisOffer.initialFace2.plate4 : '',
                            },
                        },
                        platingPlates: {
                            plate1: thisOffer.platingPlates ? thisOffer.platingPlates.plate1 : '',
                            plate2: thisOffer.platingPlates ? thisOffer.platingPlates.plate2 : '',
                            plate3: thisOffer.platingPlates ? thisOffer.platingPlates.plate3 : '',
                            plate4: thisOffer.platingPlates ? thisOffer.platingPlates.plate4 : '',
                        },
                        platingInitialPlates: {
                            plate1: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate1 : '',
                            plate2: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate2 : '',
                            plate3: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate3 : '',
                            plate4: thisOffer.platingInitialPlates ? thisOffer.platingInitialPlates.plate4 : '',
                        },
                        price: thisOffer.price,
                        consumption: thisOffer.consumption,
                        consumptionExterior: thisOffer.consumptionExterior,
                        systemName: thisOffer.systemName,
                        surface: thisOffer.surface,
                        jointLength: thisOffer.jointLength,
                        excelName: thisOffer.excelName,
                    })
                })

                return resolve({session: newSession});
			})
			.catch(err => {
                reject(err)
            });
	});
};

/**
 * Get a system code from the database
 * @param offerId {String}
 * @param language {String}
 * @returns {Promise}
 */
const getSystemCode = (data, language) => {
	return new Promise((resolve, reject) => {
        let allSystemCodes = [], query;

        if (data.fireResistance) {
            query = {
                ...query,
                fireResistance: parseInt(data.fireResistance).toString(),
            }
        }
        if (data.profileType) {
            query = {
                ...query,
                profileType: data.profileType,
            }
        }
        if (data.moistureResistance) {
            query = {
                ...query,
                moistureResistance: data.moistureResistance,
            }
        }
        if (data.burglaryResistance) {
            query = {
                ...query,
                burglaryResistance: data.burglaryResistance.replace("RC", ""),
            }
        }
        if (data.thickness && data.thickness !== "Oricare") {
            query = {
                ...query,
                thickness: parseFloat(data.thickness),
            }
        }
        query = {
            ...query, 
            hMax: {  $gte: parseFloat(data.height) },
            hMin: {  $lt: parseFloat(data.height) },
            systemAccess: '0',
        }

        let queryName = '', structureLinkQuery = -1;
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Simple')) {
            queryName = 'Sisteme - Plafoane Simple'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Duble')) {
            queryName = 'Sisteme - Plafoane Duble'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Simple') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Simple'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Duble') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Plafoane Smart Duble'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Triple')) {
            queryName = 'Sisteme - Plafoane Triple'
        }
        if (data.systemName.includes('Plafoane') &&  data.systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Plafoane Cvadruple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Simple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Duble'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Simple') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Simple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Duble') && data.systemName.includes('Smart')) {
            queryName = 'Sisteme - Placari Smart Duble'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Triple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Cvadruple')) {
            queryName = 'Sisteme - Placari Cvadruple'
        }
        if (data.systemName.includes('Placari') &&  data.systemName.includes('Lipire')) {
            queryName = 'Sisteme - Placari Lipire'
        }
        if (data.systemName.includes('Noisy') &&  data.systemName.includes('Simple')) {
            queryName = 'Sisteme - Placari Noisy Simple'
        }
        if (data.systemName.includes('Noisy') &&  data.systemName.includes('Duble')) {
            queryName = 'Sisteme - Placari Noisy Duble'
        }
        if (data.systemName.includes('Noisy') &&  data.systemName.includes('Triple')) {
            queryName = 'Sisteme - Placari Noisy Triple'
        }
        if (data.systemName.includes('Placat') &&  data.systemName.includes('Simplu')) {
            queryName = 'Sisteme - Simplu Placat'
        }
        if (data.systemName.includes('Placat') &&  data.systemName.includes('Dublu')) {
            queryName = 'Sisteme - Dublu Placat'
        }
        if (data.systemName.includes('Placat') &&  data.systemName.includes('Triplu')) {
            queryName = 'Sisteme - Triplu Placat'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Simplu')) {
            queryName = 'Pereti Separativi - Simplu Placat'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Dublu')) {
            queryName = 'Pereti Separativi - Dublu Placat'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Triplu')) {
            queryName = 'Pereti Separativi - Triplu Placat'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Asimetrici')) {
            queryName = 'Pereti Separativi - Asimetrici'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Dublu') &&  data.systemName.includes('Intermediar')) {
            queryName = 'Pereti Separativi - Dublu Intermediar'
        }
        if (data.systemName.includes('Pereti S') &&  data.systemName.includes('Triplu') &&  data.systemName.includes('Intermediar')) {
            queryName = 'Pereti Separativi - Triplu Intermediar'
        }
        if (data.systemName.includes('Pereti Smart') && data.systemName.includes('Simplu')) {
            queryName = 'Pereti Smart - Simplu Placat'
        }
        if (data.systemName.includes('Pereti Smart')  && data.systemName.includes('Dublu')) {
            queryName = 'Pereti Smart - Dublu Placat'
        }
        if (data.systemName.includes('Pereti S') && data.systemName.includes('Smart') === false) {
            structureLinkQuery = 1;
        }
        if (data.systemName.includes('Pereti SL') && data.systemName.includes('Smart') === false) {
            structureLinkQuery = 2;
        }
        if (data.systemName.includes('Pereti SLA') && data.systemName.includes('Smart') === false) {
            structureLinkQuery = 3;
        }
        
        let interaxSustineri = [];
        if (data.systemName.includes("ixari")) {
            interaxSustineri = [125, 250]
        }

        if (data.systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (data.systemName.includes("liniare")) {
            interaxSustineri = [2, 2.5]
        }

        if (data.systemName.includes("independente")) {
            interaxSustineri = [0]
        }

        if (data.systemName.includes("UU")) {
            interaxSustineri = [1]
        }
        if (structureLinkQuery !== -1) {
            query = { 
                ...query,
                importName: queryName, 
                structureLink: structureLinkQuery
            }
        }
        else {
            query = {
                ...query,
                importName: queryName, 
            }
        }
        if (data.systemName.includes("Plafoane")) {
            query = {
                ...query,
                importName: queryName, 
                support: data.systemName.includes("Autoportant") ? "0" : {$in: ["1", "2", "3", "4", "5", "6"]},
            }
            if (data.systemName.includes("Simple") && data.secondaryInterax !== "Oricare") {
                query = {
                    ...query,
                    interax: { $regex : data.secondaryInterax }
                }
            }
        }
        if (interaxSustineri.length > 0) {
            query = {
                ...query,
                interaxSustineri: { $in: interaxSustineri }
            }
        }

        if (data.thicknessSystem && data.thicknessSystem !== "Oricare") {
            query = {
                ...query,
                thickness: parseFloat(data.thicknessSystem)
            }
        }

        if (data.ceilingSupport && data.ceilingSupport !== "Oricare") {
            let ceilings = ["Autoportant", "Brida", "Tirant", "Nonius", "Tija M8", "Racord lemn", "Brida AC"];
            let position = 0;
            ceilings.forEach((ceiling, index) => {
                if (ceiling === data.ceilingSupport) {
                    position = index;
                }
            });
            query = {
                ...query,
                support: position.toString()
            }
        }

        return databaseService.getSystemCode(query, null, null, language)
                .then(systemCodes => {
                    allSystemCodes = systemCodes.map(system => ({
                                        systemCode: system.systemCode,
                                        intermediatePlate: system.intermediatePlate,
                                        basePlate: system.basePlate,
                                        valueHoldingInterax: system.valueHoldingInterax,
                                        protectionSense: system.protectionSense,
                                        autoportante: system.autoportante,
                                        systemCodeTable: system.systemCodeTable,
                                        soundInsulation: system.soundInsulation,
                                        fireResistance: system.fireResistance,
                                        profileType: system.profileType,
                                        moistureResistance: system.moistureResistance,
                                        burglaryResistance: system.burglaryResistance,
                                        thickness: system.thickness,
                                        distance: system.distance,
                                        auxilary: system.auxilary,
                                        support: system.support,
                                        codSap1: system.codSap1,
                                        codSap2: system.codSap2,
                                        codSap3: system.codSap3,
                                        codSap4: system.codSap4,
                                        valueSoundInsulation: system.valueSoundInsulation,
                                        importName: system.importName,
                                        plates: system.plates,
                                        platingPlates: system.platingPlates,
                                        interax: system.interax
                                    }))
                    resolve(allSystemCodes);
                })
                .catch(err => console.log(err))
	});
};

module.exports = {
    saveOffer,
    getOffer,
    updateOffer,
    deletePreviousOffers,
    getOffers,
    saveCurrentOffer,
    getCurrentOffer,
    newOffer,
    getSavedOffers,
    updateSavedOffer,
    getSavedOffer,
    deleteSavedOffer,
    downloadOffer,
    downloadSession,
    saveSession,
    deleteSavedOffers,
    getSessions,
    getSession,
    getSystemCode,
    updateSavedPlatingOffer,
    savePlatingOffer,
    deleteDraftOffers,
    updateSession,
    updateOfferSession,
    deleteSession,
    deleteSessionOffer,
}
