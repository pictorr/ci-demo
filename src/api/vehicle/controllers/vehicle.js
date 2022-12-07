'use strict';
const XLSX = require('xlsx') ;
const { verifyVehicleImportHeaders } = require('../../../utils/functions');

/**
 * vehicle controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vehicle.vehicle', ({strapi}) => ({
    async importVehicles(ctx) {
        const { request: { body, files: { files } = {} } } = ctx;
        ctx.body = {};
        ctx.body.brokenHeaders = [];
        ctx.body.empty = [];
        ctx.body.error = [];
        ctx.body.success = [];

        if(!files) {
            ctx.status = 400;
            ctx.body.error.push('No file found');
            return ctx;
        }

        const path = files.path;

        if(!path) {
            ctx.status = 400;
            ctx.body.error.push('No path found');
            return ctx;
        }

        //reading the file by the path
        const readFile = XLSX.readFile(path);

        //Verify if the file has broken headers is empty or can be saved to the database
        const { success, empty, brokenHeaders, data } = verifyVehicleImportHeaders(readFile);

        //if the file has no broken headers and is not empty
        if(success) {
            //calling the vehicle service for saving the vehicles in database
            const results = await strapi.service('api::vehicle.vehicle').importVehicles(data);

            ctx.status = 200;
            ctx.body.success = 'File imported successfully';
            ctx.body.data = results;

            delete ctx.body.error;
            delete ctx.body.brokenHeaders;
            delete ctx.body.empty;

            return ctx;
        } else {
            //if the file has no rows and is empty 
            //empty !== broken headers
            if(empty) {
                ctx.body.empty = 'Import file is empty';

                delete ctx.body.brokenHeaders;
            }

            //if the file has broken headers
            if (brokenHeaders) {
                ctx.body.brokenHeaders = data;

                delete ctx.body.empty;
            }

            ctx.status = 400;
            delete ctx.body.success;

            return ctx;
        }
    }
}));

