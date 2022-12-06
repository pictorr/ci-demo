const databaseService = require('../utils/databaseService/databaseService.js');
const importService = require('./importService');

// sharp package disabled
// const sharp = require('sharp');
// sharp package disabled
const fs = require('fs-extra');
const multer = require('multer');
const uuid = require('uuid/v4');
const path = require('path');
const mkdirp = require('mkdirp-promise');
const mongoose = require('mongoose');
const texts = require('../locales/index.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const {
    NODE_ENV,
    JWT_SECRET,
    INTERNAL_API_KEY,
    HTTP_SUCCESS,
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
    BACKEND_LOCATION,
    FRONTEND_LOCATION,
    ENABLE_INTL,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DOCKER_PORT,
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_ACCESS_TOKEN,
    MAIL_FROM,
    UPLOADS_DESTINATION,
    UPLOADS_LOCATION,
    LOCAL_FILES_FOLDER,
    ROOT_PATH,
    APP,
    MAIL_DRIVER,
    MAIL_HOST,
    MAIL_USER,
    MAIL_PASS,
    MAIL_PORT,
    MAIL_SECURE,
    MAIL_ENCRYPTION,
    APP_SEND_EMAILS,
    APP_ADMIN_EMAIL,
    APP_ADMIN2_EMAIL,
    APP_ADMIN_EN_EMAIL,
    APP_ADMIN_GR_EMAIL,
    APP_ADMIN_PL_EMAIL,
    APP_EMAIL_SENDER_ADDRESS,
    APP_EMAIL_SENDER_TITLE,
} = process.env;

/**
 * Maps all process.env variables needed to global variables
 */
const autoImportEnvVariables = () => {
    global.NODE_ENV = NODE_ENV;
    global.JWT_SECRET = JWT_SECRET;
    global.INTERNAL_API_KEY = INTERNAL_API_KEY;
    global.HTTP_SUCCESS = HTTP_SUCCESS;
    global.HTTP_BAD_REQUEST = HTTP_BAD_REQUEST;
    global.HTTP_UNAUTHORIZED = HTTP_UNAUTHORIZED || 401;
    global.HTTP_NOT_FOUND = HTTP_NOT_FOUND;
    global.HTTP_INTERNAL_SERVER_ERROR = HTTP_INTERNAL_SERVER_ERROR;
    global.BACKEND_LOCATION = BACKEND_LOCATION;
    global.FRONTEND_LOCATION = FRONTEND_LOCATION;
    global.ENABLE_INTL = ENABLE_INTL;
    global.DB_HOST = DB_HOST;
    global.DB_NAME = DB_NAME;
    global.DB_PORT = DB_PORT;
    global.DOCKER_PORT = DOCKER_PORT;
    global.GMAIL_USER = GMAIL_USER;
    global.GMAIL_CLIENT_ID = GMAIL_CLIENT_ID;
    global.GMAIL_CLIENT_SECRET = GMAIL_CLIENT_SECRET;
    global.GMAIL_REFRESH_TOKEN = GMAIL_REFRESH_TOKEN;
    global.GMAIL_ACCESS_TOKEN = GMAIL_ACCESS_TOKEN;
    global.MAIL_FROM = MAIL_FROM;
    global.UPLOADS_DESTINATION = UPLOADS_DESTINATION;
    global.UPLOADS_LOCATION = UPLOADS_LOCATION;
    global.LOCAL_FILES_FOLDER = LOCAL_FILES_FOLDER;
    global.ROOT_PATH = ROOT_PATH;
    global.APP = APP || 'development';
    // smtp credentials
    global.MAIL_DRIVER = MAIL_DRIVER || 'smtp';
    global.MAIL_HOST = MAIL_HOST || 'smtp.ethereal.email';
    global.MAIL_USER = MAIL_USER || 'user@ethereal.email';
    global.MAIL_PASS = MAIL_PASS || 'pass';
    global.MAIL_PORT = MAIL_PORT || '587';
    global.MAIL_ENCRYPTION = MAIL_ENCRYPTION || 'STARTTLS';
    global.MAIL_SECURE = MAIL_SECURE || 'false'; 
    // mail settings
    global.APP_SEND_EMAILS = APP_SEND_EMAILS || false;
    global.APP_ADMIN_EMAIL = APP_ADMIN_EMAIL || 'admin@gdm.ro';
    global.APP_ADMIN2_EMAIL = APP_ADMIN2_EMAIL || 'admin@gdm.ro';
    global.APP_ADMIN_EN_EMAIL = APP_ADMIN_EN_EMAIL || 'admin@gdm.ro';
    global.APP_ADMIN_GR_EMAIL = APP_ADMIN_GR_EMAIL || 'admin@gdm.ro';
    global.APP_ADMIN_PL_EMAIL = APP_ADMIN_PL_EMAIL || 'admin@gdm.ro';
    global.APP_EMAIL_SENDER_ADDRESS = APP_EMAIL_SENDER_ADDRESS || 'noreply@gdm.ro';
    global.APP_EMAIL_SENDER_TITLE = APP_EMAIL_SENDER_TITLE || 'Siniat DEV';
};

const unhandledError = {
    en: 'An unexpected error has occurred.',
};
const unhandledErrorMessage = {
    en: 'Something went wrong...'
};

// ---------Messages, Errors and Logging---------

/**
 * Send standard errors
 * @param errObject default value 'An unexpected error has occurred'
 * @param message default value 'Unknown Error'
 * @param httpCode default 500
 * @param thrower default internal-module ( unspecified module )
 * @param language {String}
 * @constructor
 */
const createError = function (
    errObject,
    message,
    httpCode = HTTP_INTERNAL_SERVER_ERROR,
    thrower = 'internal-module',
    language = 'en') {
    if (!(errObject instanceof Error)) {
        errObject = new Error(unhandledError[language] || unhandledError.en);
    }
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.stack = (errObject).stack;
    this.thrower = thrower;
    this.message = message || unhandledErrorMessage[language] || unhandledErrorMessage.en;
    this.httpCode = httpCode;
};

/**
 * Log error and respond
 * @param req request parameter
 * @param res response parameter
 * @param err error that has occurred
 */
const logResponse = (req, res, err) => {
    const httpCode = err ? (err.httpCode > 100 && err.httpCode < 999 ? parseInt(err.httpCode) : 400) : 400;
    let statusCode = Number.isInteger(httpCode) ? httpCode : HTTP_INTERNAL_SERVER_ERROR;
    if (!(err instanceof Object) || !err.httpCode) {
        err = new createError(err);
    }
    const mes = getMessage(err);
    global.errorLogger.error({
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        email: req.decoded && req.decoded.email || 'no-email',
        clientIp: req.clientIp,
        method: req.method,
        status: statusCode
    });
    if (res) {
        return res.status(statusCode).jsonp({error: mes.message});
    }
};

/**
 * Set error message
 * @param errObject
 */
const getMessage = errObject => {
    let message = {};
    message['data'] = errObject.stack;
    message['message'] = errObject.message;
    message['code'] = errObject.httpCode;
    message['thrower'] = errObject.thrower;
    if (errObject.extra) {
        message['extra'] = errObject.extra;
    }

    return message;
};

// -------------------------------------------

// ------------JWT Signing-------------

/**
 * Generates a JWT
 * @param user {Object} - The user object as it is in your database
 * @param expire {Object} - Options for expire
 * @returns {Promise}
 */
const generateToken = (user, expire = {}) => {
    return new Promise((resolve, reject) => {
        const metadata = {
            id: user._id,
            emailAddress: user.emailAddress,
            isAdmin: user.isAdmin,
            isMasterAdmin: user.isMasterAdmin,
            language: user.language,
            country: user.country
        };
        return jwt.sign(metadata, JWT_SECRET, expire, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })
    })
};

// -------------------------------------------

// ------------Image Manipulation-------------

/**
 * {property} withoutEnlargement - prevents the image from being stretched
 */
const globalDimensions = {
    dinosaurImage: {
        defaultOptions: {
            withoutEnlargement: true,
            fastShrinkOnLoad: true,
            fit: 'cover',
            position: 'centre',
            background: '#00000000'
        },
        dimensions: [{
            name: 'small',
            width: 160,
            height: 160
        }, {
            name: 'thin',
            width: 320,
            height: 320
        }, {
            name: 'original',
            width: 640,
            height: 640
        }]
    }
};

/**
 * Upload files after validation
 * @param type {String}
 * @param req {Object}
 * @param variantsToSave {Array} - [ 'original', 'thin', 'small' ]
 * @param key {String} - Key for the uploaded files
 * @returns {*}
 */
const upload = (type, req, variantsToSave = ['small'], key) => {
    let fileSizeError = false;

    return new Promise((resolve, reject) => {
        // If there are no files to upload, return an empty array
        if (!req.files || !(req.files || {})[key] || !((req.files || {})[key] || []).length) {
            return resolve([]);
        }

        let uploadedFiles = [];
        let promises = [];
        req.files[key].forEach((file, i) => {
            // Check fileSize limits
            if ((checkFormat(file.originalname, 'document') && !validateFileSizes(file.size, 'document'))
                || (checkFormat(file.originalname, 'video') && !validateFileSizes(file.size, 'video'))
                || (checkFormat(file.originalname, 'image') && !validateFileSizes(file.size, 'image'))
            ) {
                fileSizeError = true;
            }
            if (!fileSizeError) {// File name
                const name = uuid().toUpperCase() + uuid().toUpperCase() + uuid().toUpperCase();
                const extension = getFileExtension(file.originalname);
                let filename = '';
                let location = '';
                let localFile = '';
                let uploadedFilesInformation = [];
                // Upload file locally on the Machine/Pod and resize it
                promises.push(
                    new Promise(rs => {
                        return mkdirp(global.LOCAL_FILES_FOLDER)
                            .then(() => {
                                filename = name + extension;
                                location = `${ global.UPLOADS_DESTINATION }/${ filename }`;
                                localFile = `${ global.UPLOADS_LOCATION }/${ filename }`;

                                if (checkFormat(file.originalname, 'document') || checkFormat(file.originalname, 'video')) {
                                    uploadedFilesInformation.push({
                                        filename: filename,
                                        location: location,
                                        name: name,
                                        extension: extension,
                                        localFile: localFile,
                                        fileType: getFileType(filename),
                                        variant: 'original',
                                        size: file.size
                                    });
                                    return uploadFileOnPod(file, filename);
                                } else {
                                    uploadedFilesInformation.push({
                                        filename: filename,
                                        location: location,
                                        name: name,
                                        extension: extension,
                                        localFile: localFile,
                                        fileType: getFileType(filename),
                                        variant: 'original',
                                        size: file.size
                                    });
                                    return uploadFileOnPod(file, filename);
                                    // sharp package disabled
                                    // let promises = [];
                                    // variantsToSave.forEach(variant => {
                                    //     const foundDimension = globalDimensions[type].dimensions.find(dimension => dimension.name === variant);
                                    //     promises.push(resizeImageWithOptions(file, {
                                    //         ...globalDimensions[type].defaultOptions,
                                    //         width: foundDimension.width,
                                    //         height: foundDimension.height
                                    //     }, `${ global.UPLOADS_DESTINATION }/${ name + `-${ variant }` + extension }`)
                                    //         .then(results => {
                                    //             uploadedFilesInformation.push({
                                    //                 filename: name + `-${ variant }` + extension,
                                    //                 location: `${ global.UPLOADS_DESTINATION }/${ name + `-${ variant }` + extension }`,
                                    //                 name: name,
                                    //                 extension: extension,
                                    //                 localFile: `${ global.UPLOADS_LOCATION }/${ name + `-${ variant }` + extension }`,
                                    //                 variant: variant,
                                    //                 fileType: getFileType(name + `-${ variant }` + extension),
                                    //                 width: results.width,
                                    //                 height: results.height,
                                    //                 size: results.size
                                    //             });
                                    //         }));
                                    // });
                                    // return Promise.all(promises);
                                    // sharp package disabled
                                }
                            })
                            .then(() => {
                                uploadedFilesInformation.forEach(f => {
                                    uploadedFiles.push({
                                        file: f.localFile,
                                        filenameWithoutExtension: f.name,
                                        variant: f.variant,
                                        order: i,
                                        fileType: f.fileType,
                                        width: f.width,
                                        height: f.height,
                                        size: f.size
                                    });
                                });
                                rs();
                            })
                            .catch(err => rs(err));
                    })
                );
            }

        });
        if (fileSizeError) {
            return reject(parseCodeMessage('file_size_exceeded'));
        }

        Promise.all(promises)
            .then(response => {
                if (response.find(error => error)) {
                    // Generally, those are internal errors
                    uploadedFiles.forEach(file => deleteUpload(type, file.filename));
                    return reject(parseCodeMessage('failed_to_upload'));
                } else {
                    resolve(uploadedFiles);
                }
            });
    });
};

/**
 * Get url from the Google Storage
 * @param type {String}
 * @param filename {String}
 * @returns {String}
 */
const getUploadUrl = (type, filename) => {
    return `https://storage.googleapis.com/${ global.GCP_BUCKET_PROFILE_IMAGES }/${ filename }`;
};

/**
 * Save a file locally
 * @param file {Object}
 * @param filename {String}
 * @returns {Promise<unknown>}
 */
