let Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

// General variables
const phoneNumberPattern = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|-)?([0-9]{3}(\s|\.|-|)){2}$/im;
const datePattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
const internationalPhoneNumberPattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;

// For sorting
const desc = -1;
const asc = 1;

// Schemas that are reused
const accountFields = {
    company: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'job_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'company_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'company_max';
                    break;
                }
                default: {
                    err.message = 'company_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    job: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'job_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'job_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'job_max';
                    break;
                }
                default: {
                    err.message = 'job_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    address: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'address_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'address_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'address_max';
                    break;
                }
                default: {
                    err.message = 'address_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    locality: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'locality_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'locality_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'locality_max';
                    break;
                }
                default: {
                    err.message = 'locality_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    language: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'language_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'language_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'language_max';
                    break;
                }
                default: {
                    err.message = 'language_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    country: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'country_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'country_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'country_max';
                    break;
                }
                default: {
                    err.message = 'country_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    state: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'state_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'state_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'state_max';
                    break;
                }
                default: {
                    err.message = 'state_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    lastName: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'last_name_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'last_name_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'last_name_max';
                    break;
                }
                default: {
                    err.message = 'last_name_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    firstName: Joi.string().min(1).max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'first_name_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'first_name_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'first_name_max';
                    break;
                }
                default: {
                    err.message = 'first_name_required';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    phoneNumber: Joi.string().min(10).max(15).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.empty': {
                    err.message = 'phone_number_required';
                    break;
                }
                case 'string.min': {
                    err.message = 'phone_number_min';
                    break;
                }
                case 'string.max': {
                    err.message = 'phone_number_max';
                    break;
                }
                default: {
                    err.message = 'phone_number_other_error';
                    break;
                }
            }
        });
        return new Error(errors);
    }),
};
const dinosaurFields = {
    species: Joi.string().max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'species_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'species_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    foodPreference: Joi.string().valid('herbivorous', 'carnivorous', 'omnivorous').required().error(new Error('invalid_food_preference')),
    wikipediaPage: Joi.string().max(256).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'wikipedia_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'wikipedia_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    averageSize: Joi.string().max(10).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'average_size_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'average_size_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    })
};

const allowedPlates = {
    plateName: Joi.string().max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'plate_name_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'plate_name_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    canReplacePlate: Joi.string().allow('NIDA Standard', 'NIDA Acustic', 'NIDA Flam', 'NIDA Flam Extra', 'Rezistex').required().error(new Error('invalid_replace_plate')),
}

const offerFields = {
    savedOfferId: Joi.objectId().optional().error(new Error("nu avem id")),
    _id: Joi.objectId().optional().error(new Error("nu avem id")),
    profileType: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'profile_type_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    status: Joi.string().max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.empty': {
                    err.message = 'status_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'status_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    interaxSustineri: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.max': {
                    err.message = 'interax_sustineri_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    createdAt: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.max': {
                    err.message = 'intermediatePlate_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    intermediatePlate: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.max': {
                    err.message = 'intermediatePlate_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    structureLink: Joi.number().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    thickness: Joi.number().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    soundInsulationMin: Joi.number().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'soundInsulationMin_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'soundInsulationMin_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    soundInsulationMax: Joi.number().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'soundInsulationMax_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'soundInsulationMax_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    basedPlates: Joi.string().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'basedPlates_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'basedPlates_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    thicknessSystem: Joi.string().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    distance: Joi.number().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    fireResistance: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'fireResistance_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    moistureResistance: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'moistureResistance_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    burglaryResistance: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'burglaryResistance_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    soundInsulation: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'soundInsulation_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    height: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    izolareAcustica: Joi.number().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.max': {
                    err.message = 'izolare_acustica_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    systemCode: Joi.string().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'systemCode_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    systemCodeTable: Joi.string().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'systemCodeTable_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    auxilary: Joi.string().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'auxilary_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    support: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'support_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    ceilingSupport: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'support_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    finishing: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'finishing_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    codSap1: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'codSap1_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    codSap2: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'codSap2_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    codSap3: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'codSap3_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    codSap4: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'codSap4_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    interax: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'interax_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    protectionSense: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'soundInsulation_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    price: Joi.number().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'price_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    surface: Joi.number().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'surface_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    jointLength: Joi.number().allow('').optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'surface_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    excelName: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'codSap2_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    consumption: Joi.array().items({
        codSap: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'cod_sap_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        productName: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        amount: Joi.number().optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'amount_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        category: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        price: Joi.number().optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'price_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        weight: Joi.number().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'price_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        unitMeasure: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    }),
    consumptionExterior: Joi.array().items({
        codSap: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        productName: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        category: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        amount: Joi.number().optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'amount_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        price: Joi.number().optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'price_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        weight: Joi.number().optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'price_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        unitMeasure: Joi.string().allow('').optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'product_name_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    }),
    face1: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    face2: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.empty': {
                        err.message = 'plate1_required';
                        break;
                    }
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate4: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    initialFace1: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    initialFace2: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.empty': {
                        err.message = 'plate1_required';
                        break;
                    }
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate4: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    platingPlates: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate4: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    platingInitialPlates: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate4: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    systemName: Joi.string().max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.empty': {
                    err.message = 'system_name_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'system_name_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
};

const currentOfferFields = {
    typeName: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'typeName_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    createdAt: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.requied':
                case 'string.max': {
                    err.message = 'intermediatePlate_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    openSystems: Joi.boolean().optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'open_systems_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    profileType: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'profile_type_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    fireResistance: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'fireResistance_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    moistureResistance: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'moistureResistance_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    soundInsulation: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'soundInsulation_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    protectionSense: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'soundInsulation_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    height: Joi.string().max(128).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.required':
                case 'string.empty': {
                    err.message = 'height_required';
                    break;
                }
                case 'string.max': {
                    err.message = 'height_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    support: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'support_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    finishing: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'finishing_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    interax: Joi.string().allow('').max(128).optional().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'string.max': {
                    err.message = 'interax_max';
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return new Error(errors);
    }),
    face1: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    },
    face2: {
        plate1: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate1_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate2: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate2_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate3: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.max': {
                        err.message = 'plate3_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
        plate4: Joi.string().allow('').max(128).optional().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'any.required':
                    case 'string.max': {
                        err.message = 'plate4_max';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return new Error(errors);
        }),
    }
};

module.exports = {
    phoneNumberPattern,
    datePattern,
    desc,
    asc,
    accountFields,
    dinosaurFields,
    offerFields,
    allowedPlates,
    currentOfferFields
};