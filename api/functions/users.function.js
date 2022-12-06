const databaseService = require('../../utils/databaseService/databaseService.js');
const utilityService = require('../../utils/utilityService.js');
const { desc } = require('../../utils/constants.js');
const { pick } = require('lodash');
const bcrypt = require('bcrypt');
const mailingTemplates = require("../../views/mailingTemplates.js");

/**
 * Hash the password before insertion
 * @param password String
 * @returns {Promise}
 */
const hashPassword = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((saltError, salt) => {
            if (saltError) {
                reject(new utilityService.createError(new Error(), saltError, global.HTTP_BAD_REQUEST, 'hashPassword'));
            }
            bcrypt.hash(password, salt, (hashError, hash) => {
                if (hashError) {
                    reject(new utilityService.createError(new Error(), hashError, global.HTTP_BAD_REQUEST, 'hashPassword'));
                }
                resolve(hash);
            });
        });
    });
};

/**
 * Get user account data from the database
 * @param language {String}
 * @returns {Promise}
 */
const getUser = (userId, language) => {
    let user;
    return new Promise((resolve, reject) => {
        return databaseService.getUserByField({ _id: utilityService.castToObjectId(userId) }, language)
            .then(res => {
                user = res;
                return databaseService.getImageByField({ _id: user.image.original}, language);
            })
            .then(image => {
                return resolve({
                    user: {
                        id: user._id,
                        image: image && image.url ? image.url : '',
                        activated: user.activated,
                        accountDisabled: user.accountDisabled,
                        language: user.language,
                        job: user.job,
                        address: user.address,
                        locality: user.locality,
                        company: user.company,
                        state: user.state,
                        emailAddress: user.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        createdOn: user.createdOn,
                        lastLogin: user.lastLogin,
                        isAdmin: user.isAdmin,
                        isMasterAdmin: user.isMasterAdmin,
                        functionalitiesAccess: user.functionalitiesAccess,
                        cities: user.cities,
                        state: user.state,
                    }
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Get all users from the database
 * @param language {String}
 * @returns {Promise}
 */
const getUsers = language => {
    return new Promise((resolve, reject) => {
        return databaseService.getUsersByField({}, { $sort: { lastLogin: desc } }, null, language)
            .then(users => {
                return resolve({
                    users: users.map(user => ({
                        id: user._id,
                        activated: user.activated,
                        accountDisabled: user.accountDisabled,
                        language: user.language,
                        emailAddress: user.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        createdOn: user.createdOn,
                        lastLogin: user.lastLogin,
                        logins: user.logins,
                        isAdmin: user.isAdmin,
                        isMasterAdmin: user.isMasterAdmin,
                        functionalitiesAccess: user.functionalitiesAccess,
                        cities: user.cities,
                        state: user.state,
                        job: user.job,
                        country: user.country,
                    }))
                })
            })
            .catch(err => reject(err));
    });
};

/**
 * Updates an user
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
 const updateUser = (req, data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUserByField({_id: utilityService.castToObjectId(data.id)}, language)
            .then(user => {
                if (!user) {
                    return reject(utilityService.parseCodeMessage('user_does_not_exist_update', language));
                } else {
                    let userProperties = [ 'state', 'job', 'country', 'id', 'activated', 'accountDisabled', 'language', 'emailAddress', 'firstName', 'lastName', 'phoneNumber', 'createdOn', 'lastLogin', 'isAdmin', 'isMasterAdmin', 'logins', "cities", "state", "functionalitiesAccess" ];
                    let updatedUser = pick(user, userProperties);
                    const {id, ...rest} = data;
                    updatedUser.id = user._id;
                    updatedUser[Object.keys(rest)[0]] = rest[Object.keys(rest)[0]];
                    if (user.activated === false && rest.activated === true) {
                        const { subject, html } = mailingTemplates.enableAccount(user, user.language);
                        utilityService.mailTo(req, user.emailAddress, subject, html);
                    } else if (user.activated === true && rest.activated === false) {
                        const { subject, html } = mailingTemplates.disableAccount(user, user.language);
                        utilityService.mailTo(req, user.emailAddress, subject, html);
                    }

                    let count = 0;

                    if (data.cities) {
                        data.cities.forEach(city => {
                            count += (city.selected === true ? 1 : 0)
                        })

                        user.cities.forEach(city => {
                            count -= (city.selected === true ? 1 : 0)
                        })

                        if (count !== 0) {
                            const { subject, html } = mailingTemplates.adminAddCounty(data, user.language);
                            utilityService.mailTo(req, user.emailAddress, subject, html);
                        }
                    }
                    
                    resolve(updatedUser);
                    return databaseService.updateUser({_id: user._id}, rest, language)
                        .then()
                        .catch(err => reject(err))
                }
            })
            .catch(err => reject(err));
    });
};

/**
 * Updates an user account details
 * @param req {Object}
 * @param data {Object}
 * @param language {String}
 * @returns {Promise}
 */
const updateUserAccount = (req, data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUserByField({ _id: utilityService.castToObjectId(data.id) }, language)
            .then(user => {
                if (!user) {
                    return reject(utilityService.parseCodeMessage('user_does_not_exist_update', language));
                } else {
                    return utilityService.upload('dinosaurImage', req, ['original'], 'image')
                        .then(uploadResults => {
                            let promises = [];

                            uploadResults.forEach(uploadedImage => {
                                const imageData = {
                                    url: uploadedImage.file,
                                    variant: uploadedImage.variant,
                                };
                                promises.push(databaseService.saveImage(imageData, language));
                            });

                            return Promise.all(promises)
                                .then(savedImages => {
                                    data = {
                                        ...data,
                                        image: {
                                            original: ( savedImages.find(image => image.variant === 'original') || {} )._id,
                                        }
                                    }

                                    return databaseService.updateUser({ _id: user._id }, data, language)
                                        .then(() => resolve(data))
                                        .catch(err => reject(err))
                                })
                            })
                        }
                            
            })
            .catch(err => reject(err));
    });
};

const updateUserPassword = (data, language) => {
    return new Promise((resolve, reject) => {
        return databaseService.getUserByField({ _id: utilityService.castToObjectId(data.userId) }, language)
            .then(user => {
                if (!user) {
                    return reject(utilityService.parseCodeMessage('user_not_found', language));
                }
                resolve(user);
                return hashPassword(data.password)
                    .then(hash => {
                        const { subject, html } = mailingTemplates.adminChangedPass(user.language);
                        utilityService.mailTo({ startTime: Date.now() }, user.emailAddress, subject, html);
                        return databaseService.updateUser({ _id: user._id }, { $set: { password: hash } }, language);
                    })
            })
            .catch(err => reject(err));
    });
};

module.exports = {
    getUser,
    getUsers,
    updateUser,
    updateUserAccount,
    updateUserPassword
};