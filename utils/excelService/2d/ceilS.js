const fs = require('fs');
const xl = require('excel4node');
const xlUtils = require('../excelUtils');
const systemService = require('../../systemService');

// main function
const setCeilS = (ws, row, offer, products, language) => {
    // set logo
    row = xlUtils.setLogo(ws, row);

    // ceilingSupport type
    // 1 - brida
    // 2 - tirant
    // 3 - nonius
    // 4 - tija m8
    // 5 - racord lemn
    // 6 - brida ac

    // ceilings_s_plates_s_interax_s_support_1 => 981 / 534 = 1.84
    // ceilings_s_plates_s_interax_s_support_1_img2 => 1047 / 505 = 2.07
    // ceilings_s_plates_s_interax_s_support_2 => 758 / 538 = 1.41
    // ceilings_s_plates_s_interax_s_support_2_img2 => 1405 / 958 = 1.47
    // ceilings_s_plates_s_interax_s_support_3 => 804 / 536 = 1.5
    // ceilings_s_plates_s_interax_s_support_3_img2 => 853 / 536 = 1.59
    // ceilings_s_plates_s_interax_s_support_5 => 1789 / 962 = 1.86
    // ceilings_s_plates_s_interax_s_support_5_img2 => 1565 / 920 = 1.70
    // ceilings_s_plates_s_interax_s_support_6 => 838 / 535 = 1.57
    // ceilings_s_plates_s_interax_s_support_6_img2 => 1716 / 967 = 1.77

    // ceilings_s_plates_s_interax_d_support_1 => 894 / 539 = 1.67
    // ceilings_s_plates_s_interax_d_support_1_img2 => 947 / 532 = 1.78
    // ceilings_s_plates_s_interax_d_support_2 => 712 / 537 = 1.33
    // ceilings_s_plates_s_interax_d_support_2_img2 => 770 / 534 = 1.44
    // ceilings_s_plates_s_interax_d_support_3 => 772 / 538 = 1.43
    // ceilings_s_plates_s_interax_d_support_3_img2 => 791 / 537 = 1.47
    // ceilings_s_plates_s_interax_d_support_4 => 732 / 532 = 1.38
    // ceilings_s_plates_s_interax_d_support_4_img2 => 865 / 528 = 1.64
    // ceilings_s_plates_s_interax_d_support_6 => 800 / 541 = 1.48
    // ceilings_s_plates_s_interax_d_support_6_img2 => 861 / 537 = 1.60

    // ceilings_s_plates_d_interax_s_support_1 => 932 / 540 = 1.73
    // ceilings_s_plates_d_interax_s_support_1_img2 => 1053 / 511 = 2.06
    // ceilings_s_plates_d_interax_s_support_2 => 733 / 541 = 1.35
    // ceilings_s_plates_d_interax_s_support_2_img2 => 843 / 537 = 1.57
    // ceilings_s_plates_d_interax_s_support_3 => 787 / 528 = 1.49
    // ceilings_s_plates_d_interax_s_support_3_img2 => 838 / 536 = 1.56
    // ceilings_s_plates_d_interax_s_support_5 => 1714 / 963 = 1.78
    // ceilings_s_plates_d_interax_s_support_5_img2 => 1589 / 934 = 1.80
    // ceilings_s_plates_d_interax_s_support_6 => 839 / 533 = 1.57
    // ceilings_s_plates_d_interax_s_support_6_img2 => 1711 / 958 = 1.79

    // ceilings_s_plates_d_interax_d_support_1 => 890 / 541 = 1.65
    // ceilings_s_plates_d_interax_d_support_1_img2 => 912 / 536 = 1.70
    // ceilings_s_plates_d_interax_d_support_2 => 703 / 543 = 1.29
    // ceilings_s_plates_d_interax_d_support_2_img2 => 790 / 540 = 1.46
    // ceilings_s_plates_d_interax_d_support_3 => 731 / 534 = 1.37
    // ceilings_s_plates_d_interax_d_support_3_img2 => 781 / 538 = 1.45
    // ceilings_s_plates_d_interax_d_support_4 => 725 / 536 = 1.35
    // ceilings_s_plates_d_interax_d_support_4_img2 => 863 / 539 = 1.60
    // ceilings_s_plates_d_interax_d_support_6 => 783 / 538 = 1.46
    // ceilings_s_plates_d_interax_d_support_6_img2 => 822 / 536 = 1.53

    // ceilings_s_plates_t_interax_s_support_1 => 938 / 536 = 1.75
    // ceilings_s_plates_t_interax_s_support_1_img2 => 1049 / 524 = 2.00
    // ceilings_s_plates_t_interax_s_support_3 => 799 / 541 = 1.48
    // ceilings_s_plates_t_interax_s_support_3_img2 => 811 / 536 = 1.51

    // ceilings_s_plates_t_interax_d_support_1 => 879 / 540 = 1.63
    // ceilings_s_plates_t_interax_d_support_1_img2 => 872 / 537 = 1.62
    // ceilings_s_plates_t_interax_d_support_3 => 728 / 537 = 1.36
    // ceilings_s_plates_t_interax_d_support_3_img2 => 750 / 537 = 1.40
    // ceilings_s_plates_t_interax_d_support_4 => 700 / 539 = 1.30
    // ceilings_s_plates_t_interax_d_support_4_img2 => 813 / 541 = 1.50

    // ceilings_s_plates_q_interax_s_support_1 => 917 / 537 = 1.71
    // ceilings_s_plates_q_interax_s_support_1_img2 => 985 / 533 = 1.85
    // ceilings_s_plates_q_interax_s_support_3 => 784 / 540 = 1.45
    // ceilings_s_plates_q_interax_s_support_3_img2 => 798 / 537 = 1.49

    // ceilings_s_plates_q_interax_d_support_1 => 871 / 536 = 1.63
    // ceilings_s_plates_q_interax_d_support_1_img2 => 839 / 537 = 1.56
    // ceilings_s_plates_q_interax_d_support_3 => 744 / 540 = 1.38
    // ceilings_s_plates_q_interax_d_support_3_img2 => 713 / 533 = 1.34
    // ceilings_s_plates_q_interax_d_support_4 => 673 / 537 = 1.25
    // ceilings_s_plates_q_interax_d_support_4_img2 => 794 / 540 = 1.47

    const offerInfo = systemService.getSystemType(offer);

    let path = `${global.ROOT_PATH}/resources/2d/ceilings/`;
    path += `ceilings_${offerInfo.ceilingsType}`;
    path += `_plates_${offerInfo.numberOfPlates}`;

    // interax
    if (offer.profileType.split('/')[0] === '-') {
        path += '_interax_s';
    } else {
        path += '_interax_d';
    }

    if (offer.ceilingSupport.toLowerCase().includes('brida ac')) {
        path += '_support_6';
    } else if (offer.ceilingSupport.toLowerCase().includes('racord')) {
        path += '_support_5';
    } else if (offer.ceilingSupport.toLowerCase().includes('tija')) {
        path += '_support_4';
    } else if (offer.ceilingSupport.toLowerCase().includes('nonius')) {
        path += '_support_3';
    } else if (offer.ceilingSupport.toLowerCase().includes('tirant')) {
        path += '_support_2';
    } else if (offer.ceilingSupport.toLowerCase().includes('brida')) {
        path += '_support_1';
    }

    let path1 = `${path}.png`;
    let path2 = `${path}_img2.png`;

    let fileNameNoExtension = path1.replace(`${global.ROOT_PATH}/resources/2d/ceilings/`, '');
    fileNameNoExtension = fileNameNoExtension.replace('.png', '');

    let fileNameNoExtension2 = path2.replace(`${global.ROOT_PATH}/resources/2d/ceilings/`, '');
    fileNameNoExtension2 = fileNameNoExtension2.replace('.png', '');

    let colStart = 2;
    let colEnd = 8;
    let colEnd2 = 8;
    let rowEnd = 20;
    let rowEnd2 = 20;

    // c2-9 / r22 => 5.69 / 3.33 = 1.71
    // c2-8 / r20 => 5.16 / 3.33 = 1.55

    switch (fileNameNoExtension) {
        case 'ceilings_s_plates_s_interax_s_support_1':
        case 'ceilings_s_plates_s_interax_s_support_5':
            rowEnd = 17;
            break;
        case 'ceilings_s_plates_d_interax_s_support_1':
        case 'ceilings_s_plates_t_interax_s_support_1':
        case 'ceilings_s_plates_q_interax_s_support_1':
            rowEnd = 18;
            break;
        case 'ceilings_s_plates_s_interax_d_support_1':
        case 'ceilings_s_plates_d_interax_d_support_1':
        case 'ceilings_s_plates_t_interax_d_support_1':
        case 'ceilings_s_plates_q_interax_d_support_1':
            rowEnd = 19;
            break;
        case 'ceilings_s_plates_s_interax_d_support_6':
        case 'ceilings_s_plates_d_interax_d_support_6':
        case 'ceilings_s_plates_t_interax_s_support_3':
        case 'ceilings_s_plates_q_interax_s_support_3':
            rowEnd = 21;
            break;
        case 'ceilings_s_plates_s_interax_s_support_2':
        case 'ceilings_s_plates_s_interax_s_support_6':
            rowEnd = 22;
            break;
        case 'ceilings_s_plates_s_interax_d_support_2':
        case 'ceilings_s_plates_d_interax_s_support_2':
        case 'ceilings_s_plates_d_interax_d_support_3':
        case 'ceilings_s_plates_d_interax_d_support_4':
        case 'ceilings_s_plates_t_interax_d_support_3':
            rowEnd = 23;
            break;
        case 'ceilings_s_plates_d_interax_d_support_2':
        case 'ceilings_s_plates_t_interax_d_support_4':
            rowEnd = 24;
            break;
        case 'ceilings_s_plates_q_interax_d_support_4':
            rowEnd = 25;
            break;
        case 'ceilings_s_plates_d_interax_s_support_5':
            colEnd = 9;
            rowEnd = 19;
            break;
        case 'ceilings_s_plates_s_interax_s_support_3':
        case 'ceilings_s_plates_d_interax_s_support_3':
            colEnd = 9;
            rowEnd = 23;
            break;
        case 'ceilings_s_plates_s_interax_d_support_3':
            colEnd = 9;
            rowEnd = 24;
            break;
        case 'ceilings_s_plates_s_interax_d_support_4':
        case 'ceilings_s_plates_q_interax_d_support_3':
            colEnd = 9;
            rowEnd = 25;
            break;
    }

    switch (fileNameNoExtension2) {
        case 'ceilings_s_plates_s_interax_s_support_1_img2':
        case 'ceilings_s_plates_d_interax_s_support_1_img2':
            rowEnd2 = 15;
            break;
        case 'ceilings_s_plates_d_interax_s_support_5_img2':
        case 'ceilings_s_plates_q_interax_s_support_1_img2':
            rowEnd2 = 17;
            break;
        case 'ceilings_s_plates_d_interax_d_support_1_img2':
            rowEnd2 = 18;
            break;
        case 'ceilings_s_plates_s_interax_s_support_3_img2':
        case 'ceilings_s_plates_s_interax_d_support_4_img2':
        case 'ceilings_s_plates_s_interax_d_support_6_img2':
        case 'ceilings_s_plates_d_interax_d_support_4_img2':
        case 'ceilings_s_plates_t_interax_d_support_1_img2':
            rowEnd2 = 19;
            break;
        case 'ceilings_s_plates_s_interax_s_support_2_img2':
        case 'ceilings_s_plates_s_interax_d_support_3_img2':
        case 'ceilings_s_plates_d_interax_d_support_2_img2':
        case 'ceilings_s_plates_d_interax_d_support_3_img2':
        case 'ceilings_s_plates_q_interax_d_support_4_img2':
            rowEnd2 = 21;
            break;
        case 'ceilings_s_plates_t_interax_d_support_3_img2':
            rowEnd2 = 22;
            break;
        case 'ceilings_s_plates_q_interax_d_support_3_img2':
            rowEnd2 = 23;
            break;
        case 'ceilings_s_plates_t_interax_s_support_1_img2':
            colEnd2 = 9;
            rowEnd2 = 17;
            break;
        case 'ceilings_s_plates_s_interax_s_support_6_img2':
        case 'ceilings_s_plates_s_interax_d_support_1_img2':
        case 'ceilings_s_plates_d_interax_s_support_6_img2':
            colEnd2 = 9;
            rowEnd2 = 19;
            break;
        case 'ceilings_s_plates_s_interax_s_support_5_img2':
            colEnd2 = 9;
            break;
        case 'ceilings_s_plates_t_interax_s_support_3_img2':
        case 'ceilings_s_plates_t_interax_d_support_4_img2':
        case 'ceilings_s_plates_q_interax_s_support_3_img2':
            colEnd2 = 9;
            rowEnd2 = 23;
            break;
        case 'ceilings_s_plates_s_interax_d_support_2_img2':
            colEnd2 = 9;
            rowEnd2 = 24;
            break;
    }

    if (fs.existsSync(path1)) {
        xlUtils.addTwoCellAnchorImage(ws, path1, row, colStart, row + rowEnd, colEnd);
        row = row + rowEnd;
    }
    if (fs.existsSync(path2)) {
        xlUtils.addTwoCellAnchorImage(ws, path2, row, colStart, row + rowEnd2, colEnd2);
        row = row + rowEnd2 + 1;
    }

    ws.addPageBreak('row', row - 1);

    return row;
}

module.exports = {
    setCeilS
};