const uploadFileOnPod = (file, filename) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${ global.LOCAL_FILES_FOLDER }/${ filename }`, file.buffer, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

/**
 * Delete a file from GCS or local folder
 * @param type {String}
 * @param filename {String}
 */
const deleteUpload = (type, filename) => {
    let bucket = '';
    return new Promise((resolve, reject) => {
        if (global.NODE_ENV === 'development') {
            try {
                fs.unlink(`${ global.LOCAL_FILES_FOLDER }/${ filename }`, err => {
                    if (err) {
                        reject(new createError(new Error(err), 'An error has occurred while deleting an image', global.HTTP_BAD_REQUEST, 'utility-service'));
                    }
                    resolve();
                });
            } catch {
                reject(new createError(new Error('An error has occurred while deleting an image'), 'An error has occurred while deleting an image', global.HTTP_BAD_REQUEST, 'utility-service'));
            }
        } else {
            const blob = bucket.file(filename);
            blob.delete()
                .then(() => resolve())
                .catch(err => reject(new createError(new Error(err), 'An error has occurred while deleting an image', global.HTTP_BAD_REQUEST, 'utility-service')));
        }
    });
};

/**
 * Multer uploader middleware
 */
const uploader = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!checkFormat(file.originalname, 'image') && !checkFormat(file.originalname, 'document') && !checkFormat(file.originalname, 'video')) {
            return cb(new Error('This format is not accepted'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 24 * 1024 * 1024
    }
});

/**
 *
 * @param filename {String}
 * @param desiredFormat {String} - One of image/ document/ video
 * @returns {Boolean}
 */
const checkFormat = (filename, desiredFormat) => {
    let extension = path.extname(filename);
    if (desiredFormat === 'image') {
        return (extension === '.png' || extension === '.jpg' || extension === '.gif' || extension === '.jpeg');
    }
    if (desiredFormat === 'document') {
        return extension === '.pdf' || extension === '.xlsx' || extension === '.xls';
    }
    if (desiredFormat === 'video') {
        return extension === '.mov' || extension === '.3gp' || extension === '.mp4' || extension === '.webm' || extension === '.m4v';
    }
};

/**
 * Returns the file type
 * @param filename {String}
 * @returns {String}
 */
const getFileType = filename => {
    let extension = path.extname(filename);
    if (extension === '.png' || extension === '.jpg' || extension === '.gif' || extension === '.jpeg') {
        return 'image';
    } else if (extension === '.pdf') {
        return 'document';
    } else if (extension === '.mov' || extension === '.3gp' || extension === '.mp4' || extension === '.webm' || extension === '.m4v') {
        return 'video';
    }
};

/**
 * Checks if a file has a bigger size than the maximum allowed
 * 5 MB for Images
 * 10 MB for Documents
 * 200 MB for Video
 * @param size {Number}
 * @param format {String}
 * @returns {Boolean}
 */
const validateFileSizes = (size, format) => {
    if (format === 'image') {
        return size < 20 * 1024 * 1024;
    } else if (format === 'document') {
        return size < 30 * 1024 * 1024;
    } else if (format === 'video') {
        return size < 200 * 1024 * 1024;
    }
};

/**
 *
 * @param file {File} after it has been uploaded
 * @param width {Number} or {String} -> 'auto', number or null -- Width and Height can't be both 'auto'
 * @param height {Number} or {String} -> 'auto', number or null -- Width and Height can't be both 'auto'
 * @param fit {String}
 * @param customSavePath {String}
 * @returns {Promise}
 */
// sharp package disabled
// const resizeImage = (file, width, height, fit, customSavePath) => {
//     return new Promise((resolve, reject) => {
//         sharp(file)
//             .resize(height ? {width: width, height: height, fit: fit} : {width: width, fit: fit})
//             .withMetadata()
//             .toFile(customSavePath, err => {
//                 if (err) {
//                     reject(new createError(new Error(err), 'An error has occurred while resizing your image', HTTP_INTERNAL_SERVER_ERROR, 'utility-service'));
//                 }
//                 resolve();
//             });
//     });
// };
// sharp package disabled

/**
 * Resize images using only the options object
 * @param file {File}
 * @param options {Object} - http://sharp.pixelplumbing.com/en/stable/api-resize/ **Parameters section**
 * @param customSavePath {String}
 * @returns {Promise}
 */
// sharp package disabled
// const resizeImageWithOptions = (file, options, customSavePath = global.LOCAL_FILES_FOLDER) => {
//     return new Promise((resolve, reject) => {
//         sharp(file.buffer)
//             .resize(null, null, options)
//             .withMetadata()
//             .toFile(customSavePath, (err, info) => {
//                 if (err) {
//                     reject(new createError(new Error(err), 'An error has occurred while resizing your image', HTTP_INTERNAL_SERVER_ERROR, 'utility-service'));
//                 }
//                 resolve(info);
//             });
//     });
// };
// sharp package disabled

/**
 * Used only for when deleting a file from a Pod in production or from the uploads folder in development
 * @param fileUrl {String}
 * @returns {Promise}
 */
const deleteFileOnPod = fileUrl => {
    return new Promise((resolve, reject) => {
        try {
            fs.unlink(`.${ fileUrl }`, err => {
                if (err) {
                    console.log(err);
                    reject(new createError(new Error(err), err, global.HTTP_BAD_REQUEST, 'utility-service'));
                }
                resolve();
            });
        } catch (err) {
            reject(new createError(new Error(err), err, global.HTTP_BAD_REQUEST, 'utility-service'));
        }

    });
};

/**
 * Delete a local file
 * @param imagePath {String}
 */
const deleteImage = imagePath => {
    return new Promise(resolve => {
        try {
            fs.unlink(imagePath, err => {
                if (err) {
                    resolve(new createError(new Error(err), 'An error has occurred while deleting an image', global.HTTP_BAD_REQUEST, 'utility-service'));
                }
                resolve();
            });
        } catch {
            resolve(new createError(new Error('An error has occurred while deleting an image'), 'An error has occurred while deleting an image', global.HTTP_BAD_REQUEST, 'utility-service'));
        }
    });
};

/**
 * Get extension out of a filename
 * @param originalName
 * @returns {string}
 */
const getFileExtension = originalName => {
    if (!originalName) {
        return '';
    }
    const split = originalName.split('.');
    return `.${ split[split.length - 1] }`;
};

/**
 * Sort an array - you must assign this to a value, it does not mutate!
 * @param array {Array}
 * @param order {String} - can be lowercase or uppercase, it will automatically be transformed here into uppercase
 * @param nestedName {String} - if you want to compare a property from an object - only works with level 1 nesting
 * @param isDate {Boolean}
 * @param secondaryNestedName {String} A secondary sort field
 * @returns {Array}
 */
const sortArray = (array, order, nestedName, isDate, secondaryNestedName) => {
    let varType, secondaryType;
    switch (order.toUpperCase()) {
        case 'ASC': {
            if (nestedName) {
                varType = typeof ((array || {})[0] || {})[nestedName];
                secondaryType = typeof ((array || {})[0] || {})[secondaryNestedName] || null;
                if (isDate) {
                    return array.sort((a, b) => new Date(b[nestedName]) - new Date(a[nestedName]));
                } else if (varType === 'string') {
                    return secondaryNestedName ?
                        array.sort((a, b) => (a[nestedName] || '').toLowerCase() - (b[nestedName] || '').toLowerCase() || (secondaryType === 'string' ? (a[secondaryNestedName] || '').toLowerCase() - (b[secondaryNestedName] || '').toLowerCase() : a[secondaryNestedName] - b[secondaryNestedName])) :
                        array.sort((a, b) => (a[nestedName] || '').toLowerCase() > (b[nestedName] || '').toLowerCase() ? 1 : -1);
                } else {
                    return secondaryNestedName ?
                        array.sort((a, b) => a[nestedName] - b[nestedName] || a[secondaryNestedName] - b[secondaryNestedName]) :
                        array.sort((a, b) => a[nestedName] > b[nestedName] ? 1 : -1);
                }
            } else {
                varType = typeof (array || {})[0];
                if (isDate) {
                    return array.sort((a, b) => new Date(b) - new Date(a));
                } else if (varType === 'string') {
                    return array.sort((a, b) => (a || '').toLowerCase() > (b || '').toLowerCase() ? 1 : -1);
                } else {
                    return array.sort((a, b) => a > b ? 1 : -1);
                }
            }
        }
        case 'DESC': {
            if (nestedName) {
                varType = typeof ((array || {})[0] || {})[nestedName];
                if (isDate) {
                    return array.sort((a, b) => new Date(a[nestedName]) - new Date(b[nestedName]));
                } else if (varType === 'string') {
                    return secondaryNestedName ?
                        array.sort((a, b) => (b[nestedName] || '').toLowerCase() - (a[nestedName] || '').toLowerCase() || (secondaryType === 'string' ? (b[secondaryNestedName] || '').toLowerCase() - (a[secondaryNestedName] || '').toLowerCase() : b[secondaryNestedName] - a[secondaryNestedName])) :
                        array.sort((a, b) => (a[nestedName] || '').toLowerCase() > (b[nestedName] || '').toLowerCase() ? -1 : 1);
                } else {
                    return secondaryNestedName ?
                        array.sort((a, b) => b[nestedName] - a[nestedName] || b[secondaryNestedName] - a[secondaryNestedName]) :
                        array.sort((a, b) => a[nestedName] > b[nestedName] ? -1 : 1);
                }
            } else {
                varType = typeof (array || {})[0];
                if (isDate) {
                    return array.sort((a, b) => new Date(a) - new Date(b));
                } else if (varType === 'string') {
                    return array.sort((a, b) => (a || '').toLowerCase() > (b || '').toLowerCase() ? -1 : 1);
                } else {
                    return array.sort((a, b) => a > b ? -1 : 1);
                }
            }
        }
        default:
            return array;
    }
};

/**
 * Parse of WordPress ??? error codes or other messages
 * @param err {Object}
 * @param language {String}
 * @param internalError {Object} - used for internal errors such as database operations
 * @returns {createError}
 */
const parseCodeMessage = (err, language = 'ro', internalError = null) => {
    let error, status;
    if (err && err.response && err.response.data && err.response.data.code) {
        // WordPress REST API error ??? WORDPRESS ???
        switch (err.response.data.code) {
            case 'bad_request': {
                if (
                    err.response.data.message === 'You must request a password reset code before you try to set a new password.'
                    || err.response.data.message.indexOf('The reset code provided is not valid.') !== -1
                ) {
                    error = language === 'en' ? texts.en['bad_request_reset_password'] : texts.ar['bad_request_reset_password'];
                }
                break;
            }
            default: {
                error = getTextBasedOnLanguage(err.response.data.code, language, true, err);
                break;
            }
        }
        if (((err.response.data || {}).data || {}).status) {
            status = err.response.data.data.status;
        }
    } else if (err && typeof err === 'string') {
        error = getTextBasedOnLanguage(err, language);
        status = 400;
    } else {
        console.warn('Network error:', err.response.data);
        if (language === 'en') {
            error = 'There was an issue communicating with the server...';
        } else {
            error = 'ARABIC: There was an issue communicating with the server...';
        }
        if (((err.response.data || {}).data || {}).status) {
            status = err.response.data.data.status;
        }
    }
    if (internalError) {
        console.log('An internal error has occurred. Please address it:', internalError);
    }
    return new createError(new Error(((err.response || {}).data ? JSON.stringify((err.response || {}).data) : err)), error, status || HTTP_BAD_REQUEST, 'utility-service');
};

/**
 * Returns the text based on language
 * @param code {String}
 * @param language {String}
 * @param wordPress {Boolean}
 * @param err {Object}
 * @returns {String}
 */
const getTextBasedOnLanguage = (code, language = 'ro', wordPress = false, err = null) => {
    let text;
    if (language === 'en') {
        text = texts.en[code];
    } else if (language === 'cr') {
        text = texts.cr[code];
    } else if (language === 'gr') {
        text = texts.gr[code];
    } else if (language === 'pl') {
        text = texts.pl[code];
    } else {
        text = texts.ro[code];
    }

    if (text) {
        return text;
    }
    console.warn('Unhandled error code:', code);

    text = 'A aparut o problema la procesarea solicitarii dvs. Va rugam sa contactati suportul in cazul in care eroarea persista.';
    return text;
};

/**
 * Casts a string to objectId
 * @param string {String}
 * @returns {*}
 */
const castToObjectId = string => mongoose.Types.ObjectId(string);

/**
 * Upload a media file to WP
 * @param file {Object}
 * @returns {Promise}
 */
const uploadMediaToWP = file => {
    return new Promise((resolve, reject) => {
        global.WP_API.media()
            .setHeaders({
                Authorization: `Bearer ${ global.SERVICE_ACCOUNT_TOKEN }`,
            })
            .file(file.path)
            .create({
                title: file.filename,
            })
            .then(response => {
                resolve({
                    uploadedFile: response
                });
            })
            .catch(err => reject(err));
    });
};

// -------------------------------------------

// Mailing

// transporter gmail
// let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         type: 'OAuth2',
//         user: GMAIL_USER,
//         clientId: GMAIL_CLIENT_ID,
//         clientSecret: GMAIL_CLIENT_SECRET,
//         refreshToken: GMAIL_REFRESH_TOKEN,
//         accessToken: GMAIL_ACCESS_TOKEN,
//         expires: 3590
//     }
// });

// transporter
let transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE === 'true' ? true : false,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

transporter.verify(error => {
    if (error) {
        console.log('Failed to connect to mail server');
    } else {
        console.log('Ready to send mail');
    }
});

const getTransporter = () => {
    return new Promise(resolve => {
        resolve(transporter);
    });
};

const defaultFrom = MAIL_FROM;

/**
 * Send a mail
 * @param req {Object}
 * @param to {String}
 * @param subject {String}
 * @param html {String}
 * @param from {String}
 */
const mailTo = (req, to, subject, html, from = defaultFrom) => {
    const options = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };

    if (APP_SEND_EMAILS === 'true') {
        getTransporter().then(transporter => {
            return transporter.sendMail(options, err => {
                if (err) {
                    console.log(`There has been an error while mailing to: ${to}. Response error: ${err.response}`);
                    // logResponse(null, `There has been an error while mailing ${ to }: ${ JSON.stringify(err) }`);
                } else {
                    console.log(req.startTime, `Mail sent to ${ to }`);
                }
            })
        })
    }
};

// -------------------------------------------

/**
 * Transforms in dev a link like /uploads/filename.jpg to localhost:__SERVICE-PORT__/uploads/filename.jpg
 * This function assumes that in production you use an external storage for images. If not, just return `${ global.BACKEND_LOCATION }${ imageUrl }`
 * @param imageUrl {String}
 * @returns {String}
 */
const transformImageUrlToAccessibleUrl = imageUrl => {
    if (!imageUrl) {
        return '';
    }

    return global.NODE_ENV === 'development' && imageUrl.indexOf('http') === -1 ? `${ global.BACKEND_LOCATION }${ imageUrl }` : imageUrl;
};

/**
 * Compares two ids
 * @param first {*}
 * @param second {*}
 * @returns {Boolean}
 */
const compareIds = (first, second) => (first || '').toString() === (second || '').toString();


/**
 * Import Excel
 */

/**
 * Extract data from excell
 * @param {excell data} table
 */

const extractData = table => {

    let data = [];
    let codSistem = 0;
    table.data.forEach((row, index) => {
        let face1 = [];
        let face2 = [];
        let type1;
        let type2;
        // console.log(row)
        if (index === 1) {
            if (row[28] === 'cod sistem') {
                codSistem = 28
            } else {
                if (row[29] === 'cod sistem') {
                    codSistem = 29
                } else {
                    codSistem = 30;
                }
            }
        }


        if (table.name.trim() === 'sisteme pereti triplu') {
            type1 = [3, 5, 7];
            type2 = [11, 13, 15];
        } else if (table.name.trim() === 'sisteme pereti dublu') {
            type1 = [5, 7];
            type2 = [11, 13];
        } else {
            type1 = [7];
            type2 = [11];
        }
        type1.forEach(index => {
            if (row[index]) {
                face1.push(row[index])
            }
        });

        type2.forEach(index => {
            if (row[index]) {
                face2.push(row[index])
            }
        });

        if (row[26]) {
            data.push({
                thicknessSystem: row[2],
                plates: [{face1, face2}],
                profileType: row[9],
                interax: row[16].toString(),
                hMin: row[17],
                hMax: row[18],
                support: row[19] === 1 ? 'tabla' : 'beton',
                fireResistance: row[20],
                soundInsulation: row[21],
                valueSoundInsulation: row[22],
                moistureResistance: row[23],
                burglaryResistance: row[24],
                auxilary: row[25],
                codSap1: table.name.trim() !== 'sisteme pereti dublu' && table.name.trim() !== 'sisteme pereti triplu' ? row[codSistem - 2] : row[codSistem - 3],
                codSap2: table.name.trim() !== 'sisteme pereti dublu' && table.name.trim() !== 'sisteme pereti triplu' ? row[codSistem - 1] : row[codSistem - 2],
                codSap3: table.name.trim() !== 'sisteme pereti dublu' && table.name.trim() !== 'sisteme pereti triplu' ? '' : row[codSistem - 1],
                systemCode: row[codSistem],
                systemAccess: row[codSistem + 1]
            })
        }
    });

    return data;
}

/**
 * Extract data from excell
 * @param {excell data} table
 */

const extractDataPlacari = table => {

    let data = [];
    table.data.forEach((row, index) => {

        let type = [], plates = [];

        if (table.name.trim() === 'sisteme placari qvadruple') {
            type = [5, 7, 9, 11];
        }

        if (table.name.trim() === 'sisteme placari triple') {
            type = [5, 7, 9];
        }

        if (table.name.trim() === 'sisteme placari duble' || table.name.trim() === 'sisteme placari smart duble') {
            type = [5, 7];
        }

        if (table.name.trim() === 'sisteme placari simple'  || table.name.trim() === 'sisteme placari smart simple') {
            type = [5];
        }

        if (table.name.trim() === 'sisteme placari lipire') {
            type = [5];
        }

        type.forEach(index => {
            if (row[index]) {
                plates.push(row[index])
            }
        });

        if (row[22]) {
            data.push({
                thicknessSystem: row[2],
                plates: [{platesName: plates}],
                profileType: row[3],
                interax: row[12],
                interaxSustineri: row[13],
                hMin: parseFloat(row[14]),
                hMax: parseFloat(row[15]),
                support: row[16],
                fireResistance: row[17],
                soundInsulation: row[18],
                valueSoundInsulation: row[19],
                moistureResistance: row[20],
                auxilary: row[21],
                codSap1: row[23],
                codSap2: row[24],
                codSap3: row[25],
                codSap4: row[26],
                systemCode: row[27],
                systemAccess: row[28]
            })
        }
    });

    return data;
}

/**
 * Extract data from excell
 * @param {excell data} table
 */

const extractDubleStructureData = table => {

    let data = [];
    table.data.forEach((row, index) => {
        let face1 = [];
        let face2 = [];
        let type1;
        let type2;

        if (table.name.trim() === 'sisteme Noisy triple') {
            type1 = [6, 8, 10];
            type2 = [15, 17, 19];
        } else if (table.name.trim() === 'sisteme Noisy duble') {
            type1 = [6, 8];
            type2 = [15, 17];
        }

        type1.forEach(index => {
            if (row[index]) {
                face1.push(row[index])
            }
        });

        type2.forEach(index => {
            if (row[index]) {
                face2.push(row[index])
            }
        });

        if (row[29]) {
            data.push({
                plates: [{face1, face2}],
                distancePlates: row[11],
                thicknessSystem: row[2],
                profileType: row[3] + '/' + row[12],
                profileType1: row[3],
                profileType2: row[12],
                interax: row[4] + '/' + row[13],
                interax1: row[4],
                interax2: row[13],
                distance: row[11],
                interaxSustineri: row[20],
                hMin: row[21],
                hMax: row[22],
                support: row[23],
                fireResistance: row[24],
                soundInsulation: row[25],
                valueSoundInsulation: row[26],
                moistureResistance: row[27],
                auxilary: row[28],
                codSap1: row[30],
                codSap2: row[31],
                codSap3: row[32],
                codSap4: row[33],
                systemCode: row[34],
                systemAccess: row[35]
            })
        }
    });

    return data;
}


/**
 * Extract data from excell - Special Walls
 * @param {excell data} table
 */

const extractSpecialWalls = table => {

    let data = [];
    if (table.name.trim().includes('inte') === false) {
        table.data.forEach((row, index) => {
            let face1 = [];
            let face2 = [];
            let type1;
            let type2;

            if (table.name.trim() === 'sisteme S triplu' || table.name.trim() === 'sisteme S asimetric' ) {
                type1 = [4, 6, 8];
                type2 = [16, 18, 20];
            } else if (table.name.trim() === 'sisteme S dublu') {
                type1 = [6, 8];
                type2 = [16, 18];
            } else {
                type1 = [8];
                type2 = [16];
            }

            type1.forEach(index => {
                if (row[index]) {
                    face1.push(row[index])
                }
            });

            type2.forEach(index => {
                if (row[index]) {
                    face2.push(row[index])
                }
            });

            if (row[30]) {
                data.push({
                    plates: [{face1, face2}],
                    distancePlates: row[11],
                    thicknessSystem: row[2],
                    profileType: row[9] + '/',
                    profileType1: row[9],
                    profileType2: row[13],
                    interax: row[10] + '/',
                    interax1: row[10],
                    interax2: row[14],
                    distance: row[11],
                    structureLink: row[12],
                    hMin: row[21],
                    hMax: row[22],
                    support: row[23],
                    fireResistance: row[24],
                    soundInsulation: row[25],
                    valueSoundInsulation: row[26],
                    moistureResistance: row[27],
                    burglaryResistance: row[28],
                    auxilary: row[29],
                    codSap1: row[31],
                    codSap2: row[32],
                    codSap3: row[33],
                    codSap4: row[34],
                    systemCode: row[35],
                    systemAccess: row[36]
                })
            }
        });
    }
    else {

        table.data.forEach((row, index) => {
            let face1 = [];
            let face2 = [];
            let type1;
            let type2;

            if (table.name.trim() === 'sisteme S triplu intermediar') {
                type1 = [4, 6, 8];
                type2 = [18, 20, 22];
            } else if (table.name.trim() === 'sisteme S dublu intermediar') {
                type1 = [6, 8];
                type2 = [18, 20];
            }

            type1.forEach(index => {
                if (row[index]) {
                    face1.push(row[index])
                }
            });

            type2.forEach(index => {
                if (row[index]) {
                    face2.push(row[index])
                }
            });

            if (row[32]) {
                data.push({
                    plates: [{face1, face2}],
                    intermediatePlate: row[12],
                    distancePlates: row[11],
                    thicknessSystem: row[2],
                    profileType: row[9] + '/',
                    profileType1: row[9],
                    profileType2: row[15],
                    interax: row[10] + '/',
                    interax1: row[10],
                    interax2: row[16],
                    distance: row[13],
                    structureLink: row[14],
                    hMin: row[23],
                    hMax: row[24],
                    support: row[25],
                    fireResistance: row[26],
                    soundInsulation: row[27],
                    valueSoundInsulation: row[28],
                    moistureResistance: row[29],
                    burglaryResistance: row[30],
                    auxilary: row[31],
                    codSap1: row[33],
                    codSap2: row[34],
                    codSap3: row[35],
                    codSap4: row[36],
                    systemCode: row[37],
                    systemAccess: row[38],
                })
            }
        });
    }

    return data;
}

/**
 * Import Excel
 */

/**
 * Extract data from excell
 * @param {excell data} table
 */

const extractDataCeiling = table => {
    let data = [];
    table.data.forEach((row, index) => {
        let face1 = [];
        let face2 = [];
        let type1;
        let type2;

        if (table.name.trim() === 'sisteme plafoane qvdruplu') {
            type1 = [4, 6];
            type2 = [13, 15, 17, 19];
        } else if (table.name.trim() === 'sisteme plafoane triplu') {
            type1 = [4, 6]
            type2 = [13, 15, 17];
        } else if (table.name.trim() === 'sisteme plafoane dublu') {
            type1 = [4, 6]
            type2 = [13, 15];
        } else {
            type1 = [4, 6]
            type2 = [13];
        }

        type1.forEach(index => {
            if (row[index]) {
                face1.push(row[index])
            }
        });

        type2.forEach(index => {
            if (row[index]) {
                face2.push(row[index])
            }
        });

        if (row[32]) {
            data.push({
                thicknessSystem: row[2],
                primaryStructure: row[7],
                secondaryStructure: row[9],
                primaryInterax: row[8],
                secondaryInterax: row[10],
                structureType: row[11],
                plates: [{face1, face2}],
                profileType: row[7] !== undefined && row[9] !== undefined ? row[7] + '/' + row[9] : row[7] !== undefined ? row[7] + '/-' : '-/' + row[9],
                interax: row[8] !== undefined && row[10] !== undefined ? row[8] + '/' + row[10] : row[8] !== undefined ? row[8] + '/-' : '-/' + row[10],
                basePlate: row[20],
                support: row[21],
                ceilingType: row[21] > 1 ? 1 : 0,
                valueHoldingInterax: row[22],
                hMin: row[24] || 0,
                hMax: row[23] || row[25] || 0,
                protectionSense: row[26],
                fireResistance: row[27],
                soundInsulation: row[28],
                valueSoundInsulation: row[29],
                moistureResistance: row[30],
                auxilary: row[31],
                codSap1: row[33],
                codSap2: row[34],
                codSap3: row[35],
                codSap4: row[36],
                systemCode: row[37],
                systemAccess: row[38]
            })
        }
    });

    return data;
}

/**
 * Extract data from spreadsheet
 *
 * @param table
 * @returns {*[]}
 */
const extractDataConsumptions = table => {
    // added one row
    // easier to follow spreadsheet
    let rows = table;
    rows.unshift([' ']);

    // get filled rows (distinct products - cod SAP and price)
    let filledRows = [];
    let rowUpperGrip = 2;
    let rowExternalProd = 2;
    for (let index = 2; index < rows.length; index++) {
        if (rows[index][0] && rows[index][1]) {
            filledRows.push(index);
        }
        if (rows[index][0] && rows[index][0].toString().includes('Prindere partea superioara')) {
            rowUpperGrip = index;
        }
        if (rows[index][0] && rows[index][0].toString().includes('Produse externe')) {
            rowExternalProd = index;
        }
    }

    // get consumptions conditions array
    let consumptionsConditionsArray = getConsumptionsConditions(filledRows, rows, rowUpperGrip, rowExternalProd);

    // add function syntax around the array
    consumptionsConditionsArray.unshift("return [].concat(");
    consumptionsConditionsArray.unshift("export function tripluConsumuri(vata, profileType, interax, placa, fireResistance, H, rezUmid, suport, grosimePlaca, finishing, consumptionType) {");
    consumptionsConditionsArray.push(")");
    consumptionsConditionsArray.push("}");

    return consumptionsConditionsArray;
}

/**
 * build array of conditions for the consumptions
 *
 * @param filledRows
 * @param rows
 * @param rowUpperGrip
 * @param rowExternalProd
 * @returns {[]}
 */
const getConsumptionsConditions = (filledRows, rows, rowUpperGrip, rowExternalProd) => {
    let arr = [];

    filledRows.forEach((value, index, filledRows) => {
        // fix last row
        let loopEndValue = filledRows[index + 1];
        if (value === rows.length - 1) {
            loopEndValue = rows.length;
        }

        for (let index = value; index < loopEndValue; index++) {
            // 	skip rows before "Prindere superioara" and "Produse externe"
            // filledRows = [7, 10, 16, ...]
            // value = 7 => index = [7, 8, 9]
            // index = [8, 9] && 9 = "Prindere..." => continue
            if (index !== value && rows[loopEndValue - 1][0] && (rows[loopEndValue - 1][0] !== rowUpperGrip || rows[loopEndValue - 1][0] !== rowExternalProd)) {
                continue;
            }

            // consumptions
            let consumptions = '[';

            // cod SAP: col A 0
            if (rows[index][0] !== undefined) {
                if (rows[index][0].toString().trim().includes('cod')) {
                    consumptions += `"${ rows[index][0].toString().trim() }"`;
                } else {
                    consumptions += rows[index][0].toString().trim();
                }
            } else if (rows[value][0] !== undefined) {
                if (rows[value][0].toString().trim().includes('cod')) {
                    consumptions += `"${ rows[value][0].toString().trim() }"`;
                } else {
                    consumptions += rows[value][0].toString().trim();
                }
            }
            consumptions += ', ';

            // denumire produs: col B 1
            if (rows[index][1] !== undefined) {
                consumptions += `"${ rows[index][1].toString().trim() }"`;
            } else if (rows[value][1] !== undefined) {
                consumptions += `"${ rows[value][1].toString().trim() }"`;
            }
            consumptions += ', ';

            // cantitate: col M 12
            if (rows[index][12] !== undefined) {
                consumptions += rows[index][12].toString().trim();
            }
            consumptions += ', ';

            // pret: col O 14
            if (rows[index][14] !== undefined) {
                consumptions += rows[index][14].toString().trim();
            } else if (rows[value][14] !== undefined) {
                consumptions += rows[value][14].toString().trim();
            } else {
                consumptions += 1;
            }
            consumptions += '] : [],';

            // conditions
            let conditions = '';

            // tipProfil: col C 2
            if (rows[index][2] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `profileType === "CW${ rows[index][2].toString().trim() }"`;
            } else if (rows[value][2] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `profileType === "CW${ rows[value][2].toString().trim() }"`;
            }

            // interax: col D 3
            if (rows[index][3] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `interax === "${ rows[index][3].toString().trim() }"`;
            }

            // hmin: col E 4
            if (rows[index][4] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `H ${ rows[index][4].toString().trim() }`;
            }

            // hmax: col F 5
            if (rows[index][5] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `H ${ rows[index][5].toString().trim() }`;
            }

            // suport: col G 6
            if (rows[index][6] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `suport === "${ rows[index][6].toString().trim() }"`;
            }

            // vata: col H 7
            if (rows[index][7] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `vata === "${ rows[index][7].toString().trim() }"`;
            }

            // rezFoc: col I 8
            if (rows[index][8] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                let fireResistance = rows[index][8].toString().trim();

                if (fireResistance === '0') {
                    conditions += `fireResistance === ${ fireResistance }`;
                } else {
                    conditions += `fireResistance ${ fireResistance }`;
                }
            }

            // rezUmid: col J 9
            if (rows[index][9] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                let rezUmid = rows[index][9].toString().trim();

                if (rezUmid === '<>0') {
                    conditions += `rezUmid !== 0`;
                } else {
                    if (rezUmid.toString().includes("e")) {
                        conditions += `rezUmid === "${ rezUmid.toString().trim() }"`;
                        conditions += ` && consumptionType === "exterior"`;
                    } else {
                        conditions += `rezUmid === ${ rezUmid.toString().trim() }`;
                    }
                }
            }

            // grosimePlaca: col K 10
            if (rows[index][10] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `grosimePlaca ${ rows[index][10].toString().trim() }`;
            }

            // finisare - col L 11
            if (rows[index][11] !== undefined) {
                if (conditions.length) {
                    conditions += ' && ';
                }
                conditions += `finishing === "${ rows[index][11].toString().trim() }"`;
            }

            if (!conditions.includes('consumptionType')) {
                if (index > rowExternalProd) {
                    conditions += ` && consumptionType === "extern"`;
                } else if (index > rowUpperGrip) {
                    if (rows[value][0].toString().trim().includes('cod')) {
                        conditions += ` && consumptionType === "cod-parte-sup"`;
                    } else {
                        conditions += ` && consumptionType === "exterior"`;
                    }
                } else {
                    if (rows[value][0].toString().trim().includes('cod')) {
                        conditions += ` && consumptionType === "cod-parte-inf"`;
                    } else {
                        conditions += ` && consumptionType === "interior"`;
                    }
                }
            }
            conditions += ' ? ';

            arr.push(conditions + consumptions);
        }
    })

    return arr;
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending)
 * @param {Object} data
 */

const sortPlatesAccordingToProfileTypeInteraxHeightAsc = data => {
    data.sort((first, second) => {

        if (first.profileType !== second.profileType) {
            return first.profileType.localeCompare(second.profileType);
            // return first.profileType.localeCompare(second.profileType);
        }

        if (first.interax.localeCompare(second.interax) !== 0) {
            return first.interax.localeCompare(second.interax);
        }

        if (first.hMax !== second.hMax) {
            return parseFloat(first.hMax) - parseFloat(second.hMax);
        }
    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending)
 * @param {Object} data
 */

const sortPlatesAccordingToProfileTypeInteraxHeightAscPlating = data => {
    data.sort((first, second) => {

        if (first.profileType !== second.profileType) {
            return first.profileType - second.profileType;
        }

        if (first.interax !== second.interax) {
            return first.interax - second.interax;
        }

        if (first.interaxSustineri !== second.interaxSustineri) {
            return first.interaxSustineri - second.interaxSustineri;
        }

        if (first.hMax !== second.hMax) {
            return first.hMax - second.hMax;
        }
    })
}

const sortPlatesAccordingToBurglaryResistanceHeightAsc = data => {
    data.sort((first, second) => {

        if (first.burglaryResistance !== second.burglaryResistance) {
            return first.burglaryResistance - second.burglaryResistance;
        }

        if (first.hMax !== second.hMax) {
            return first.hMax - second.hMax;
        }
    })
}


/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToProfileTypeInteraxHeightDesc = data => {
    data.sort((first, second) => {

        if (first.profileType !== second.profileType) {
            return first.profileType.localeCompare(second.profileType);
        }

        if (first.interax.localeCompare(second.interax) !== 0) {
            return first.interax.localeCompare(second.interax);
        }

        if (first.hMax !== second.hMax) {
            return second.hMax - first.hMax;
        }

        if (first.hMin !== second.hMin) {
            return first.hMin - second.hMin;
        }
    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToProfileTypeInteraxHeightDescPlating = data => {
    data.sort((first, second) => {

        if (first.profileType !== second.profileType) {
            return first.profileType.localeCompare(second.profileType);
        }

        if (first.interaxSustineri !== second.interaxSustineri) {
            return first.interaxSustineri !== second.interaxSustineri;
        }

        if (first.interax !== second.interax) {
            return first.interax !== second.interax;
        }

        if (first.hMax !== second.hMax) {
            return first.hMax - second.hMax;
        }

        if (first.hMin !== second.hMin) {
            return first.hMin - second.hMin;
        }
    })
}


/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToFireResistanceHeightDescPlating = data => {
    data.sort((first, second) => {

        if (first.fireResistance !== second.fireResistance) {
            return first.fireResistance - second.fireResistance;
        }

    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToMoistureResistanceHeightDescPlating = data => {
    data.sort((first, second) => {

        if (first.moistureResistance !== second.moistureResistance) {
            return first.moistureResistance - second.moistureResistance;
        }

    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToInteraxSustineriHeightDescPlating = data => {
    data.sort((first, second) => {

        if (first.interaxSustineri !== second.interaxSustineri) {
            return first.interaxSustineri - second.interaxSustineri;
        }

    })
}

const sortPlatesAccordingToBurglaryResistancexHeightDesc = data => {
    data.sort((first, second) => {

        if (first.burglaryResistance !== second.burglaryResistance) {
            return first.burglaryResistance - second.burglaryResistance;
        }

    })
}

const checkPlate = (data, thisPlate) => {
    let check = 0;
    (data || []).forEach(plate => {

        let number = 0;

        plate.face1.forEach((face1Plate, index) => {
            if (face1Plate === thisPlate.face1[index]) {
                ++number;
            }
        })

        plate.face2.forEach((face2Plate, index) => {
            if (face2Plate === thisPlate.face2[index]) {
                ++number;
            }
        })

        if (number === plate.face1.length + plate.face2.length) {
            check = 1;
        }
    });

    return check === 0;
}

/**
 * Eliminating the plates that are doubled
 * @param {Object} data
 */

const compressPlatesAccordingProfileTypeAndInterax = data => {
    let compressedPlates = [];

    data.forEach(plate => {
        let check = 0;
        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.hMax === plate.hMax &&
                compressedPlate.hMin === plate.hMin &&
                compressedPlate.interax === plate.interax &&
                compressedPlate.profileType === plate.profileType &&
                compressedPlate.plates[0].face1.length === plate.plates[0].face1.length) {

                if (checkPlate(compressedPlate.plates, plate.plates[0]) === true) {
                    compressedPlates[index].plates.push(plate.plates[0]);
                    // compressedPlates[index].withSoundInsulation.push(plate.soundInsulation)
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(plate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingProfileTypeAndInterax = data => {

    let currentInterax = 0, currentProfileType = 0;

    sortPlatesAccordingToProfileTypeInteraxHeightDesc(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.profileType !== currentProfileType) {
            currentInterax = plate.interax;
            currentProfileType = plate.profileType;
        } else {
            if (data[index].hMin < data[index - 1].hMax) {
                data[index - 1].plates.map(checkingPlate => {
                    if (checkPlate(plate.plates, checkingPlate) === true) {
                        data[index].plates.push(checkingPlate);
                    }
                })
            }
        }
    });

    sortPlatesAccordingToProfileTypeInteraxHeightAsc(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.profileType !== currentProfileType) {
            currentInterax = plate.interax;
            currentProfileType = plate.profileType;
        } else {
            if (data[index].hMin === 0) {
                data[index].hMin = data[index - 1].hMax;
            }
        }
    });

    return data;
}


/**
 * Eliminating the plates that are doubled (according burglary resistance)
 * @param {Object} data
 */

const compressPlatesAccordingBurglaryResistance = data => {
    let compressedPlates = [];

    data.forEach(plate => {
        let check = 0;
        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.burglaryResistance === plate.burglaryResistance &&
                compressedPlate.plates[0].face1.length === plate.plates[0].face1.length) {

                if (checkPlate(compressedPlate.plates, plate.plates[0]) === true) {
                    compressedPlates[index].plates.push(plate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(plate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingBurglaryResistance = data => {

    let currentBurglaryResistance = -1;

    sortPlatesAccordingToBurglaryResistancexHeightDesc(data);

    data.forEach((plate, index) => {
        if (plate.burglaryResistance !== currentBurglaryResistance) {
            currentBurglaryResistance = plate.burglaryResistance;
        } else {
            data[index - 1].plates.forEach(checkingPlate => {
                if (checkPlate(plate.plates, checkingPlate) === true) {
                    data[index].plates.push(checkingPlate);
                }
            })
        }
    });

    sortPlatesAccordingToBurglaryResistanceHeightAsc(data);

    data.forEach((plate, index) => {
        if (plate.burglaryResistance !== currentBurglaryResistance) {
            currentBurglaryResistance = plate.burglaryResistance;
        } else {
            if (index > 0) {
                data[index].hMin = data[index - 1].hMax;
            }
        }
    });

    return data;
}

const buildStructurePlatesAccordingToProfileTypeAndInterax = table => {
    let structure = extractData(table);
    structure.shift();

    structure = compressPlatesAccordingProfileTypeAndInterax(structure);
    structure = collapsePlatesAccordingProfileTypeAndInterax(structure);

    return structure;
}

const buildStructurePlatesAccordingToBurglaryResistance = table => {
    let structure = extractData(table);
    structure.shift();

    structure = compressPlatesAccordingBurglaryResistance(structure);
    structure = collapsePlatesAccordingBurglaryResistance(structure);

    return structure;
}

const buildStructurePlatesAccordingToFireResistance = table => {
    let structure = extractData(table);
    structure.shift();

    structure = compressPlatesAccordingFireResistance(structure);
    structure = collapsePlatesAccordingFireResistance(structure);

    return structure;
}

const updateConsumptions = (consumptions, products, language) => {
    consumptions.forEach(consumption => {
        if (!consumption.codSap.includes('cod')) {
            let findProduct = products.find(product => product.codSap === consumption.codSap);
            if (findProduct) {
                if (
                    consumption.productName !== findProduct.name ||
                    consumption.unitMeasure !== findProduct.excelUM ||
                    consumption.price !== +findProduct.salePrice ||
                    consumption.weight !== +findProduct.saleWeight
                ) {
                    let updatedConsumption = {...consumption};
                    updatedConsumption.productName = findProduct.name;
                    updatedConsumption.unitMeasure = findProduct.excelUM;
                    updatedConsumption.price = findProduct.salePrice;
                    updatedConsumption.weight = findProduct.saleWeight;

                    return databaseService.updateConsumption({_id: consumption._id}, updatedConsumption, language);
                }
            }
        }
    });

    return null;
}

const buildAllowedPlatesArray = (importName, table, products) => {
    table.unshift([' ']);
    let arr = [];
    for (let i = 3; i <= 12; ++i) {
        let obj = {};
        let found = products.find(product =>
            product.codSap == table[3][i].toString().trim()
        );
        if (found) {
            obj.plateName = found.name;
        } else {
            obj.plateName = 'product error'
        }
        let replaceArray = [];
        for (let j = 5; j <= 31; ++j) {
            let objReplace = {};
            if (table[j][i]) {
                let foundRow = products.find(product =>
                    product.codSap == table[j][13].toString().trim()
                );
                if (foundRow) {
                    objReplace.plate = foundRow.name;
                } else {
                    objReplace.plate = 'product error';
                }
                if (table[j][2] !== undefined && table[j][2].toString().trim() === '0') {
                    objReplace.fireResistance = '0m';
                }
                replaceArray.push(objReplace);
            }
        }
        obj.canReplacePlate = replaceArray;
        obj.importName = importName;
        arr.push(obj);
    }
    return arr;
}

/**
 * Sorting Objects according to Fire Resistance and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToFireResistanceHeightDesc = data => {
    data.sort((first, second) => {

        if (first.fireResistance !== second.fireResistance) {
            return first.fireResistance - second.fireResistance;
        }

        if (first.interax.localeCompare(second.interax) !== 0) {
            return first.interax.localeCompare(second.interax);
        }

        if (first.hMax !== second.hMax) {
            return second.hMax - first.hMax;
        }
    })
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingFireResistance = data => {
    let compressedPlates = [];

    data.forEach(plate => {
        let check = 0;
        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.fireResistance === plate.fireResistance &&
                compressedPlate.hMax === plate.hMax &&
                compressedPlate.hMin === plate.hMin &&
                compressedPlate.plates[0].face1.length === plate.plates[0].face1.length) {

                if (checkPlate(compressedPlate.plates, plate.plates[0]) === true) {
                    compressedPlates[index].plates.push(plate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(plate);
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to fire resistance
 * @param {Object} data
 */

const collapsePlatesAccordingFireResistance = data => {

    let currentFireResistance = -1;
    let updatedData = [], currentArray;

    sortPlatesAccordingToFireResistanceHeightDesc(data);

    data.forEach(plate => {
        if (plate.fireResistance !== currentFireResistance) {
            currentFireResistance = plate.fireResistance;
            if (currentArray) {
                updatedData.push(currentArray);
            }
            currentArray = plate;
        } else {
            plate.plates.forEach(checkingPlate => {
                if (checkPlate(currentArray.plates, checkingPlate) === true) {
                    currentArray.plates.push(checkingPlate);
                }
            })
        }
    });
    updatedData.push(currentArray);
    return updatedData;
}

const buildStructurePlatesAccordingToMoistureResistance = table => {
    let structure = extractData(table);

    structure.shift();

    structure = compressPlatesAccordingMoistureResistance(structure);
    structure = collapsePlatesAccordingMoistureResistance(structure);

    return structure;
}

/**
 * Sorting Objects according to Fire Resistance and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortPlatesAccordingToMoistureResistanceHeightDesc = data => {
    data.sort((first, second) => {

        if (first.moistureResistance.toString() !== second.moistureResistance.toString()) {
            if (first.moistureResistance.toString() > second.moistureResistance.toString()) {
                return 1;
            }
            return -1;
        }

        if (first.hMax !== second.hMax) {
            return second.hMax - first.hMax;
        }
    })
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingMoistureResistance = data => {
    let compressedPlates = [];

    data.forEach(plate => {
        let check = 0;
        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.moistureResistance === plate.moistureResistance &&
                compressedPlate.hMax === plate.hMax &&
                compressedPlate.hMin === plate.hMin &&
                compressedPlate.plates[0].face1.length === plate.plates[0].face1.length) {

                if (checkPlate(compressedPlate.plates, plate.plates[0]) === true) {
                    compressedPlates[index].plates.push(plate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(plate);
        }
    });

    return compressedPlates;
}
/**
 * Collapse the plates according to moisture resistance
 * @param {Object} data
 */

const collapsePlatesAccordingMoistureResistance = data => {

    let currentMoistureResistance = -1;
    let updatedData = [], currentArray;

    sortPlatesAccordingToMoistureResistanceHeightDesc(data);

    data.forEach(plate => {
        if (plate.moistureResistance !== currentMoistureResistance) {
            currentMoistureResistance = plate.moistureResistance;
            if (currentArray) {
                updatedData.push(currentArray);
            }
            currentArray = plate;
        } else {
            plate.plates.forEach(checkingPlate => {
                if (checkPlate(currentArray.plates, checkingPlate) === true) {
                    currentArray.plates.push(checkingPlate);
                }
            })
        }
    });
    updatedData.push(currentArray);
    return updatedData;
}

/**
 * Get sheet tab number
 *
 * @param sheetTabs
 * @param importName
 * @returns {null|*}
 */
const getSheetTabIndex = (sheetTabs, importName) => {
    switch (importName) {
        case 'Consumuri Separativi - Asimetrici':
            return sheetTabs.indexOf('consumuri S asimetric');
        case 'Pereti Separativi - Asimetrici':
            return sheetTabs.indexOf('sisteme S asimetric');
        case 'Consumuri Separativi - Dublu Intermediar':
            return sheetTabs.indexOf('cosumuri S dublu intermediar');
        case 'Pereti Separativi - Dublu Intermediar':
            return sheetTabs.indexOf('sisteme S dublu intermediar');
        case 'Consumuri Separativi - Triplu Intermediar':
            return sheetTabs.indexOf('consumuri S triplu intermediar');
        case 'Pereti Separativi - Triplu Intermediar':
            return sheetTabs.indexOf('sisteme S triplu intermediar');
        case 'Consumuri - Triplu Placat':
            return sheetTabs.indexOf('consumuri pereti triplu');
        case 'Consumuri - Dublu Placat':
            return sheetTabs.indexOf('consumuri pereti dublu');
        case 'Consumuri - Simplu Placat':
            return sheetTabs.indexOf('consumuri pereti simplu');
        case 'Consumuri - Placari Smart Simple':
            return sheetTabs.indexOf('consumuri placari simple');
        case 'Consumuri - Placari Smart Duble':
            return sheetTabs.indexOf('consumuri placari dublu');
        case 'Consumuri - Plafoane Smart Simple':
            return sheetTabs.indexOf('consumuri plafoane simple');
        case 'Consumuri - Plafoane Smart Duble':
            return sheetTabs.indexOf('consumuri plafoane dublu');
        case 'Consumuri Separativi - Triplu Placat':
            return sheetTabs.indexOf('consumuri S triplu');
        case 'Consumuri Separativi - Dublu Placat':
            return sheetTabs.indexOf('cosumuri S dublu');
        case 'Consumuri Separativi - Simplu Placat':
            return sheetTabs.indexOf('cosumuri S simplu');
        case 'Sisteme - Plafoane Cvadruple':
            return sheetTabs.indexOf('sisteme plafoane qvdruplu');
        case 'Sisteme - Plafoane Triple':
            return sheetTabs.indexOf('sisteme plafoane triplu');
        case 'Sisteme - Plafoane Duble':
            return sheetTabs.indexOf('sisteme plafoane dublu');
        case 'Sisteme - Plafoane Simple':
            return sheetTabs.indexOf('sisteme plafoane simplu');
        case 'Sisteme - Plafoane Smart Duble':
            return sheetTabs.indexOf('sisteme plafoane smart dublu');
        case 'Sisteme - Plafoane Smart Simple':
            return sheetTabs.indexOf('sisteme plafoane smart simplu');
        case 'Sisteme - Triplu Placat':
            return sheetTabs.indexOf('sisteme pereti triplu');
        case 'Pereti Separativi - Simplu Placat':
            return sheetTabs.indexOf('sisteme S simplu');
        case 'Pereti Separativi - Dublu Placat':
            return sheetTabs.indexOf('sisteme S dublu');
        case 'Pereti Separativi - Triplu Placat':
            return sheetTabs.indexOf('sisteme S triplu');
        case 'Sisteme - Dublu Placat':
            return sheetTabs.indexOf('sisteme pereti dublu');
        case 'Sisteme - Simplu Placat':
            return sheetTabs.indexOf('sisteme pereti simplu');
        case 'Sisteme - Placari Cvadruple':
            return sheetTabs.indexOf('sisteme placari qvadruple');
        case 'Sisteme - Placari Triple':
            return sheetTabs.indexOf('sisteme placari triple');
        case 'Sisteme - Placari Duble':
            return sheetTabs.indexOf('sisteme placari duble');
        case 'Sisteme - Placari Simple':
            return sheetTabs.indexOf('sisteme placari simple');
        case 'Sisteme - Placari Lipire':
            return sheetTabs.indexOf('sisteme placari lipire');
        case 'Sisteme - Placari Noisy Triple':
            return sheetTabs.indexOf('sisteme Noisy triple');
        case 'Sisteme - Placari Noisy Duble':
            return sheetTabs.indexOf('sisteme Noisy duble');
        case 'Sisteme - Placari Smart Simple':
            return sheetTabs.indexOf('sisteme placari smart simple');
        case 'Sisteme - Placari Smart Duble':
            return sheetTabs.indexOf('sisteme placari smart duble');
        case 'Pereti Smart - Simplu Placat':
            return sheetTabs.indexOf('sisteme pereti simplu');
        case 'Pereti Smart - Dublu Placat':
            return sheetTabs.indexOf('sisteme pereti dublu');
        case 'Placi Permise':
            return sheetTabs.indexOf('Placi permise');
        case 'Produse':
            return sheetTabs.indexOf('lista preturi');
        case 'Consumuri - Placari Cvadruple':
            return sheetTabs.indexOf('consumuri placari qvadruple');
        case 'Consumuri - Placari Triple':
            return sheetTabs.indexOf('consumuri placari triple');
        case 'Consumuri - Placari Duble':
            return sheetTabs.indexOf('consumuri placari duble');
        case 'Consumuri - Placari Simple':
            return sheetTabs.indexOf('consumuri placari simple');
        case 'Consumuri - Placari Lipire':
            return sheetTabs.indexOf('consumuri placari lipire');
        case 'Consumuri - Placari Noisy Triple':
            return sheetTabs.indexOf('consumuri Noisy triple');
        case 'Consumuri - Placari Noisy Duble':
            return sheetTabs.indexOf('consumuri Noisy duble');
        case 'Consumuri - Plafoane Cvadruple':
            return sheetTabs.indexOf('consumuri plafoane qvdruplu');
        case 'Consumuri - Plafoane Triple':
            return sheetTabs.indexOf('consumuri plafoane triplu');
        case 'Consumuri - Plafoane Duble':
            return sheetTabs.indexOf('consumuri plafoane dublu');
        case 'Consumuri - Plafoane Simple':
            return sheetTabs.indexOf('consumuri plafoane simplu');
        case 'Consumuri - Pereti Smart Simplu Placat':
            return sheetTabs.indexOf('consumuri pereti simplu');
        case 'Consumuri - Pereti Smart Dublu Placat':
            return sheetTabs.indexOf('consumuri pereti dublu');
        default:
            return -1;
    }
}

const putSystemCodes = (table, importName) => {
    let structure = extractData(table);
    structure.shift();
    let newStructure = []

    structure.forEach(system => {
        if (system.systemCode) {
            newStructure.push({
                thickness: system.thicknessSystem,
                systemCodeTable: system.systemCode,
                systemCode: generateSystemCode(system),
                soundInsulation: system.soundInsulation,
                fireResistance: system.fireResistance,
                profileType: system.profileType,
                moistureResistance: system.moistureResistance,
                burglaryResistance: system.burglaryResistance,
                auxilary: system.auxilary,
                support: system.support,
                valueSoundInsulation: system.valueSoundInsulation,
                codSap1: system.codSap1,
                codSap2: system.codSap2,
                codSap3: system.codSap3,
                hMin: system.hMin,
                hMax: system.hMax,
                importName: importName,
                systemAccess: system.systemAccess,
                interax: system.interax,
                plates: {
                    face1: {
                        plate1: system.plates[0].face1[0],
                        plate2: system.plates[0].face1[1],
                        plate3: system.plates[0].face1[2],
                    },
                    face2: {
                        plate1: system.plates[0].face2[0],
                        plate2: system.plates[0].face2[1],
                        plate3: system.plates[0].face2[2],
                    }
                }
            })
        }
    })

    return newStructure;
}

const putSystemCodesCeiling = (table, importName) => {
    let structure = extractDataCeiling(table);
    structure.shift();
    let newStructure = []

    structure.forEach(system => {
        if (system.systemCode) {
            newStructure.push({
                protectionSense: system.protectionSense,
                valueHoldingInterax: system.valueHoldingInterax,
                basePlate: system.basePlate,
                thickness: system.thicknessSystem,
                autoportante: system.support > 0 ? 1 : 0,
                systemCodeTable: system.systemCode,
                systemCode: generateSystemCodeCeiling(system),
                fireResistance: system.fireResistance,
                profileType: system.profileType,
                burglaryResistance: system.burglaryResistance,
                moistureResistance: system.moistureResistance,
                soundInsulation: system.soundInsulation,
                auxilary: system.auxilary,
                support: system.support,
                hMin: system.hMin,
                hMax: system.hMax,
                valueSoundInsulation: system.valueSoundInsulation,
                codSap1: system.codSap1,
                codSap2: system.codSap2,
                codSap3: system.codSap3,
                importName: importName,
                systemAccess: system.systemAccess,
                interax: system.interax,
                plates: {
                    face1: {
                        plate1: system.plates[0].face1[0],
                        plate2: system.plates[0].face1[1],
                        plate3: system.plates[0].face1[2],
                    },
                    face2: {
                        plate1: system.plates[0].face2[0],
                        plate2: system.plates[0].face2[1],
                        plate3: system.plates[0].face2[2],
                    }
                }
            })
        }
    })

    return newStructure;
}

const putSystemCodesPlating = (table, importName) => {
    let structure = extractDataPlacari(table);
    structure.shift();
    let newStructure = []

    structure.forEach(system => {
        if (system.systemCode) {
            newStructure.push({
                thickness: system.thicknessSystem,
                systemCodeTable: system.systemCode,
                systemCode: generateSystemCodePlating(system, importName),
                soundInsulation: system.soundInsulation,
                interaxSustineri: system.interaxSustineri,
                valueSoundInsulation: system.valueSoundInsulation,
                fireResistance: system.fireResistance,
                moistureResistance: system.moistureResistance,
                profileType: system.profileType,
                auxilary: system.auxilary,
                support: system.support,
                codSap1: system.codSap1,
                codSap2: system.codSap2,
                codSap3: system.codSap3,
                codSap4: system.codSap4,
                hMin: system.hMin,
                hMax: system.hMax,
                importName: importName,
                systemAccess: system.systemAccess,
                interax: system.interax,
            })
        }
    })

    return newStructure;
}

const getPlateCode = (plate) => {
    if (plate.includes("Cementex") && plate.includes("8")) {
		return "C8";
	}
	if (plate.includes("Cementex") && plate.includes("10")) {
		return "C10";
	}
	if (plate.includes("Cementex") && plate.includes("12")) {
		return "C12";
	}
    if (plate.includes("Standard")) {
        return "S";
    }
    if (plate.includes("Acustic")) {
        return "A";
    }
    if (plate.includes("Flam Extra")) {
        return "Fe";
    }
    if (plate.includes("Flam Plus")) {
        return "Fp";
    }
    if (plate.includes("Flam")) {
        return "F";
    }
    if (plate.includes("Hydroflam")) {
        return "Hf";
    }
    if (plate.includes("Hydro")) {
        return "H";
    }
    if (plate.includes("PregyAquaBoard")) {
        return "Aq";
    }
    if (plate.includes("LaDura")) {
        return "D";
    }
    if (plate.includes("Resistex")) {
        return "Re";
    }
    return plate;
}

const generateSystemCodePlating = (offer, importName) => {
    let generatedCode = '', profileType = offer.profileType ? parseFloat(offer.profileType.match(/(\d+)/)[0]) : 0, nrPlaci = 0;

    if (offer.interaxSustineri === 250 || offer.interaxSustineri === 125) {
        generatedCode += 'T'
    }

    if (offer.interaxSustineri === 2 || offer.interaxSustineri === 2.5 || offer.interaxSustineri === 0) {
        generatedCode += 'SH'
    }

    let nrD = 0, grosime1, grosime2;
    let firstParenthesis = '', secondParenthesis = '';

    if (offer.plates[0].platesName[0]) {
        if (offer.plates[0].platesName[0].includes(12.5)) {
            nrD += 12.5;
            grosime1 = 12.5;
            nrPlaci = 1;
            firstParenthesis += getPlateCode(offer.plates[0].platesName[0]);
        } else {
            if (offer.plates[0].platesName[0].includes(15)) {
                nrD += 15;
                grosime1 = 15;
                nrPlaci = 1;
                secondParenthesis += getPlateCode(offer.plates[0].platesName[0]);
            } else {
                nrD += 18;
                grosime1 = 18;
                nrPlaci = 1;
                secondParenthesis += getPlateCode(offer.plates[0].platesName[0]);
            }
        }
    }

    if (offer.plates[0].platesName[1]) {
        if (offer.plates[0].platesName[1].includes(12.5)) {
            nrD += 12.5;
            nrPlaci = 2;
            firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[1]);

        } else {
            if (offer.plates[0].platesName[1].includes(15)) {
                nrD += 15;
                nrPlaci = 2;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[1]);
            } else {
                nrD += 18;
                nrPlaci = 2;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[1]);
            }
        }
    }

    if (offer.plates[0].platesName[2]) {
        if (offer.plates[0].platesName[2].includes(12.5)) {
            nrD += 12.5;
            grosime2 = 12.5;
            nrPlaci = 3;
            firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[2]);
        } else {
            if (offer.plates[0].platesName[2].includes(15)) {
                nrD += 15;
                grosime2 = 15;
                nrPlaci = 3;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[2]);
            } else {
                nrD += 18;
                grosime2 = 18;
                nrPlaci = 3;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[2]);
            }
        }
    }

    if (offer.plates[0].platesName[3]) {
        if (offer.plates[0].platesName[3].includes(12.5)) {
            nrD += 12.5;
            nrPlaci = 4;
            firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[3]);

        } else {
            if (offer.plates[0].platesName[3].includes(15)) {
                nrD += 15;
                nrPlaci = 4;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[3]);
            } else {
                nrD += 18;
                nrPlaci = 4;
                secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(offer.plates[0].platesName[3]);
            }
        }
    }

    if (offer.interaxSustineri === 250) {
        generatedCode += nrPlaci + 'F';
        nrD += profileType
    }

    if (offer.interaxSustineri === 0) {
        generatedCode += nrPlaci;
    }

    if (offer.interaxSustineri === 125) {
        let suma = nrD + 30;
        generatedCode += suma.toString() + 'Br ';
    }

    if (offer.interaxSustineri === 2 || offer.interaxSustineri === 2.5 || offer.interaxSustineri === 0) {
        generatedCode += '.'
    }

    if (offer.interaxSustineri === 2) {
        generatedCode += 'W200'
    }

    if (offer.interaxSustineri === 2.5) {
        generatedCode += 'W250 ' + offer.thicknessSystem + ' ';
    }

    if (offer.interaxSustineri !== 0 && offer.interaxSustineri !== 2.5) {
        if (profileType !== 60 && profileType !== 30) {
            generatedCode += "CW " + offer.thicknessSystem + '*CW'
        } else {
            if (profileType === 60) {
                generatedCode += "CD";
            } else {
                generatedCode += 'UD';
            }
        }
        generatedCode += profileType + "@" + offer.interax + " ";
    } else if (offer.interaxSustineri !== 2.5) {
        nrD += profileType;
        generatedCode += nrD + ' ';
        if (profileType !== 60 && profileType !== 30) {
            generatedCode += "CW";
        } else {
            if (profileType === 60) {
                generatedCode += "CD"
            } else {
                generatedCode += 'UD';
            }
        }
        generatedCode += profileType + "@" + offer.interax + " ";
    } else {
        if (profileType !== 60 && profileType !== 30) {
            generatedCode += "CW";
        } else {
            if (profileType === 60) {
                generatedCode += "CD"
            } else {
                generatedCode += 'UD';
            }
        }
        generatedCode += profileType + ' ';
    }

    if (importName.includes("ipire")) {
        if (offer.support === 0) {
            generatedCode += "be "
        } else {
            if (offer.support === 1) {
                generatedCode += "zid "
            } else {
                if (offer.support === 2) {
                    generatedCode += "tenc "
                } else {
                    if (offer.support === 3) {
                        generatedCode += "alte "
                    }
                }
            }
        }
    }
    else {
        if (offer.support === 0) {
            generatedCode += "be "
        } else {
            if (offer.support === 1) {
                generatedCode += "tc "
            }
        }
    }

    if (firstParenthesis !== '') {
        generatedCode += "(" + firstParenthesis + ")" + grosime1;
    } else {
        generatedCode += "(" + secondParenthesis + ")" + grosime1;
    }
    if (secondParenthesis !== '' && firstParenthesis !== '') {
        generatedCode += '+(' + secondParenthesis + ')' + grosime2;
    } else {
        if (secondParenthesis !== '') {
            generatedCode += '(' + secondParenthesis + ')' + grosime2;
        }
    }


    if (offer.soundInsulation === 1) {
        generatedCode += ' VM';
    }

    if (offer.fireResistance === '0' || offer.fireResistance === 0) {
        generatedCode += ' nonRF'
    } else {
        generatedCode += ' EI' + offer.fireResistance;
    }

    return generatedCode;

}

const generateSystemCode = (offer) => {
    let generatedCode = "D", profileType = 0, gross = 0;

    profileType = parseFloat(offer.profileType.match(/(\d+)/));

    let nrOfPlates = 0;

    if (offer.plates[0].face1[0]) {
        nrOfPlates += 2;
    }

    if (offer.plates[0].face1[1]) {
        nrOfPlates += 2;
    }

    if (offer.plates[0].face1[2]) {
        nrOfPlates += 2;
    }

    if (offer.plates[0].face1[0].includes(12.5)) {
        gross = 12.5
        let nrD = 12.5 * nrOfPlates + profileType;
        generatedCode += nrD + "*" + offer.profileType;
    } else {
        gross = 15
        let nrD = 15 * nrOfPlates + profileType;
        generatedCode += nrD + "*" + offer.profileType;
    }

    generatedCode += "@" + offer.interax + " ";

    if (offer.support.includes('beton')) {
        generatedCode += "be "
    } else {
        generatedCode += "tc "
    }

    generatedCode += "(";
    if (offer.plates[0].face1[0]) {
        generatedCode += getPlateCode(offer.plates[0].face1[0]);
    }
    if (offer.plates[0].face1[1]) {
        generatedCode += "+" + getPlateCode(offer.plates[0].face1[1]);
    }
    if (offer.plates[0].face1[2]) {
        generatedCode += "+" + getPlateCode(offer.plates[0].face1[2])
    }
    generatedCode += ")" + gross;
    generatedCode += "^(";
    if (offer.plates[0].face2[0]) {
        generatedCode += getPlateCode(offer.plates[0].face2[0]);
    }
    if (offer.plates[0].face2[1]) {
        generatedCode += "+" + getPlateCode(offer.plates[0].face2[1]);
    }
    if (offer.plates[0].face2[2]) {
        generatedCode += "+" + getPlateCode(offer.plates[0].face2[2]);
    }
    generatedCode += ")" + gross;

    if (offer.soundInsulation === 1) {
        generatedCode += 'VM';
    }

    if (offer.fireResistance === '0' || offer.fireResistance === 0) {
        generatedCode += ' nonRF'
    } else {
        generatedCode += ' EI' + offer.fireResistance;
    }

    if (offer.burglaryResistance !== 0) {
        generatedCode += ' RC' + offer.burglaryResistance
    }
    return generatedCode;

}

const generateSystemCodeCeiling = (offer) => {
    let generatedCode = "P";

    generatedCode += offer.plates[0].face2.length + '.';

    generatedCode += offer.thicknessSystem + '.';

    if (offer.structureType === 1) {
        generatedCode += 'S1.' + (offer.secondaryStructure || offer.primaryStructure) + '.' + (offer.secondaryInterax || offer.primaryInterax) + '.'
    }
    if (offer.structureType === 2) {
        generatedCode += 'S2.' + offer.primaryStructure + '/' + offer.secondaryStructure + '.' + offer.primaryInterax + '/' + offer.secondaryInterax + '.'
    }
    if (offer.structureType === 0) {
        generatedCode += 'A' + '/' + (offer.primaryStructure || '-') + '/' + (offer.secondaryStructure || '-') + '/' + offer.primaryInterax + '/' + offer.secondaryInterax;
    }

    if (offer.support === 1) {
        generatedCode += 'Br';
    }

    if (offer.support === 2) {
        generatedCode += 'T';
    }

    if (offer.support === 3) {
        generatedCode += 'N';
    }

    if (offer.support === 4) {
        generatedCode += 'Tf'; 
    }

    if (offer.support === 5) {
        generatedCode += 'Rl';
    }

    if (offer.support === 6) {
        generatedCode += 'Ba';
    }

    let thicknessPlatesSum = 0, platesWithThickness12 = '(', platesWithThickness15 = '(', platesWithThickness18 = '(',
        face1PlatesWithThickness12 = '(', face1PlatesWithThickness15 = '(', face1PlatesWithThickness18 = '(';

    offer.plates[0].face1.forEach(plate => {
        if (plate.includes(12.5)) {
            platesWithThickness12 += plate;
        } else {
            if (plate.includes(15)) {
                platesWithThickness15 += plate;
            } else {
                platesWithThickness18 += plate;
            }
        }
    })

    offer.plates[0].face2.forEach(plate => {
        if (plate.includes(12.5)) {
            platesWithThickness12 += plate;
        } else {
            if (plate.includes(15)) {
                platesWithThickness15 += plate;
            }
            else {
                platesWithThickness18 += plate;
            }
        }
    })

    generatedCode += ' ';

    if (platesWithThickness12 !== '(') {
        generatedCode += platesWithThickness12 + ')12.5 ^ '
    }

    if (platesWithThickness15 !== '(') {
        generatedCode += platesWithThickness15 + ')15 ^ '
    }

    if (platesWithThickness18 !== '(') {
        generatedCode += platesWithThickness18 + ')18 '
    }

    if (offer.soundInsulation > 0) {
        generatedCode += 'VM' + offer.soundInsulation;
    }

    if (offer.fireResistance === '0' || offer.fireResistance === 0) {
        generatedCode += ' nonRF'
    } else {
        generatedCode += ' EI' + offer.fireResistance;
    }

    return generatedCode;
}

const buildStructurePlatesAccordingToProfileTypeAndInteraxPlating = table => {
    let structure = extractDataPlacari(table);
    structure.shift();

    structure = compressPlatesAccordingProfileTypeAndInteraxPlating(structure);

    structure = collapsePlatesAccordingProfileTypeAndInteraxPlating(structure);

    return structure;
}


/**
 * Checking if the plating exists
 * @param {Object} data
 * @param {the plate we check if exists} thisPlate
 */

const checkPlatingSystem = (compressedPlates, checkThisPlate) => {
    let check = true;
    (compressedPlates || []).plates.forEach(thisCompressedPlate => {

        let number = 0;

        thisCompressedPlate.platesName.forEach((thisPlate, index) => {
            if (thisPlate === checkThisPlate.platesName[index]) {
                ++number;
            }
        })

        if (number === checkThisPlate.platesName.length) {
            check = false;
        }
    });

    return check;
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingProfileTypeAndInteraxPlating = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.hMax === thisPlate.hMax &&
                compressedPlate.hMin === thisPlate.hMin &&
                compressedPlate.interax === thisPlate.interax &&
                compressedPlate.fireResistance === thisPlate.fireResistance &&
                compressedPlate.interaxSustineri === thisPlate.interaxSustineri &&
                compressedPlate.profileType === thisPlate.profileType) {

                if (checkPlatingSystem(compressedPlate, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingProfileTypeAndInteraxPlating = data => {

    let currentInterax = '0', currentProfileType = '0', currentInteraxSustineri = '0', currentFireResistance = '0';

    sortPlatesAccordingToProfileTypeInteraxHeightDescPlating(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.interaxSustineri !== currentInteraxSustineri || plate.profileType !== currentProfileType || plate.fireResistance !== currentFireResistance) {
            currentInterax = plate.interax;
            currentInteraxSustineri = plate.interaxSustineri;
            currentProfileType = plate.profileType;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin < data[index - 1].hMax) {
                data[index - 1].plates.map(checkingPlate => {
                    if (checkPlatingSystem(plate, checkingPlate)) {
                        data[index].plates.push(checkingPlate);
                    }
                })
            }
        }
    });

    sortPlatesAccordingToProfileTypeInteraxHeightAscPlating(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.interaxSustineri !== currentInteraxSustineri || plate.profileType !== currentProfileType || plate.fireResistance !== currentFireResistance) {
            currentInterax = plate.interax;
            currentInteraxSustineri = plate.interaxSustineri;
            currentProfileType = plate.profileType;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin === 0) {
                if (index - 1 > 0) {
                    data[index].hMin = data[index - 1].hMax;
                } 
            }
        }
    });

    return data;
}

const buildStructurePlatesAccordingToFireResistancePlating = table => {
    let structure = extractDataPlacari(table);
    structure.shift();

    structure = compressPlatesAccordingFireResistancePlating(structure);
    structure = collapsePlatesAccordingFireResistancePlating(structure);

    return structure;
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingFireResistancePlating = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.fireResistance === thisPlate.fireResistance) {

                if (checkPlatingSystem(compressedPlate, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingFireResistancePlating = data => {

    let currentFireResistance = '0';

    sortPlatesAccordingToFireResistanceHeightDescPlating(data);
    data.map((plate, index) => {
        if (plate.fireResistance !== currentFireResistance) {
            currentFireResistance = plate.fireResistance;
        } else {
            data[index - 1].plates.map(checkingPlate => {
                if (checkPlatingSystem(plate, checkingPlate)) {
                    data[index].plates.push(checkingPlate);
                }
            })
        }
    });

    return data;
}

const buildStructurePlatesAccordingToMoistureResistancePlating = table => {
    let structure = extractDataPlacari(table);
    structure.shift();

    structure = compressPlatesAccordingMoistureResistancePlating(structure);
    structure = collapsePlatesAccordingMoistureResistancePlating(structure);

    return structure;
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingMoistureResistancePlating = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.moistureResistance === thisPlate.moistureResistance) {

                if (checkPlatingSystem(compressedPlate, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingMoistureResistancePlating = data => {

    let currentMoistureResistance = '0';

    sortPlatesAccordingToMoistureResistanceHeightDescPlating(data);

    data.map((plate, index) => {
        if (plate.moistureResistance !== currentMoistureResistance) {
            currentMoistureResistance = plate.moistureResistance;
        } else {
            data[index - 1].plates.map(checkingPlate => {
                if (checkPlatingSystem(plate, checkingPlate)) {
                    data[index].plates.push(checkingPlate);
                }
            })
        }
    });

    return data;
}

const buildStructurePlatesAccordingToInteraxSustineriPlating = table => {
    let structure = extractDataPlacari(table);
    structure.shift();

    structure = compressPlatesAccordingInteraxSustineriPlating(structure);
    structure = collapsePlatesAccordingInteraxSustineriPlating(structure);

    return structure;
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressPlatesAccordingInteraxSustineriPlating = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.interaxSustineri === thisPlate.interaxSustineri) {

                if (checkPlatingSystem(compressedPlate, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapsePlatesAccordingInteraxSustineriPlating = data => {

    let currentInteraxSustineri = '0';

    sortPlatesAccordingToInteraxSustineriHeightDescPlating(data);

    data.map((plate, index) => {
        if (plate.interaxSustineri !== currentInteraxSustineri) {
            currentInteraxSustineri = plate.InteraxSustineri;
        } else {
            data[index - 1].plates.map(checkingPlate => {
                if (checkPlatingSystem(plate, checkingPlate)) {
                    data[index].plates.push(checkingPlate);
                }
            })
        }
    });

    return data;
}

/**
 * Eliminating the plates that are doubled (according fire resistance)
 * @param {Object} data
 */

const compressNoisyPlatesInteraxAndProfileType = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.hMax === thisPlate.hMax &&
                compressedPlate.hMin === thisPlate.hMin &&
                compressedPlate.interax1 === thisPlate.interax1 &&
                compressedPlate.interax2 === thisPlate.interax2 &&
                compressedPlate.fireResistance === thisPlate.fireResistance &&
                compressedPlate.interaxSustineri === thisPlate.interaxSustineri &&
                compressedPlate.profileType1 === thisPlate.profileType1 &&
                compressedPlate.profileType2 === thisPlate.profileType2) {

                if (checkPlate(compressedPlate.plates, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Eliminating the plates that are doubled
 * @param {Object} data
 */

const compressSpecialWallsInteraxAndProfileType = data => {
    let compressedPlates = [];

    data.forEach(thisPlate => {
        let check = 0;

        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.hMax === thisPlate.hMax &&
                compressedPlate.hMin === thisPlate.hMin &&
                compressedPlate.interax1 === thisPlate.interax1 &&
                compressedPlate.interax2 === thisPlate.interax2 &&
                compressedPlate.fireResistance === thisPlate.fireResistance &&
                compressedPlate.structureLink === thisPlate.structureLink &&
                compressedPlate.profileType1 === thisPlate.profileType1 &&
                compressedPlate.profileType2 === thisPlate.profileType2) {

                if (checkPlate(compressedPlate.plates, thisPlate.plates[0])) {
                    compressedPlates[index].plates.push(thisPlate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(thisPlate)
        }
    });

    return compressedPlates;
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortNoisyPlatingAccordingToProfileAndInteraxDesc = data => {
    data.sort((first, second) => {

        if (first.profileType1 !== second.profileType1) {
            return first.profileType1 - second.profileType1;
        }

        if (first.profileType2 !== second.profileType2) {
            return first.profileType2 - second.profileType2;
        }

        if (first.interax1 !== second.interax1) {
            return first.interax1 !== second.interax1;
        }

        if (first.interax2 !== second.interax2) {
            return first.interax2 !== second.interax2;
        }

        if (first.interaxSustineri !== second.interaxSustineri) {
            return first.interaxSustineri !== second.interaxSustineri;
        }

        if (first.hMax !== second.hMax) {
            return second.hMax - first.hMax;
        }

        if (first.hMin !== second.hMin) {
            return first.hMin - second.hMin;
        }
    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortNoisyPlatingAccordingToProfileAndInteraxAsc = data => {
    data.sort((first, second) => {

        if (first.profileType1 !== second.profileType1) {
            return first.profileType1 - second.profileType1;
        }

        if (first.profileType2 !== second.profileType2) {
            return first.profileType2 - second.profileType2;
        }

        if (first.interax1 !== second.interax1) {
            return first.interax1 !== second.interax1;
        }

        if (first.interax2 !== second.interax2) {
            return first.interax2 !== second.interax2;
        }

        if (first.interaxSustineri !== second.interaxSustineri) {
            return first.interaxSustineri !== second.interaxSustineri;
        }

        if (first.hMin !== second.hMin) {
            return first.hMin - second.hMin;
        }
    })
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapseNoisyPlatesInteraxAndProfileType = data => {

    let currentInterax1 = '0', currentProfileType1 = '0', currentInterax2 = '0', currentProfileType2 = '0',
        currentInteraxSustineri = '0', currentFireResistance = '0';

    sortNoisyPlatingAccordingToProfileAndInteraxDesc(data);

    data.map((plate, index) => {
        if (plate.interax1 !== currentInterax1 || plate.interax2 !== currentInterax2 || plate.interaxSustineri !== currentInteraxSustineri || plate.profileType1 !== currentProfileType1 || plate.profileType2 !== currentProfileType2 || plate.fireResistance !== currentFireResistance) {
            currentInterax1 = plate.interax1;
            currentInterax2 = plate.interax2;
            currentProfileType1 = plate.profileType1;
            currentProfileType2 = plate.profileType2;
            currentInteraxSustineri = plate.interaxSustineri;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin < data[index - 1].hMax) {
                data[index - 1].plates.map(checkingPlate => {
                    if (checkPlate(plate, checkingPlate)) {
                        data[index].plates.push(checkingPlate);
                    }
                })
            }
        }
    });

    sortNoisyPlatingAccordingToProfileAndInteraxAsc(data);

    data.map((plate, index) => {
        if (plate.interax1 !== currentInterax1 || plate.interax2 !== currentInterax2 || plate.interaxSustineri !== currentInteraxSustineri || plate.profileType1 !== currentProfileType1 || plate.profileType2 !== currentProfileType2 || plate.fireResistance !== currentFireResistance) {
            currentInterax1 = plate.interax1;
            currentInterax2 = plate.interax2;
            currentProfileType1 = plate.profileType1;
            currentProfileType2 = plate.profileType2;
            currentInteraxSustineri = plate.interaxSustineri;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin === 0 && index !== 0) {
                data[index].hMin = data[index - 1].hMax;
            }
        }
    });

    return data;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapseSpecialWallsInteraxAndProfileType = data => {

    let currentInterax1 = '0', currentProfileType1 = '0', currentInterax2 = '0', currentProfileType2 = '0',
        currentStructureLink = '0', currentFireResistance = '0';

    sortNoisyPlatingAccordingToProfileAndInteraxDesc(data);

    data.map((plate, index) => {
        if (plate.interax1 !== currentInterax1 || plate.interax2 !== currentInterax2 || plate.structureLink !== currentStructureLink || plate.profileType1 !== currentProfileType1 || plate.profileType2 !== currentProfileType2 || plate.fireResistance !== currentFireResistance) {
            currentInterax1 = plate.interax1;
            currentInterax2 = plate.interax2;
            currentProfileType1 = plate.profileType1;
            currentProfileType2 = plate.profileType2;
            currentStructureLink = plate.structureLink;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin < data[index - 1].hMax) {
                data[index - 1].plates.map(checkingPlate => {
                    if (checkPlate(plate.plates, checkingPlate)) {
                        data[index].plates.push(checkingPlate);
                    }
                })
            }
        }
    });

    sortNoisyPlatingAccordingToProfileAndInteraxAsc(data);

    data.map((plate, index) => {
        if (plate.interax1 !== currentInterax1 || plate.interax2 !== currentInterax2 || plate.structureLink !== currentStructureLink || plate.profileType1 !== currentProfileType1 || plate.profileType2 !== currentProfileType2 || plate.fireResistance !== currentFireResistance) {
            currentInterax1 = plate.interax1;
            currentInterax2 = plate.interax2;
            currentProfileType1 = plate.profileType1;
            currentProfileType2 = plate.profileType2;
            currentStructureLink = plate.structureLink;
            currentFireResistance = plate.fireResistance;
        } else {
            if (data[index].hMin === 0 && index !== 0) {
                data[index].hMin = data[index - 1].hMax;
            }
        }
    });

    return data;
}

const buildStructureNoisyPlatesInteraxAndProfileType = table => {
    let structure = extractDubleStructureData(table);
    structure.shift();

    structure = compressNoisyPlatesInteraxAndProfileType(structure);

    structure = collapseNoisyPlatesInteraxAndProfileType(structure);

    return structure;
}

const buildStructureNoisyPlatesMoistureResistance = table => {
    let structure = extractDubleStructureData(table);
    structure.shift();

    structure = compressPlatesAccordingMoistureResistance(structure);
    structure = collapsePlatesAccordingMoistureResistance(structure);

    return structure;
}

const buildStructureNoisyPlatesFireResistance = table => {
    let structure = extractDubleStructureData(table);
    structure.shift();

    structure = compressPlatesAccordingFireResistance(structure);
    structure = collapsePlatesAccordingFireResistance(structure);

    return structure;
}

const buildStructureSpecialWallsInteraxAndProfileType = table => {
    let structure = extractSpecialWalls(table);
    structure.shift();

    structure = compressSpecialWallsInteraxAndProfileType(structure);
    structure = collapseSpecialWallsInteraxAndProfileType(structure);

    return structure;
}

const buildStructureSpecialWallsMoistureResistance = table => {
    let structure = extractSpecialWalls(table);
    structure.shift();

    structure = compressPlatesAccordingMoistureResistance(structure);
    structure = collapsePlatesAccordingMoistureResistance(structure);

    return structure;
}

const buildStructureSpecialWallsFireResistance = table => {
    let structure = extractSpecialWalls(table);
    structure.shift();

    structure = compressPlatesAccordingFireResistance(structure);
    structure = collapsePlatesAccordingFireResistance(structure);

    return structure;
}


const buildStructureSpecialWallsAccordingToBurglaryResistance = table => {
    let structure = extractSpecialWalls(table);
    structure.shift();

    structure = compressPlatesAccordingBurglaryResistance(structure);
    structure = collapsePlatesAccordingBurglaryResistance(structure);
    // structure = makeStructureAccordingBurglaryResistance(structure);

    return structure;
}

const putSystemCodesNoisy = (table, importName) => {
    let structure = extractDubleStructureData(table);
    structure.shift();

    let newStructure = []

    structure.forEach(system => {
        if (system.systemCode) {
            newStructure.push({
                thickness: system.thicknessSystem,
                systemCodeTable: system.systemCode,
                systemCode: generateSystemCodeNoisyPlating(system),
                soundInsulation: system.soundInsulation,
                interaxSustineri: system.interaxSustineri,
                fireResistance: system.fireResistance,
                profileType: system.profileType,
                moistureResistance: system.moistureResistance,
                auxilary: system.auxilary,
                support: system.support,
                valueSoundInsulation: system.valueSoundInsulation,
                codSap1: system.codSap1,
                codSap2: system.codSap2,
                codSap3: system.codSap3,
                codSap4: system.codSap4,
                hMin: system.hMin,
                hMax: system.hMax,
                importName: importName,
                systemAccess: system.systemAccess,
                interax: system.interax,
                plates: {
                    face1: {
                        plate1: system.plates[0].face1[0],
                        plate2: system.plates[0].face1[1],
                        plate3: system.plates[0].face1[2],
                    },
                    face2: {
                        plate1: system.plates[0].face2[0],
                        plate2: system.plates[0].face2[1],
                        plate3: system.plates[0].face2[2],
                    }
                }
            })
        }
    })
    return newStructure;
}

const putSystemCodesSpecialWalls = (table, importName) => {
    let structure = extractSpecialWalls(table);
    structure.shift();

    let newStructure = []

    structure.forEach(system => {
        if (system.systemCode) {
            newStructure.push({
                systemCodeTable: system.systemCode,
                systemCode: generateSystemCodeSpecialWalls(system),
                thickness: system.thicknessSystem,
                fireResistance: system.fireResistance,
                profileType: system.profileType.replace('/', '').replace('-', ''),
                moistureResistance: system.moistureResistance,
                burglaryResistance: system.burglaryResistance,
                soundInsulation: system.soundInsulation,
                intermediatePlate: system.intermediatePlate,
                auxilary: system.auxilary,
                structureLink: system.structureLink,
                distance: system.distance,
                support: system.support,
                valueSoundInsulation: system.valueSoundInsulation,
                codSap1: system.codSap1,
                codSap2: system.codSap2,
                codSap3: system.codSap3,
                codSap4: system.codSap4,
                hMin: system.hMin,
                hMax: system.hMax,
                importName: importName,
                systemAccess: system.systemAccess,
                interax: system.interax,
                plates: {
                    face1: {
                        plate1: system.plates[0].face1[0],
                        plate2: system.plates[0].face1[1],
                        plate3: system.plates[0].face1[2],
                    },
                    face2: {
                        plate1: system.plates[0].face2[0],
                        plate2: system.plates[0].face2[1],
                        plate3: system.plates[0].face2[2],
                    }
                }
            })
        }
    })
    return newStructure;
}

const generateSystemCodeNoisyPlating = (system) => {
    let systemCode = "N";

    systemCode += system.thicknessSystem;
    
    if (system.interaxSustineri === 250) {
        systemCode += '.F';
    }
    if (system.interaxSustineri === 0) {
        systemCode += '.I';
    }
    if (system.interaxSustineri === 1) {
        systemCode += '.UU';
    }

    systemCode += ' s1.' + system.profileType1 + '@' + system.interax1;
    systemCode += ' s2.' + system.profileType2 + '@' + system.interax2 + ' ';

    if (system.support === 0) {
        systemCode += 'be'
    }

    if (system.support === 1) {
        systemCode += 'tc'
    }

    let grosime1, grosime2;
    let firstParenthesis = '', secondParenthesis = '';

    if (system.plates[0].face1[0] && system.plates[0].face1[0].includes(12.5)) {
        grosime1 = 12.5;
        firstParenthesis += getPlateCode(system.plates[0].face1[0]);
    } else {
        if (system.plates[0].face1[0]) {
            grosime1 = 15;
            secondParenthesis += getPlateCode(system.plates[0].face1[0]);
        }

    }

    if (system.plates[0].face1[1] && system.plates[0].face1[1].includes(12.5)) {
        firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plates[0].face1[1]);

    } else {
        if (system.plates[0].face1[1]) {
            firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plates[0].face1[1]);
        }
    }

    if (system.plates[0].face1[2] && system.plates[0].face1[2].includes(12.5)) {
        firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plates[0].face1[2]);
    } else {
        if (system.plates[0].face1[2]) {
            firstParenthesis += (firstParenthesis ? '+' : '') + getPlateCode(system.plates[0].face1[2]);
        }
    }

    if (system.plates[0].face2[0] && system.plates[0].face2[0].includes(12.5)) {
        grosime2 = 12.5;
        secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[0]);

    } else {
        if (system.plates[0].face2[0]) {
            grosime2 = 15;
            secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[0]);
        }
    }

    if (system.plates[0].face2[1] && system.plates[0].face2[1].includes(12.5)) {
        secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[1]);

    } else {
        if (system.plates[0].face2[1]) {
            secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[1]);
        }
    }

    if (system.plates[0].face2[2] && system.plates[0].face2[2].includes(12.5)) {
        secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[2]);

    } else {
        if (system.plates[0].face2[2]) {
            secondParenthesis += (secondParenthesis ? '+' : '') + getPlateCode(system.plates[0].face2[2]);
        }
    }

    systemCode += " (" + firstParenthesis + ")" + grosime1 + ' ^ (' + secondParenthesis + ")" + grosime2;

    if (system.soundInsulation > 0) {
        systemCode += ' VM' + system.soundInsulation;
    }

    if (system.fireResistance === '0' || system.fireResistance === 0) {
        systemCode += ' nonRF'
    } else {
        systemCode += ' EI' + system.fireResistance;
    }

    return systemCode;
}


const generateSystemCodeSpecialWalls = (system) => {
    let systemCode = "";

    if (system.structureLink === 1) {
        systemCode += 'S';
    }

    if (system.structureLink === 2) {
        systemCode += 'SL';
    }

    if (system.structureLink === 3) {
        systemCode += 'SLA';
    }

    systemCode += system.thicknessSystem + ' ' + system.profileType1 + '@' + system.interax1 + ' ';

    if (system.support === 0) {
        systemCode += 'be'
    }

    if (system.support === 1) {
        systemCode += 'tc'
    }

    let grosime1, grosime2;
    let firstParenthesis = '', secondParenthesis = '';

    if (system.plates[0].face1[0] && system.plates[0].face1[0].includes(12.5)) {
        grosime1 = 12.5;
        grosime2 = 15;
        firstParenthesis += getPlateCode(system.plates[0].face1[0]);
    } else {
        if (system.plates[0].face1[0]) {
            grosime1 = 15;
            grosime2 = 12.5;
            secondParenthesis += getPlateCode(system.plates[0].face1[0]);
        }

    }

    systemCode += " (";
    if (system.plates[0].face1[0]) {
        systemCode += getPlateCode(system.plates[0].face1[0]);
        if (system.plates[0].face1[0].includes(12.5)) {
            grosime1 = 12.5
        } else {
            grosime1 = 15;
        }
    }
    if (system.plates[0].face1[1]) {
        systemCode += "+" + getPlateCode(system.plates[0].face1[1]);
    }
    if (system.plates[0].face1[2]) {
        systemCode += "+" + getPlateCode(system.plates[0].face1[2])
    }
    systemCode += ")" + grosime1;
    systemCode += " ^ (";
    if (system.plates[0].face2[0]) {
        if (system.plates[0].face2[0].includes(12.5)) {
            grosime2 = 12.5
        } else {
            grosime2 = 15;
        }
        systemCode += getPlateCode(system.plates[0].face2[0]);
    }
    if (system.plates[0].face2[1]) {
        systemCode += "+" + getPlateCode(system.plates[0].face2[1]);
    }
    if (system.plates[0].face2[2]) {
        systemCode += "+" + getPlateCode(system.plates[0].face2[2]);
    }
    systemCode += ")" + grosime2;

    if (system.soundInsulation > 0) {
        systemCode += ' VM' + system.soundInsulation;
    }

    if (system.fireResistance === '0' || system.fireResistance === 0) {
        systemCode += ' nonRF'
    } else {
        systemCode += ' EI' + system.fireResistance;
    }

    if (system.burglaryResistance !== 0) {
        systemCode += ' RC' + system.burglaryResistance
    }

    return systemCode;
}

const buildStructureCeilingProfile = table => {
    let structure = extractDataCeiling(table);
    structure.shift();

    structure = compressCeilingPlate(structure);
    structure = collapseCeilingPlate(structure);

    return structure;
}


/**
 * Eliminating the plates that are doubled (according profile type and interax)
 * @param {Object} data
 */

const compressCeilingPlate = data => {
    let compressedPlates = [];

    data.forEach(plate => {
        let check = 0;
        compressedPlates.forEach((compressedPlate, index) => {
            if (compressedPlate.hMax === plate.hMax &&
                compressedPlate.interax === plate.interax &&
                compressedPlate.profileType === plate.profileType &&
                compressedPlate.fireResistance === plate.fireResistance &&
                compressedPlate.moistureResistance === plate.moistureResistance &&
                compressedPlate.ceilingType === plate.ceilingType &&
                compressedPlate.plates[0].face1.length === plate.plates[0].face1.length &&
                compressedPlate.plates[0].face2.length === plate.plates[0].face2.length) {

                if (checkPlate(compressedPlate.plates, plate.plates[0]) === true) {
                    compressedPlates[index].plates.push(plate.plates[0]);
                    check = 1;
                } else {
                    check = 2;
                }
            }
        })
        if (check === 0) {
            compressedPlates.push(plate)
        }
    });

    return compressedPlates;
}

/**
 * Collapse the plates according to height, profile type and interax ( according profile type and interax)
 * @param {Object} data
 */

const collapseCeilingPlate = data => {

    let currentInterax = 0, currentProfileType = 0, currentFireResistance = 0, currentMoistureResistance = -1,
        currentCeilingType = -1;

    sortCeilingPlatesAccordingToProfileTypeInteraxHeightDesc(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.profileType !== currentProfileType || plate.fireResistance !== currentFireResistance || plate.moistureResistance !== currentMoistureResistance || plate.ceilingType !== currentCeilingType) {
            currentInterax = plate.interax;
            currentProfileType = plate.profileType;
            currentFireResistance = plate.fireResistance;
            currentMoistureResistance = plate.moistureResistance;
            currentCeilingType = plate.ceilingType;
        } else {
            if (data[index].hMin < data[index - 1].hMax) {
                data[index - 1].plates.map(checkingPlate => {
                    if (checkPlate(plate.plates, checkingPlate) === true) {
                        data[index].plates.push(checkingPlate);
                    }
                })
            }
        }
    });

    sortCeilingPlatesAccordingToProfileTypeInteraxHeightAsc(data);

    data.map((plate, index) => {
        if (plate.interax !== currentInterax || plate.profileType !== currentProfileType || plate.fireResistance !== currentFireResistance || plate.moistureResistance !== currentMoistureResistance || plate.ceilingType !== currentCeilingType) {
            currentInterax = plate.interax;
            currentProfileType = plate.profileType;
            currentFireResistance = plate.fireResistance;
            currentMoistureResistance = plate.moistureResistance;
            currentCeilingType = plate.ceilingType;
        } else {
            if (data[index].hMin === 0) {
                data[index].hMin = data[index - 1].hMax;
            }
        }
    });

    return data;
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortCeilingPlatesAccordingToProfileTypeInteraxHeightDesc = data => {
    data.sort((first, second) => {

        if (first.ceilingType !== second.ceilingType) {
            return first.ceilingType - second.ceilingType;
        }

        if (first.plates[0].face1.length !== second.plates[0].face1.length) {
            return first.plates[0].face1.length > second.plates[0].face1.length
        }

        if (first.profileType !== second.profileType) {
            return first.profileType.localeCompare(second.profileType);
        }

        if (first.interax !== second.interax) {
            return first.interax.localeCompare(second.interax);
        }

        if (first.fireResistance !== second.fireResistance) {
            return first.fireResistance - second.fireResistance;
        }

        if (first.moistureResistance !== second.moistureResistance) {
            return first.moistureResistance - second.moistureResistance;
        }

        if (first.hMax !== second.hMax) {
            return second.hMax - first.hMax;
        }

    })
}

/**
 * Sorting Objects according to Profile Type, Interax and Height (in this order, ascending, but descendent at height)
 * @param {Object} data
 */

const sortCeilingPlatesAccordingToProfileTypeInteraxHeightAsc = data => {
    data.sort((first, second) => {

        if (first.ceilingType !== second.ceilingType) {
            return first.ceilingType - second.ceilingType;
        }

        if (first.plates[0].face1.length !== second.plates[0].face1.length) {
            return first.plates[0].face1.length > second.plates[0].face1.length
        }

        if (second.profileType !== first.profileType) {
            return second.profileType.localeCompare(first.profileType);
        }

        if (second.interax !== first.interax) {
            return second.interax.localeCompare(first.interax);
        }

        if (second.fireResistance !== first.fireResistance) {
            return second.fireResistance - first.fireResistance;
        }

        if (second.moistureResistance !== first.moistureResistance) {
            return second.moistureResistance > first.moistureResistance;
        }

        if (second.hMax !== first.hMax) {
            return first.hMax - second.hMax;
        }

    })
}

const importProducts = (table, importName, language) => {
    table.unshift([' ']);

    // get 'produse externe' row
    let rowExternalProd = 2;
    for (let row = 2; row < table.length; row++) {
        if (table[row][1] && table[row][1].toString().includes('Produse externe')) {
            rowExternalProd = row;
        }
    }

    let products = [];
    for (let row = 2; row < table.length; row++) {
        let product = {};
        if (!table[row][importService.productCols.codSap]) {
            continue;
        }

        Object.entries(importService.productCols).forEach(([key, value]) => {
            if (table[row][importService.productCols[key]] !== undefined) {
                product[key] = `${ table[row][importService.productCols[key]].toString().trim() }`;
            }
        });

        if (row > rowExternalProd) {
            product.type = 'extern';
        } else {
            product.type = 'intern';
        }
        product.importName = importName;
        product.language = language;

        products.push(product);
    }
    return products;
}

const buildStructureConsumptions = (table, importName, products) => {
    table.unshift([' ']);

    // get filled rows - distinct products
    let filledRows = [];
    let rowUpperGrip = 2;
    for (let index = 2; index < table.length; index++) {
        if (table[index][0] && table[index][0] !== '(**)') {
            filledRows.push(index);
        }
        if (table[index][1] && table[index][1].toString().includes('Prindere partea superioara')) {
            rowUpperGrip = index;
        }
    }

    let cols = {};
    if (importName.includes('Noisy')) {
        cols = importService.noisyCols;
    } else if (importName.includes('Separativi')) {
        cols = importService.wallSCols;
    } else if (importName.includes('Plafoane')) {
        cols = importService.ceilCols;
    } else if (importName.includes('Placari')) {
        cols = importService.plateCols;
    } else {
        cols = importService.wallDCols;
    }

    let arr = [];
    filledRows.forEach((value, index, filledRows) => {
        // fix last row
        let loopEndValue = filledRows[index + 1];
        if (value === filledRows[filledRows.length - 1]) {
            loopEndValue = value + 5;
        }
        for (let index = value; index < loopEndValue; index++) {
            if (table[index] === undefined) {
                continue;
            }
            if (importName.includes('Plafoane')) {
                if (!table[index][17] || !table[index][18]) {
                    continue;
                }
            } else if (importName.includes('Noisy')) {
                if (!table[index][16] || !table[index][17]) {
                    continue;
                }
            } else if (importName.includes('Separativi')) {
                if (!table[index][19] || !table[index][20]) {
                    continue;
                }
            } else {
                if (!table[index][14] || !table[index][15]) {
                    continue;
                }
            }

            let consumption = {};
            let conditions = {};

            let findProduct = products.find(el => el.codSap === `${ table[value][cols.codSap].toString().trim() }`);
            if (!findProduct) {
                if (!table[value][cols.codSap].toString().trim().includes('cod')) {
                    console.log(`product not found - codSap: ${ table[value][cols.codSap].toString().trim() } => excel row : ${ index }`);
                    continue;
                }
            }

            // import name
            consumption.importName = importName;

            // denumire produs
            if (findProduct && findProduct.name) {
                consumption.productName = findProduct.name;
            } else {
                consumption.productName = '';
            }

            // categorie produs
            if (findProduct && findProduct.category) {
                consumption.category = findProduct.category;
            } else {
                consumption.category = '';
            }

            // unitate masura per unitate
            if (findProduct && findProduct.excelUM) {
                consumption.unitMeasure = findProduct.excelUM;
            } else {
                consumption.unitMeasure = '';
            }

            // pret per unitate
            if (findProduct && findProduct.price) {
                consumption.price = findProduct.price;
            } else {
                consumption.price = '';
            }

            // greutate per unitate
            if (findProduct && findProduct.weight) {
                consumption.weight = findProduct.weight;
            } else {
                consumption.weight = '';
            }

            // cod sap
            if (table[index][cols.codSap] !== undefined) {
                let codSap = `${ table[index][cols.codSap].toString().trim() }`;
                if (codSap.includes('^')) {
                    codSap = codSap.split("^").join("");
                    consumption.codSap = codSap;
                } else {
                    consumption.codSap = codSap;
                }
            } else if (table[value][cols.codSap] !== undefined) {
                let codSap = `${ table[value][cols.codSap].toString().trim() }`;
                if (codSap.includes('^')) {
                    codSap = codSap.split("^").join("");
                    consumption.codSap = codSap;
                } else {
                    consumption.codSap = codSap;
                }
            }

            // cantitate
            if (table[index][cols.quantity] !== undefined) {
                let quantity = `${ table[index][cols.quantity].toString().trim() }`;
                if (quantity.includes('/H')) {
                    consumption.quantityFormula = quantity.replace('/H', '');
                } else {
                    consumption.quantity = quantity;
                }
            }

            // pereti S
            if (table[index][cols.thickness] !== undefined) {
                let thickness = `${ table[index][cols.thickness].toString().trim() }`;
                if (thickness.includes('<>')) {
                    thickness = thickness.replace('<>', '!==');
                }
                conditions.thickness = thickness;
            }

            // profile type
            if (importName.includes('Plafoane')) {
                // plafoane
                if (table[index][cols.profileType] !== undefined) {
                    let primaryProfileType = `${ table[index][cols.profileType].toString().trim() }`;
                    if (primaryProfileType.includes('<>')) {
                        primaryProfileType = primaryProfileType.replace('<>', '!==');
                    }
                    conditions.primaryProfileType = primaryProfileType;
                }
                if (table[index][cols.profileType2] !== undefined) {
                    let secondaryProfileType = `${ table[index][cols.profileType2].toString().trim() }`;
                    if (secondaryProfileType.includes('<>')) {
                        secondaryProfileType = secondaryProfileType.replace('<>', '!==');
                    }
                    conditions.secondaryProfileType = secondaryProfileType;
                }
            } else if (importName.includes('Noisy')) {
                // noisy
                let profileType = '';
                if (table[index][cols.profileType] !== undefined) {
                    profileType = `${ table[index][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                } else {
                    for (let z = index; z >= value; z--) {
                        if (table[z][cols.profileType] !== undefined) {
                            profileType = `${ table[z][cols.profileType].toString().trim() }`;
                            if (profileType.includes('<>')) {
                                profileType = profileType.replace('<>', '!==');
                            }
                            break;
                        }
                    }
                }
                let profileType2 = '';
                if (table[index][cols.profileType2] !== undefined) {
                    profileType2 = `${ table[index][cols.profileType2].toString().trim() }`;
                    if (profileType2.includes('<>')) {
                        profileType2 = profileType2.replace('<>', '!==');
                    }
                } else {
                    for (let z = index; z >= value; z--) {
                        if (table[z][cols.profileType2] !== undefined) {
                            profileType2 = `${ table[z][cols.profileType2].toString().trim() }`;
                            if (profileType2.includes('<>')) {
                                profileType2 = profileType2.replace('<>', '!==');
                            }
                            break;
                        }
                    }
                }
                if (profileType !== '') {
                    conditions.primaryProfileType = profileType;
                }
                if (profileType2 !== '') {
                    conditions.secondaryProfileType = profileType2;
                }
            } else if (importName.includes('Placari')) {
                // placari
                let profileType = '';
                if (table[index][cols.profileType] !== undefined) {
                    profileType = `${ table[index][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                } else {
                    for (let z = index; z >= value; z--) {
                        if (table[z][cols.profileType] !== undefined) {
                            profileType = `${ table[z][cols.profileType].toString().trim() }`;
                            if (profileType.includes('<>')) {
                                profileType = profileType.replace('<>', '!==');
                            }
                            break;
                        }
                    }
                }
                if (profileType) {
                    conditions.profileType = profileType;
                }
            } else if (importName.includes('Separativi')) {
                // pereti S
                let profileType = '';
                if (table[index][cols.profileType] !== undefined) {
                    profileType = `${ table[index][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                } else if (table[value][cols.profileType] !== undefined) {
                    profileType = `${ table[value][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                }
                if (profileType) {
                    conditions.profileType = profileType;
                }
            } else {
                // pereti D
                if (table[index][cols.profileType] !== undefined) {
                    let profileType = `${ table[index][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                    conditions.profileType = profileType;
                } else if (table[value][cols.profileType]) {
                    let profileType = `${ table[value][cols.profileType].toString().trim() }`;
                    if (profileType.includes('<>')) {
                        profileType = profileType.replace('<>', '!==');
                    }
                    conditions.profileType = profileType;
                }
            }

            // interax
            if (importName.includes('Plafoane') || importName.includes('Noisy')) {
                // plafoane
                if (table[index][cols.interax] !== undefined) {
                    conditions.primaryInterax = `${ table[index][cols.interax].toString().trim() }`;
                }
                if (table[index][cols.interax2] !== undefined) {
                    conditions.secondaryInterax = `${ table[index][cols.interax2].toString().trim() }`;
                }
            } else if (importName.includes('Noisy')) {
                // noisy
                let interax = '';
                if (table[index][cols.interax] !== undefined) {
                    interax = `${ table[index][cols.interax].toString().trim() }`;
                }
                if (table[index][cols.interax2] !== undefined) {
                    interax += `/${ table[index][cols.interax2].toString().trim() }`;
                }
                if (interax) {
                    conditions.interax = interax;
                }
            } else if (importName.includes('Separativi')) {
                // pereti S
                let interax = '';
                if (table[index][cols.interax] !== undefined) {
                    interax = `${ table[index][cols.interax].toString().trim() }`;
                }
                // if (table[index][cols.interax2] !== undefined) {
                //     interax += `/${ table[index][cols.interax2].toString().trim() }`;
                // }
                if (interax) {
                    conditions.interax = interax;
                }
            } else {
                // plafoane, pereti D
                if (table[index][cols.interax] !== undefined) {
                    conditions.interax = `${ table[index][cols.interax].toString().trim() }`;
                }
            }

            // pereti S
            // distanta intre structuri
            if (table[index][cols.distance] !== undefined) {
                let distance = `${ table[index][cols.distance].toString().trim() }`;
                if (distance.includes('<>')) {
                    distance = distance.replace('<>', '!==');
                }
                conditions.distance = distance;
            }

            // pereti S
            // legatura structuri
            if (table[index][cols.structureLink] !== undefined) {
                let structureLink = `${ table[index][cols.structureLink].toString().trim() }`;
                if (structureLink.includes('<>')) {
                    structureLink = structureLink.replace('<>', '!==');
                }
                conditions.structureLink = structureLink;
            }

            // placari, noisy, plafoane
            // interax sustinere
            if (table[index][cols.interaxSustineri] !== undefined) {
                let interaxSustineri = `${ table[index][cols.interaxSustineri].toString().trim() }`;
                if (interaxSustineri.includes('<>')) {
                    interaxSustineri = interaxSustineri.replace('<>', '!==');
                }
                conditions.interaxSustineri = interaxSustineri;
            }

            // plafoane
            // placa de baza
            if (table[index][cols.basePlate] !== undefined) {
                let basePlate = `${ table[index][cols.basePlate].toString().trim() }`;
                if (basePlate.includes('<>')) {
                    basePlate = basePlate.replace('<>', '!==');
                }
                conditions.basePlate = basePlate;
            }

            // plafoane
            // tip sustinere
            if (table[index][cols.ceilingSupport] !== undefined) {
                let ceilingSupport = `${ table[index][cols.ceilingSupport].toString().trim() }`;
                if (ceilingSupport.includes('<>')) {
                    ceilingSupport = ceilingSupport.replace('<>', '!==');
                }
                conditions.ceilingSupport = ceilingSupport;
            }


            // Hmin
            if (table[index][cols.heightMin] !== undefined) {
                let heightMin = `${ table[index][cols.heightMin].toString().trim() }`;
                if (heightMin.includes('<>')) {
                    heightMin = heightMin.replace('<>', '!==');
                }
                conditions.heightMin = heightMin;
            }

            // Hmax
            if (table[index][cols.heightMax] !== undefined) {
                let heightMax = `${ table[index][cols.heightMax].toString().trim() }`;
                if (heightMax.includes('<>')) {
                    heightMax = heightMax.replace('<>', '!==');
                }
                conditions.heightMax = heightMax;
            }

            // suport
            if (table[index][cols.support] !== undefined) {
                let support = `${ table[index][cols.support].toString().trim() }`;
                if (support.includes('<>')) {
                    support = support.replace('<>', '!==');
                }
                conditions.support = support;
            }

            // vata
            if (table[index][cols.soundInsulation] !== undefined) {
                let soundInsulation = `${ table[index][cols.soundInsulation].toString().trim() }`;
                if (soundInsulation === '0') {
                    conditions.soundInsulation = 'fara';
                } else {
                    conditions.soundInsulation = `cu ${ soundInsulation }`;
                }
            }

            // rez foc
            if (table[index][cols.fireResistance] !== undefined) {
                let fireResistance = `${ table[index][cols.fireResistance].toString().trim() }`;
                if (fireResistance.includes('<>')) {
                    fireResistance = fireResistance.replace('<>', '!==');
                }
                conditions.fireResistance = fireResistance;
            }

            // rez umid
            if (table[index][cols.moistureResistance] !== undefined) {
                let moistureResistance = `${ table[index][cols.moistureResistance].toString().trim() }`;
                if (moistureResistance.includes('<>')) {
                    moistureResistance = moistureResistance.replace('<>', '!==');
                }
                if (moistureResistance.toString().includes('e') && index > rowUpperGrip) {
                    conditions.consumptionType = 'exterior';
                }
                conditions.moistureResistance = moistureResistance;
            }

            // grosime placa
            if (table[index][cols.depthPlate] !== undefined) {
                let depthPlate = `${ table[index][cols.depthPlate].toString().trim() }`;
                if (depthPlate.includes('<>')) {
                    depthPlate = depthPlate.replace('<>', '!==');
                }
                conditions.depthPlate = depthPlate;
            }

            // finisare
            if (table[index][cols.finishing] !== undefined) {
                let finishing = `${ table[index][cols.finishing].toString().trim() }`;
                if (finishing.includes('<>')) {
                    finishing = finishing.replace('<>', '!==');
                }
                conditions.finishing = finishing;
            }

            // pereti D, pereti S
            // antiefractie
            if (table[index][cols.burglaryResistance] !== undefined) {
                let burglaryResistance = `${ table[index][cols.burglaryResistance].toString().trim() }`;
                if (burglaryResistance.includes('<>')) {
                    burglaryResistance = burglaryResistance.replace('<>', '!==');
                }
                conditions.burglaryResistance = burglaryResistance;
            }

            // auxiliar
            if (table[index][cols.accessory] !== undefined) {
                conditions.accessory = `${ table[index][cols.accessory].toString().trim() }`;
            }

            // tip consum
            if (!conditions.consumptionType) {
                if (index > rowUpperGrip) {
                    conditions.consumptionType = 'exterior';
                } else {
                    conditions.consumptionType = 'interior';
                }
            }

            consumption.conditions = conditions;
            arr.push(consumption);
        }
    });

    return arr;
}

