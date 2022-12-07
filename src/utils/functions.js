const { vehiclesTemplateHeaders } = require("./constants");
const XLSX = require("xlsx");


/**
 * Take the vehicles readFile and check if the file has broken headers, is empty or the file is ready to be save to the database.
 * @param {File} readFile -  example: result of -> XLSX.readFile(path) 
 * @returns success: boolean, empty: boolean, brokenHeaders: boolean, data: Array
 */
function verifyVehicleImportHeaders(readFile) {
  let brokenHeaders = [];

  let excelHeaders = XLSX.utils.sheet_to_json(readFile.Sheets["Sheet1"], {
    header: 1,
    blankrows: false,
  })[0];

  excelHeaders = excelHeaders.map((header) => header.toLowerCase());

  for (let header of vehiclesTemplateHeaders) {
    if (!excelHeaders.includes(header)) {
      brokenHeaders.push(header);
    }
  }

  if (!brokenHeaders.length) {
    const excelData = Object.keys(readFile.Sheets).map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(readFile.Sheets[name]),
    }));

    if(!excelData[0].data.length) {
        return { success: false, empty: true, brokenHeaders: false, data: [] };
    }

    return { success: true, empty: false, brokenHeaders: false, data: excelData[0].data };
  } else {
    return { success: false, empty: false, brokenHeaders: true, data: brokenHeaders };
  }
};

module.exports = {
  verifyVehicleImportHeaders,
};
