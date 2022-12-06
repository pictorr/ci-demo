const utilityService = require('../utilityService.js');

const DEFAULT_ROW_HEIGHT = 12;
const DEFAULT_COL_WIDTH = 10;

const COL_A_WIDTH = 5; // 1/2 * default
const COL_B_WIDTH = 15; // 3/2 * default
const COL_C_WIDTH = 30; // 3 * default
const COL_ALL_WIDTH = 125;

// old to remove
const ALLROWSLENGTH = 150;
const ROW3LENGTH = 36;

const systemObj = {
    systemType: '',
    numberOfPlates: '',
    liningsType: '',
    wallsType: '',
}

const workbookOptions = {
    defaultFont: {
        name: 'Arial',
        size: 8,
    },
    dateFormat: 'dd/mm/yyyy hh:mm:ss',
    author: 'Siniat Administrator',
};

const worksheetOptions = {
    'margins': { // Accepts a Double in Inches
        'bottom': 0.4,
        'left': 1.0,
        'right': 0.4,
        'top': 0.4
    },
    printOptions: {
        centerHorizontal: true,
        centerVertical: true,
    },
    pageSetup: {
        paperSize: 'A4_PAPER',
    },
    sheetView: {
        showGridLines: false,
        zoomScale: 120,
    },
    sheetFormat: {
        defaultColWidth: DEFAULT_COL_WIDTH,
        defaultRowHeight: DEFAULT_ROW_HEIGHT,
    },
    // sheetProtection: {
        // selectedLockedCells: true
    // }
};

const initialStyles = {
    alignment: {
        horizontal: 'left',
        vertical: 'center',
        wrapText: false,
    },
    font: {
        bold: false,
        color: 'black',
        italics: false,
    },
    numberFormat: '@',
};

const message = (label, language) => {
    return utilityService.parseCodeMessage(label, language).message;
}

const getSystemType = (offer) => {
    let offerInfo = {...systemObj};

    if (offer.systemName.toLowerCase().includes('plafoane')) {
        offerInfo.systemType = 'ceilings';
    } else if (offer.systemName.toLowerCase().includes('placari')) {
        offerInfo.systemType = 'linings';
    } else {
        offerInfo.systemType = 'walls';
    }

    if (offer.systemName.toLowerCase().includes('cvadruplu') || offer.systemName.toLowerCase().includes('cvadruple')) {
        offerInfo.numberOfPlates = 'quadruple';
    } else if (offer.systemName.toLowerCase().includes('triplu') || offer.systemName.toLowerCase().includes('triple')) {
        offerInfo.numberOfPlates = 'triple';
    } else if (offer.systemName.toLowerCase().includes('dublu') || offer.systemName.toLowerCase().includes('duble')) {
        offerInfo.numberOfPlates = 'double';
    } else if (offer.systemName.toLowerCase().includes('simplu') || offer.systemName.toLowerCase().includes('simple')) {
        offerInfo.numberOfPlates = 'simple';
    }

    if (offerInfo.systemType === 'walls') {
        if (offer.systemName.toLowerCase().includes('pereti sl')) {
            offerInfo.wallsType = 'wallsSL';
        }
    }

    if (offerInfo.systemType === 'linings') {
        if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('fixari')) {
            offerInfo.liningsType = 'noisyFixing';
        } else if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('independente')) {
            offerInfo.liningsType = 'noisyIndependent';
        } else if (offer.systemName.toLowerCase().includes('noisy') && offer.systemName.toLowerCase().includes('uu')) {
            offerInfo.liningsType = 'noisyUU';
        } else if (offer.systemName.toLowerCase().includes('fixari')) {
            offerInfo.liningsType = 'fixing';
        } else if (offer.systemName.toLowerCase().includes('independente')) {
            offerInfo.liningsType = 'independent';
        } else if (offer.systemName.toLowerCase().includes('liniare')) {
            offerInfo.liningsType = 'linear';
        } else if (offer.systemName.toLowerCase().includes('lipire')) {
            offerInfo.liningsType = 'plasting';
        }
    }

    return offerInfo;
}

const setLogo = (ws, row) => {
    let path = `${global.ROOT_PATH}/resources/generale/logo_small.png`;
    addTwoCellAnchorImage(ws, path, row, 8, row + 1, 10);
    ws.row(row).setHeight(DEFAULT_ROW_HEIGHT * 2.95);
    row += 2;

    return row;
}

const setLogoCentral = (ws, row) => {
    let path = `${global.ROOT_PATH}/resources/generale/logo_small.png`;
    addTwoCellAnchorImage(ws, path, row, 6, row + 1, 8);
    ws.row(row).setHeight(DEFAULT_ROW_HEIGHT * 2.95);
    row += 2;

    return row;
}

const setLogoNoSpace = (ws, row) => {
    let path = `${global.ROOT_PATH}/resources/generale/logo_small.png`;
    addTwoCellAnchorImage(ws, path, row, 8, row + 1, 10);
    ws.row(row).setHeight(DEFAULT_ROW_HEIGHT * 2.95);
    row += 1;

    return row;
}

const addOneCellAnchorImage = (ws, path, rowFrom, columnFrom) => {
    ws.addImage({
        path: path,
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: columnFrom,
                colOff: 0,
                row: rowFrom,
                rowOff: 0,
            },
        },
    });
    return true;
}

const addTwoCellAnchorImage = (ws, path, rowFrom, colFrom, rowTo, colTo) => {
    ws.addImage({
        path: path,
        type: 'picture',
        position: {
            type: 'twoCellAnchor',
            from: {
                col: colFrom,
                colOff: 0,
                row: rowFrom,
                rowOff: 0,
            },
            to: {
                col: colTo,
                colOff: 0,
                row: rowTo,
                rowOff: 0,
            },
        },
    });
    return true;
}

const addTwoCellAnchorImageWithOffset = (ws, path, rowFrom, colFrom, rowTo, colTo) => {
    ws.addImage({
        path: path,
        type: 'picture',
        position: {
            type: 'twoCellAnchor',
            from: {
                col: colFrom,
                colOff: '.1mm',
                row: rowFrom,
                rowOff: '.1mm',
            },
            to: {
                col: colTo,
                colOff: 0,
                row: rowTo,
                rowOff: 0,
            },
        },
    });
    return true;
}

module.exports = {
    DEFAULT_ROW_HEIGHT,
    DEFAULT_COL_WIDTH,
    COL_A_WIDTH,
    COL_B_WIDTH,
    COL_C_WIDTH,
    COL_ALL_WIDTH,
    workbookOptions,
    worksheetOptions,
    initialStyles,
    message,
    getSystemType,
    setLogo,
    setLogoCentral,
    setLogoNoSpace,
    addTwoCellAnchorImage,
    addTwoCellAnchorImageWithOffset,
    // old
    ALLROWSLENGTH,
    ROW3LENGTH,
};