module.exports = {
    buildStructureNoisyPlatesFireResistance,
    putSystemCodesNoisy,
    buildStructureNoisyPlatesMoistureResistance,
    buildStructureNoisyPlatesInteraxAndProfileType,
    buildStructurePlatesAccordingToProfileTypeAndInteraxPlating,
    buildStructurePlatesAccordingToProfileTypeAndInterax,
    buildStructurePlatesAccordingToBurglaryResistance,
    buildStructurePlatesAccordingToFireResistance,
    buildStructurePlatesAccordingToMoistureResistance,
    buildStructureConsumptions,
    updateConsumptions,
    importProducts,
    buildAllowedPlatesArray,
    createError,
    logResponse,
    getMessage,
    generateToken,
    upload,
    deleteUpload,
    checkFormat,
    getFileType,
    // resizeImage,
    deleteFileOnPod,
    deleteImage,
    getFileExtension,
    sortArray,
    autoImportEnvVariables,
    getUploadUrl,
    uploadFileOnPod,
    parseCodeMessage,
    castToObjectId,
    uploader,
    uploadMediaToWP,
    getTextBasedOnLanguage,
    mailTo,
    transformImageUrlToAccessibleUrl,
    compareIds,
    getSheetTabIndex,
    putSystemCodes,
    extractDataPlacari,
    compressPlatesAccordingProfileTypeAndInteraxPlating,
    sortPlatesAccordingToProfileTypeInteraxHeightDescPlating,
    sortPlatesAccordingToFireResistanceHeightDescPlating,
    buildStructurePlatesAccordingToFireResistancePlating,
    buildStructurePlatesAccordingToMoistureResistancePlating,
    generateSystemCodePlating,
    buildStructurePlatesAccordingToInteraxSustineriPlating,
    putSystemCodesPlating,
    buildStructureSpecialWallsInteraxAndProfileType,
    buildStructureSpecialWallsMoistureResistance,
    buildStructureSpecialWallsFireResistance,
    buildStructureSpecialWallsAccordingToBurglaryResistance,
    putSystemCodesSpecialWalls,
    extractDataCeiling,
    buildStructureCeilingProfile,
    putSystemCodesCeiling,
};
