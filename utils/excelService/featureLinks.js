const xlUtils = require("./excelUtils");
const systemService = require("../systemService");

const texts = {

    // walls

    walls_d_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-pereti-gips-carton-inalti-siniat/pi38774/original/brosura-pereti-gips-carton-inalti-siniat.pdf',
    walls_d_booklet_label: 'Brosura pereti',
    walls_d_plates_s_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-d2x1---detalii-generale-072021.pdf/pi317428/original/nida-system-d2x1---detalii-generale-072021.pdf',
    walls_d_plates_s_pdf_label: 'pereti simplu placati',
    walls_d_plates_s_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-d-simplu-placat---detalii-cad.dwg/pi317564/original/perete-tip-d-simplu-placat---detalii-cad.dwg',
    walls_d_plates_s_dwg_label: 'pereti simplu placati',
    walls_d_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-d2x2---detalii-tehnice-082021.pdf/pi317430/original/nida-system-d2x2---detalii-tehnice-082021.pdf',
    walls_d_plates_d_pdf_label: 'pereti dublu placati',
    walls_d_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-d-dublu-placat---detalii-cad.dwg/pi317563/original/perete-tip-d-dublu-placat---detalii-cad.dwg',
    walls_d_plates_d_dwg_label: 'pereti dublu placati',
    walls_d_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-d2x3---detalii-tehnice-082021.pdf/pi317452/original/nida-system-d2x3---detalii-tehnice-082021.pdf',
    walls_d_plates_t_pdf_label: 'pereti triplu placati',
    walls_d_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-d-triplu-placat---detalii-cad.dwg/pi317548/original/perete-tip-d-triplu-placat---detalii-cad.dwg',
    walls_d_plates_t_dwg_label: 'pereti triplu placati',

    walls_s_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-pereti-gips-carton-inalti-siniat/pi38774/original/brosura-pereti-gips-carton-inalti-siniat.pdf',
    walls_s_booklet_label: 'Brosura pereti',
    walls_s_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-dublu-placat---detalii-tehnice.pdf/pi329859/original/perete-tip-s-dublu-placat---detalii-tehnice.pdf',
    walls_s_plates_d_pdf_label: 'pereti S dublu placati',
    walls_s_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-dublu-placat---detalii-cad.dwg/pi329858/original/perete-tip-s-dublu-placat---detalii-cad.dwg',
    walls_s_plates_d_dwg_label: 'pereti S dublu placati',
    walls_s_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-triplu-placat---detalii-tehnice.pdf/pi329863/original/perete-tip-s-triplu-placat---detalii-tehnice.pdf',
    walls_s_plates_t_pdf_label: 'pereti S triplu placati',
    walls_s_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-triplu-placat---detalii-cad.dwg/pi329862/original/perete-tip-s-triplu-placat---detalii-cad.dwg',
    walls_s_plates_t_dwg_label: 'pereti S triplu placati',
    walls_s_asimetric_pdf: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-asimetric-placat---detalii-tehnice.pdf/pi329866/original/perete-tip-s-asimetric-placat---detalii-tehnice.pdf',
    walls_s_asimetric_pdf_label: 'pereti S asimetrici',
    walls_s_asimetric_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-asimetric-placat---detalii-cad.dwg/pi329864/original/perete-tip-s-asimetric-placat---detalii-cad.dwg',
    walls_s_asimetric_dwg_label: 'pereti S asimetrici',
    walls_s_intermediar_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-dublu-intermediar---detalii-tehnice.pdf/pi329857/original/perete-tip-s-dublu-intermediar---detalii-tehnice.pdf',
    walls_s_intermediar_plates_d_pdf_label: 'pereti S dublu placati si placa intermediara',
    walls_s_intermediar_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-dublu-intermediar---detalii-cad.dwg/pi329865/original/perete-tip-s-dublu-intermediar---detalii-cad.dwg',
    walls_s_intermediar_plates_d_dwg_label: 'pereti S dublu placati si placa intermediara',
    walls_s_intermediar_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-triplu-intemediar---detalii-tehnice.pdf/pi329860/original/perete-tip-s-triplu-intemediar---detalii-tehnice.pdf',
    walls_s_intermediar_plates_t_pdf_label: 'pereti S triplu placati si placa intermediara',
    walls_s_intermediar_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/perete-tip-s-triplu-intemediar---detalii-cad.dwg/pi329861/original/perete-tip-s-triplu-intemediar---detalii-cad.dwg',
    walls_s_intermediar_plates_t_dwg_label: 'pereti S triplu placati si placa intermediara',

    walls_sl_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-pereti-gips-carton-inalti-siniat/pi38774/original/brosura-pereti-gips-carton-inalti-siniat.pdf',
    walls_sl_booklet_label: 'Brosura pereti',
    // walls_sl_plates_s_pdf: '',
    // walls_sl_plates_s_pdf_label: '',
    // walls_sl_plates_s_dwg: '',
    // walls_sl_plates_s_dwg_label: '',
    walls_sl_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/perete-separativ-dublu-placat---detalii-tehnice-72021bis.pdf/pi316935/original/perete-separativ-dublu-placat---detalii-tehnice-72021bis.pdf',
    walls_sl_plates_d_pdf_label: 'pereti SL dublu placati',
    walls_sl_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/perete-separativ-dublu-placat-detalii-cad-siniat-072021.dwg/pi315650/original/perete-separativ-dublu-placat-detalii-cad-siniat-072021.dwg',
    walls_sl_plates_d_dwg_label: 'pereti SL dublu placati',
    walls_sl_plates_t_pdf: 'https://www.siniat.ro/-/dam/siniat_perete_sl2x3_triplu_placat-detalii_generale.pdf/pi315711/original/siniat_perete_sl2x3_triplu_placat-detalii_generale.pdf?v=-1641161671',
    walls_sl_plates_t_pdf_label: 'pereti SL triplu placati',
    walls_sl_plates_t_dwg: 'https://www.siniat.ro/-/dam/siniat_perete_sl2x3_triplu_placat-detalii_generale.dwg/pi315651/original/siniat_perete_sl2x3_triplu_placat-detalii_generale.dwg?v=-1641161671',
    walls_sl_plates_t_dwg_label: 'pereti SL triplu placati',

    walls_sla_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-pereti-gips-carton-inalti-siniat/pi38774/original/brosura-pereti-gips-carton-inalti-siniat.pdf',
    walls_sla_booklet_label: 'Brosura pereti',
    // walls_sla_plates_t_pdf: '',
    walls_sla_plates_t_pdf_label: 'pereti SLA triplu placati',
    // walls_sla_plates_t_dwg: '',
    walls_sla_plates_t_dwg_label: 'pereti SLA triplu placati',

    // linnings

    linnings_f_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_f_booklet_label: 'Brosura placari',
    linnings_f_profile_cd_plates_s_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t1.cd-ei---detalii-tehnice.pdf/pi324906/original/placari-nida-system-t1.cd-ei---detalii-tehnice.pdf',
    linnings_f_profile_cd_plates_s_pdf_label: 'placari cu fixari simple',
    linnings_f_profile_cd_plates_s_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t1.cd-fix-ei---detalii-cad.dwg/pi324819/original/nida-system-t1.cd-fix-ei---detalii-cad.dwg',
    linnings_f_profile_cd_plates_s_dwg_label: 'placari cu fixari simple',
    linnings_f_profile_cd_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.cd-fix-ei---detalii-tehnice.pdf/pi324813/original/placari-nida-system-t2.cd-fix-ei---detalii-tehnice.pdf',
    linnings_f_profile_cd_plates_d_pdf_label: 'placari cu fixari duble',
    linnings_f_profile_cd_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t2.cd-fix-ei---detalii-cad.dwg/pi324823/original/nida-system-t2.cd-fix-ei---detalii-cad.dwg',
    linnings_f_profile_cd_plates_d_dwg_label: 'placari cu fixari duble',
    linnings_f_profile_cd_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.cd-fix-ei---detalii-tehnice.pdf/pi324811/original/placari-nida-system-t3.cd-fix-ei---detalii-tehnice.pdf',
    linnings_f_profile_cd_plates_t_pdf_label: 'placari cu fixari triple',
    linnings_f_profile_cd_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t3.cw.f-ei---detalii-cad.dwg/pi324822/original/nida-system-t3.cw.f-ei---detalii-cad.dwg',
    linnings_f_profile_cd_plates_t_dwg_label: 'placari cu fixari triple',
    linnings_f_profile_cd_plates_q_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t4.cd-fix-ei---detalii-tehnice.pdf/pi324814/original/placari-nida-system-t4.cd-fix-ei---detalii-tehnice.pdf',
    linnings_f_profile_cd_plates_q_pdf_label: 'placari cu fixari qvadruple',
    linnings_f_profile_cd_plates_q_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t4.cd-fix-ei---detalii-cad.dwg/pi324824/original/nida-system-t4.cd-fix-ei---detalii-cad.dwg',
    linnings_f_profile_cd_plates_q_dwg_label: 'placari cu fixari qvadruple',
    linnings_f_profile_cw_plates_s_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t1.cw.f---detalii-tehnice.pdf/pi324804/original/placari-nida-system-t1.cw.f---detalii-tehnice.pdf',
    linnings_f_profile_cw_plates_s_pdf_label: 'placari cu fixari simple',
    linnings_f_profile_cw_plates_s_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t1.cw.f-ei---detalii-cad.dwg/pi324815/original/nida-system-t1.cw.f-ei---detalii-cad.dwg',
    linnings_f_profile_cw_plates_s_dwg_label: 'placari cu fixari simple',
    linnings_f_profile_cw_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.cw.f---detalii-tehnice.pdf/pi324810/original/placari-nida-system-t2.cw.f---detalii-tehnice.pdf',
    linnings_f_profile_cw_plates_d_pdf_label: 'placari cu fixari duble',
    linnings_f_profile_cw_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t2.cw.f---detalii-cad.dwg/pi324821/original/nida-system-t2.cw.f---detalii-cad.dwg?v=-1945928931',
    linnings_f_profile_cw_plates_d_dwg_label: 'placari cu fixari duble',
    linnings_f_profile_cw_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.cw.f-ei---detalii-tehnice.pdf/pi324812/original/placari-nida-system-t3.cw.f-ei---detalii-tehnice.pdf',
    linnings_f_profile_cw_plates_t_pdf_label: 'placari cu fixari triple',
    linnings_f_profile_cw_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t3.cw.f-ei---detalii-cad.dwg/pi324822/original/nida-system-t3.cw.f-ei---detalii-cad.dwg',
    linnings_f_profile_cw_plates_t_dwg_label: 'placari cu fixari triple',
    linnings_f_profile_cw_plates_q_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t4.cw.f-ei---detalii-tehnice.pdf/pi324808/original/placari-nida-system-t4.cw.f-ei---detalii-tehnice.pdf',
    linnings_f_profile_cw_plates_q_pdf_label: 'placari cu fixari qvadruple',
    linnings_f_profile_cw_plates_q_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t4.cw.f-ei---detalii-cad.dwg/pi324818/original/nida-system-t4.cw.f-ei---detalii-cad.dwg',
    linnings_f_profile_cw_plates_q_dwg_label: 'placari cu fixari qvadruple',

    linnings_i_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_i_booklet_label: 'Brosura placari',
    linnings_i_plates_s_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t1.cw.i-ei---detalii-tehnice.pdf/pi324907/original/placari-nida-system-t1.cw.i-ei---detalii-tehnice.pdf',
    linnings_i_plates_s_pdf_label: 'placari independente simple',
    linnings_i_plates_s_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t1.cw.i-ei---detalii-cad.dwg/pi324877/original/nida-system-t1.cw.i-ei---detalii-cad.dwg',
    linnings_i_plates_s_dwg_label: 'placari independente simple',
    linnings_i_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.cw.i---detalii-tehnice.pdf/pi324904/original/placari-nida-system-t2.cw.i---detalii-tehnice.pdf',
    linnings_i_plates_d_pdf_label: 'placari independente duble',
    linnings_i_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t2.cw.i-ei---detalii-cad.dwg/pi324881/original/nida-system-t2.cw.i-ei---detalii-cad.dwg',
    linnings_i_plates_d_dwg_label: 'placari independente duble',
    linnings_i_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.cw.i-ei---detalii-tehnice.pdf/pi324905/original/placari-nida-system-t3.cw.i-ei---detalii-tehnice.pdf',
    linnings_i_plates_t_pdf_label: 'placari independente triple',
    linnings_i_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t3.cw.i-ei---detalii-cad.dwg/pi324870/original/nida-system-t3.cw.i-ei---detalii-cad.dwg',
    linnings_i_plates_t_dwg_label: 'placari independente triple',
    linnings_i_plates_q_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t4.cw.i-ei---detalii-tehnice.pdf/pi324910/original/placari-nida-system-t4.cw.i-ei---detalii-tehnice.pdf',
    linnings_i_plates_q_pdf_label: 'placari independente qvadruple',
    linnings_i_plates_q_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-t4.cw.i-ei---detalii-cad.dwg/pi324873/original/nida-system-t4.cw.i-ei---detalii-cad.dwg',
    linnings_i_plates_q_dwg_label: 'placari independente qvadruple',

    linnings_l_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_l_booklet_label: 'Brosura placari',
    linnings_l_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.w25---detalii-tehnice.pdf/pi324802/original/placari-nida-system-t2.w25---detalii-tehnice.pdf',
    linnings_l_plates_d_pdf_label: 'placari liniare duble',
    linnings_l_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.w25.dwg/pi324798/original/placari-nida-system-t2.w25.dwg',
    linnings_l_plates_d_dwg_label: 'placari liniare duble',
    linnings_l_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.w25---detalii-tehnice.pdf/pi324803/original/placari-nida-system-t3.w25---detalii-tehnice.pdf',
    linnings_l_plates_t_pdf_label: 'placari liniare triple',
    linnings_l_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.w25.dwg/pi324799/original/placari-nida-system-t3.w25.dwg',
    linnings_l_plates_t_dwg_label: 'placari liniare triple',
    linnings_l_plates_q_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t4.w25---detalii-tehnice.pdf/pi324801/original/placari-nida-system-t4.w25---detalii-tehnice.pdf',
    linnings_l_plates_q_pdf_label: 'placari liniare qvadruple',
    linnings_l_plates_q_dwg: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t4.w25.dwg/pi324800/original/placari-nida-system-t4.w25.dwg',
    linnings_l_plates_q_dwg_label: 'placari liniare qvadruple',

    linnings_nf_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_nf_booklet_label: 'Brosura placari',
    linnings_nf_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-noisy-n3.f---detalii-tehnice.pdf/pi326367/original/nida-system-noisy-n3.f---detalii-tehnice.pdf',
    linnings_nf_plates_t_pdf_label: 'placari Noisy cu fixari triple',
    linnings_nf_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-noisy-n3.if.dwg/pi326255/original/nida-system-noisy-n3.if.dwg',
    linnings_nf_plates_t_dwg_label: 'placari Noisy cu fixari triple',

    linnings_ni_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_ni_booklet_label: 'Brosura placari',
    linnings_ni_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-n2.i---detalii-tehnice.pdf/pi326374/original/nida-system-n2.i---detalii-tehnice.pdf',
    linnings_ni_plates_d_pdf_label: 'placari Noisy independente duble',
    linnings_ni_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-noisy-n2.i---detalii-cad.dwg/pi326369/original/nida-system-noisy-n2.i---detalii-cad.dwg',
    linnings_ni_plates_d_dwg_label: 'placari Noisy independente duble',
    linnings_ni_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/nida-system-n3.i---detalii-tehnice/pi326373/original/nida-system-n3.i---detalii-tehnice.pdf',
    linnings_ni_plates_t_pdf_label: 'placari Noisy independente triple',
    linnings_ni_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/nida-system-n3.if---detalii-cad.dwg/pi326370/original/nida-system-n3.if---detalii-cad.dwg?v=869811517',
    linnings_ni_plates_t_dwg_label: 'placari Noisy independente triple',

    linnings_nuu_booklet: 'https://etexassets.azureedge.net/-/dam/brosura-placari-2020-web/pi38772/original/brosura-placari-2020-web.pdf?v=1020935976',
    linnings_nuu_booklet_label: 'Brosura placari',
    linnings_nuu_plates_d_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t2.uu---detalii-tehnice.pdf/pi323724/original/placari-nida-system-t2.uu---detalii-tehnice.pdf',
    linnings_nuu_plates_d_pdf_label: 'placari Noisy UU duble',
    linnings_nuu_plates_d_dwg: 'https://etexassets.azureedge.net/-/dam/placare-nida-system-t.2.uu.dwg/pi323722/original/placare-nida-system-t.2.uu.dwg',
    linnings_nuu_plates_d_dwg_label: 'placari Noisy UU duble',
    linnings_nuu_plates_t_pdf: 'https://etexassets.azureedge.net/-/dam/placari-nida-system-t3.uu---detalii-tehnice.pdf/pi323725/original/placari-nida-system-t3.uu---detalii-tehnice.pdf',
    linnings_nuu_plates_t_pdf_label: 'placari Noisy UU triple',
    linnings_nuu_plates_t_dwg: 'https://etexassets.azureedge.net/-/dam/placare-nida-system-t.3.uu.dwg/pi323723/original/placare-nida-system-t.3.uu.dwg',
    linnings_nuu_plates_t_dwg_label: 'placari Noisy UU triple',

    // ceilings

    ceilings_s_booklet: 'https://etexassets.azureedge.net/-/dam/plafoane-suspendate-din-gips-carton-cu-si-fara-rezistenta-la-foc/pi117053/original/plafoane-suspendate-din-gipscarton-cu-si-fara-rezistenta-la-foc.pdf?v=2100864297',
    ceilings_s_booklet_label: 'Brosura plafoane',

    ceilings_s_plates_s_profile_s_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s1.brida-reglabila---detalii-tehnice.pdf/pi326496/original/plafon-p1.s1.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_s_support_1_pdf_label: 'plafoane suspendate  simple structura simpla  cu brida',
    ceilings_s_plates_s_profile_s_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.br/pi38814/original/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.br.dwg',
    ceilings_s_plates_s_profile_s_support_1_dwg_label: 'plafoane suspendate  simple structura simpla  cu brida',
    ceilings_s_plates_s_profile_s_support_2_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s1.tirant---detalii-tehnice.pdf/pi326498/original/plafon-p1.s1.tirant---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_s_support_2_pdf_label: 'plafoane suspendate  simple structura simpla  cu tirant',
    ceilings_s_plates_s_profile_s_support_2_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.t/pi38815/original/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.t.dwg',
    ceilings_s_plates_s_profile_s_support_2_dwg_label: 'plafoane suspendate  simple structura simpla  cu tirant',
    ceilings_s_plates_s_profile_s_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s1.nonius---detalii-tehnice.pdf/pi326499/original/plafon-p1.s1.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_s_support_3_pdf_label: 'plafoane suspendate  simple structura simpla cu nonius',
    ceilings_s_plates_s_profile_s_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei30-nida-system-p1.s1.cd-ud.n/pi38768/original/cad-plafon-suspendat-ei30-nida-system-p1.s1.cd-ud.n.dwg',
    ceilings_s_plates_s_profile_s_support_3_dwg_label: 'plafoane suspendate  simple structura simpla  cu nonius',
    // ceilings_s_plates_s_profile_s_support_4_pdf: '',
    // ceilings_s_plates_s_profile_s_support_4_pdf_label: '',
    // ceilings_s_plates_s_profile_s_support_4_dwg: '',
    // ceilings_s_plates_s_profile_s_support_4_dwg_label: '',
    ceilings_s_plates_s_profile_s_support_6_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s1.brida-acustica---detalii-tehnice.pdf/pi326495/original/plafon-p1.s1.brida-acustica---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_s_support_6_pdf_label: 'plafoane suspendate  simple structura simpla  cu brida acustica',
    ceilings_s_plates_s_profile_s_support_6_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.ba/pi38810/original/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.ba.dwg?v=1007846316',
    ceilings_s_plates_s_profile_s_support_6_dwg_label: 'plafoane suspendate  simple structura simpla  cu brida acustica',
    // ceilings_s_plates_s_profile_s_support_5_pdf: '',
    // ceilings_s_plates_s_profile_s_support_5_pdf_label: '',
    ceilings_s_plates_s_profile_s_support_5_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.rl/pi38813/original/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.rl.dwg',
    ceilings_s_plates_s_profile_s_support_5_dwg_label: 'plafoane suspendate  simple structura simpla  cu racord lemn',
    ceilings_s_plates_s_profile_d_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s2.brida-reglabila---detalii-tehnice.pdf/pi326474/original/plafon-p1.s2.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_d_support_1_pdf_label: 'plafoane suspendate   structura dubla cu brida',
    ceilings_s_plates_s_profile_d_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.br/pi38817/original/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.br.dwg',
    ceilings_s_plates_s_profile_d_support_1_dwg_label: 'plafoane suspendate   structura dubla cu brida',
    ceilings_s_plates_s_profile_d_support_2_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s2.tirant---detalii-tehnice.pdf/pi326475/original/plafon-p1.s2.tirant---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_d_support_2_pdf_label: 'plafoane suspendate   structura dubla cu tirant',
    ceilings_s_plates_s_profile_d_support_2_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.t/pi38819/original/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.t.dwg',
    ceilings_s_plates_s_profile_d_support_2_dwg_label: 'plafoane suspendate   structura dubla cu tirant',
    ceilings_s_plates_s_profile_d_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s2.nonius---detalii-tehnice.pdf/pi326473/original/plafon-p1.s2.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_d_support_3_pdf_label: 'plafoane suspendate   structura dubla cu nonius',
    ceilings_s_plates_s_profile_d_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.n/pi38818/original/cad-plafon-suspendat-nida-system-p1.s2.cd-ud.n.dwg',
    ceilings_s_plates_s_profile_d_support_3_dwg_label: 'plafoane suspendate   structura dubla cu nonius',
    ceilings_s_plates_s_profile_d_support_4_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s2.ua-cd---detalii-tehnice.pdf/pi326478/original/plafon-p1.s2.ua-cd---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_d_support_4_pdf_label: 'plafoane suspendate   structura dubla cu tija M8',
    ceilings_s_plates_s_profile_d_support_4_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s2.ua-cd/pi38820/original/cad-plafon-suspendat-nida-system-p1.s2.ua-cd.dwg',
    ceilings_s_plates_s_profile_d_support_4_dwg_label: 'plafoane suspendate   structura dubla cu tija M8',
    ceilings_s_plates_s_profile_d_support_6_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p1.s2.brida-acustica---detalii-tehnice.pdf/pi326500/original/plafon-p1.s2.brida-acustica---detalii-tehnice.pdf',
    ceilings_s_plates_s_profile_d_support_6_pdf_label: 'plafoane suspendate   structura dubla cu brida acustica',
    ceilings_s_plates_s_profile_d_support_6_dwg: 'https://etexassets.azureedge.net/-/dam/plafon-nida-p1.s2.brida-acustica---detalii-cad.dwg/pi326382/original/plafon-nida-p1.s2.brida-acustica---detalii-cad.dwg',
    ceilings_s_plates_s_profile_d_support_6_dwg_label: 'plafoane suspendate   structura dubla cu brida acustica',
    // ceilings_s_plates_s_profile_d_support_5_pdf: '',
    // ceilings_s_plates_s_profile_d_support_5_pdf_label: '',
    // ceilings_s_plates_s_profile_d_support_5_dwg: '',
    // ceilings_s_plates_s_profile_d_support_5_dwg_label: '',

    ceilings_s_plates_d_profile_s_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s1.brida-reglabila---detalii-tehnice.pdf/pi326477/original/plafon-p2.s1.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_s_support_1_pdf_label: 'plafoane suspendate  duble structura simpla  cu brida',
    ceilings_s_plates_d_profile_s_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.br/pi38822/original/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.br.dwg',
    ceilings_s_plates_d_profile_s_support_1_dwg_label: 'plafoane suspendate  duble structura simpla  cu brida',
    ceilings_s_plates_d_profile_s_support_2_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s1.tirant---detalii-tehnice.pdf/pi326480/original/plafon-p2.s1.tirant---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_s_support_2_pdf_label: 'plafoane suspendate  duble structura simpla  cu tirant',
    ceilings_s_plates_d_profile_s_support_2_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.t/pi38815/original/cad-plafon-suspendat-nida-system-p1.s1.cd-ud.t.dwg',
    ceilings_s_plates_d_profile_s_support_2_dwg_label: 'plafoane suspendate  duble structura simpla  cu tirant',
    ceilings_s_plates_d_profile_s_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s1.nonius---detalii-tehnice.pdf/pi326479/original/plafon-p2.s1.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_s_support_3_pdf_label: 'plafoane suspendate  duble structura simpla  cu nonius',
    ceilings_s_plates_d_profile_s_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei60-nida-system-p2.s1.cd-ud.n/pi38789/original/cad-plafon-suspendat-ei60-nida-system-p2.s1.cd-ud.n.dwg',
    ceilings_s_plates_d_profile_s_support_3_dwg_label: 'plafoane suspendate  duble structura simpla  cu nonius',
    // ceilings_s_plates_d_profile_s_support_4_pdf: '',
    // ceilings_s_plates_d_profile_s_support_4_pdf_label: '',
    // ceilings_s_plates_d_profile_s_support_4_dwg: '',
    // ceilings_s_plates_d_profile_s_support_4_dwg_label: '',
    ceilings_s_plates_d_profile_s_support_6_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s1.brida-acustica---detalii-tehnice.pdf/pi326476/original/plafon-p2.s1.brida-acustica---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_s_support_6_pdf_label: 'plafoane suspendate  duble structura simpla  cu brida acustica',
    ceilings_s_plates_d_profile_s_support_6_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.ba/pi38821/original/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.ba.dwg',
    ceilings_s_plates_d_profile_s_support_6_dwg_label: 'plafoane suspendate  duble structura simpla  cu brida acustica',
    // ceilings_s_plates_d_profile_s_support_5_pdf: '',
    // ceilings_s_plates_d_profile_s_support_5_pdf_label: '',
    ceilings_s_plates_d_profile_s_support_5_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.rl/pi38825/original/cad-plafon-suspendat-nida-system-p2.s1.cd-ud.rl.dwg',
    ceilings_s_plates_d_profile_s_support_5_dwg_label: 'plafoane suspendate  duble structura simpla  cu racord lemn',
    ceilings_s_plates_d_profile_d_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s2.brida-reglabila---detalii-tehnice.pdf/pi326482/original/plafon-p2.s2.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_d_support_1_pdf_label: 'plafoane suspendate  duble structura dubla cu brida',
    ceilings_s_plates_d_profile_d_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p2.s2.cd-ud.br/pi38828/original/cad-plafon-suspendat-nida-system-p2.s2.cd-ud.br.dwg',
    ceilings_s_plates_d_profile_d_support_1_dwg_label: 'plafoane suspendate  duble structura dubla cu brida',
    ceilings_s_plates_d_profile_d_support_2_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s2.tirant---detalii-tehnice.pdf/pi326484/original/plafon-p2.s2.tirant---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_d_support_2_pdf_label: 'plafoane suspendate  duble structura dubla cu tirant',
    ceilings_s_plates_d_profile_d_support_2_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei60-nida-system-p2.s2.cd-ud.t/pi38795/original/cad-plafon-suspendat-ei60-nida-system-p2.s2.cd-ud.t.dwg',
    ceilings_s_plates_d_profile_d_support_2_dwg_label: 'plafoane suspendate  duble structura dubla cu tirant',
    ceilings_s_plates_d_profile_d_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s2.nonius---detalii-tehnice.pdf/pi326483/original/plafon-p2.s2.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_d_support_3_pdf_label: 'plafoane suspendate  duble structura dubla cu nonius',
    ceilings_s_plates_d_profile_d_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei30-nida-system-p1.s1.cd-ud.n/pi38768/original/cad-plafon-suspendat-ei30-nida-system-p1.s1.cd-ud.n.dwg',
    ceilings_s_plates_d_profile_d_support_3_dwg_label: 'plafoane suspendate  duble structura dubla cu nonius',
    ceilings_s_plates_d_profile_d_support_4_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s2.ua-cd---detalii-tehnice.pdf/pi326486/original/plafon-p2.s2.ua-cd---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_d_support_4_pdf_label: 'plafoane suspendate  duble structura dubla cu tija M8',
    ceilings_s_plates_d_profile_d_support_4_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p2.s2.ua-cd/pi38832/original/cad-plafon-suspendat-nida-system-p2.s2.ua-cd.dwg',
    ceilings_s_plates_d_profile_d_support_4_dwg_label: 'plafoane suspendate  duble structura dubla cu tija M8',
    ceilings_s_plates_d_profile_d_support_6_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p2.s2.brida-acustica---detalii-tehnice.pdf/pi326481/original/plafon-p2.s2.brida-acustica---detalii-tehnice.pdf',
    ceilings_s_plates_d_profile_d_support_6_pdf_label: 'plafoane suspendate  duble structura dubla cu brida acustica',
    ceilings_s_plates_d_profile_d_support_6_dwg: 'https://etexassets.azureedge.net/-/dam/plafon-nida-p2.s2.brida-acustica---detalii-cad.dwg/pi326383/original/plafon-nida-p2.s2.brida-acustica---detalii-cad.dwg',
    ceilings_s_plates_d_profile_d_support_6_dwg_label: 'plafoane suspendate  duble structura dubla cu brida acustica',
    // ceilings_s_plates_d_profile_d_support_5_pdf: '',
    // ceilings_s_plates_d_profile_d_support_5_pdf_label: '',
    // ceilings_s_plates_d_profile_d_support_5_dwg: '',
    // ceilings_s_plates_d_profile_d_support_5_dwg_label: '',

    ceilings_s_plates_t_profile_s_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p3.s1.brida-reglabila---detalii-tehnice.pdf/pi326485/original/plafon-p3.s1.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_t_profile_s_support_1_pdf_label: 'plafoane suspendate  triple structura simpla  cu brida',
    ceilings_s_plates_t_profile_s_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei60-nida-system-p3.s1.cd-ud.br/pi38798/original/cad-plafon-suspendat-ei60-nida-system-p3.s1.cd-ud.br.dwg',
    ceilings_s_plates_t_profile_s_support_1_dwg_label: 'plafoane suspendate  triple structura simpla  cu brida',
    ceilings_s_plates_t_profile_s_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p3.s1.nonius---detalii-tehnice.pdf/pi326487/original/plafon-p3.s1.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_t_profile_s_support_3_pdf_label: 'plafoane suspendate  triple structura simpla  cu nonius',
    ceilings_s_plates_t_profile_s_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei60-nida-system-p3.s1.cd-ud.n/pi38799/original/cad-plafon-suspendat-ei60-nida-system-p3.s1.cd-ud.n.dwg',
    ceilings_s_plates_t_profile_s_support_3_dwg_label: 'plafoane suspendate  triple structura simpla  cu nonius',
    // ceilings_s_plates_t_profile_s_support_4_pdf: '',
    // ceilings_s_plates_t_profile_s_support_4_pdf_label: '',
    // ceilings_s_plates_t_profile_s_support_4_dwg: '',
    // ceilings_s_plates_t_profile_s_support_4_dwg_label: '',
    ceilings_s_plates_t_profile_d_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p3.s2.brida-reglabila---detalii-tehnice.pdf/pi326489/original/plafon-p3.s2.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_t_profile_d_support_1_pdf_label: 'plafoane suspendate  triple structura dubla  cu brida',
    ceilings_s_plates_t_profile_d_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei90-nida-system-p3.s2.cd-ud.br/pi38807/original/cad-plafon-suspendat-ei90-nida-system-p3.s2.cd-ud.br.dwg',
    ceilings_s_plates_t_profile_d_support_1_dwg_label: 'plafoane suspendate   structura dubla  cu brida',
    ceilings_s_plates_t_profile_d_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p3.s2.nonius---detalii-tehnice.pdf/pi326488/original/plafon-p3.s2.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_t_profile_d_support_3_pdf_label: 'plafoane suspendate  triple structura dubla  cu nonius',
    ceilings_s_plates_t_profile_d_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei90-nida-system-p3.s2.cd-ud.n/pi38811/original/cad-plafon-suspendat-ei90-nida-system-p3.s2.cd-ud.n.dwg',
    ceilings_s_plates_t_profile_d_support_3_dwg_label: 'plafoane suspendate   structura dubla  cu nonius',
    ceilings_s_plates_t_profile_d_support_4_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p3.s2.ua-cd---detalii-tehnice.pdf/pi326491/original/plafon-p3.s2.ua-cd---detalii-tehnice.pdf',
    ceilings_s_plates_t_profile_d_support_4_pdf_label: 'plafoane suspendate  triple structura dubla  cu tija M8',
    ceilings_s_plates_t_profile_d_support_4_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-ei60-nida-system-p3.s2.ua-cd/pi38803/original/cad-plafon-suspendat-ei60-nida-system-p3.s2.ua-cd.dwg',
    ceilings_s_plates_t_profile_d_support_4_dwg_label: 'plafoane suspendate   structura dubla  cu Detalii DWG plafoane suspendate   structura dubla  cu nonius',

    ceilings_s_plates_q_profile_s_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p4.s1.brida-reglabila---detalii-tehnice.pdf/pi326490/original/plafon-p4.s1.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_q_profile_s_support_1_pdf_label: 'plafoane suspendate  qvadruple structura simpla  cu brida',
    ceilings_s_plates_q_profile_s_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p4.s1.cd-ud.br-cad/pi38833/original/cad-plafon-suspendat-nida-system-p4.s1.cd-ud.br-cad.dwg',
    ceilings_s_plates_q_profile_s_support_1_dwg_label: 'plafoane suspendate  qvadruple structura simpla  cu brida',
    ceilings_s_plates_q_profile_s_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p4.s1.nonius---detalii-tehnice.pdf/pi326492/original/plafon-p4.s1.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_q_profile_s_support_3_pdf_label: 'plafoane suspendate  qvadruple structura simpla  cu nonius',
    ceilings_s_plates_q_profile_s_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p4.s1.cd-ud.n-cad/pi38834/original/cad-plafon-suspendat-nida-system-p4.s1.cd-ud.n-cad.dwg',
    ceilings_s_plates_q_profile_s_support_3_dwg_label: 'plafoane suspendate  qvadruple structura simpla  cu nonius',
    // ceilings_s_plates_q_profile_s_support_4_pdf: '',
    // ceilings_s_plates_q_profile_s_support_4_pdf_label: '',
    // ceilings_s_plates_q_profile_s_support_4_dwg: '',
    // ceilings_s_plates_q_profile_s_support_4_dwg_label: '',
    ceilings_s_plates_q_profile_d_support_1_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p4.s2.brida-reglabila---detalii-tehnice.pdf/pi326493/original/plafon-p4.s2.brida-reglabila---detalii-tehnice.pdf',
    ceilings_s_plates_q_profile_d_support_1_pdf_label: 'plafoane suspendate  qvadruple structura dubla  cu brida',
    ceilings_s_plates_q_profile_d_support_1_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p4.s2.cd-ud.br/pi38837/original/cad-plafon-suspendat-nida-system-p4.s2.cd-ud.br.dwg',
    ceilings_s_plates_q_profile_d_support_1_dwg_label: 'plafoane suspendate  qvadruple structura dubla  cu brida',
    ceilings_s_plates_q_profile_d_support_3_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p4.s2.nonius---detalii-tehnice.pdf/pi326494/original/plafon-p4.s2.nonius---detalii-tehnice.pdf',
    ceilings_s_plates_q_profile_d_support_3_pdf_label: 'plafoane suspendate  qvadruple structura dubla  cu nonius',
    ceilings_s_plates_q_profile_d_support_3_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p4.s2.cd-ud.n/pi38838/original/cad-plafon-suspendat-nida-system-p4.s2.cd-ud.n.dwg',
    ceilings_s_plates_q_profile_d_support_3_dwg_label: 'plafoane suspendate  qvadruple structura dubla  cu nonius',
    ceilings_s_plates_q_profile_d_support_4_pdf: 'https://etexassets.azureedge.net/-/dam/plafon-p4.s2.ua-cd---detalii-tehnice.pdf/pi326497/original/plafon-p4.s2.ua-cd---detalii-tehnice.pdf',
    ceilings_s_plates_q_profile_d_support_4_pdf_label: 'plafoane suspendate  qvadruple structura dubla  cu tija M8',
    ceilings_s_plates_q_profile_d_support_4_dwg: 'https://etexassets.azureedge.net/-/dam/cad-plafon-suspendat-nida-system-p4.s2.ua-cd/pi38839/original/cad-plafon-suspendat-nida-system-p4.s2.ua-cd.dwg',
    ceilings_s_plates_q_profile_d_support_4_dwg_label: 'plafoane suspendate  qvadruple structura dubla  cu tija M8',

}

const getLinks = (offer, language) => {
    let obj = {
        booklet: 'https://www.siniat.ro/ro-ro/documentatie',
        pdf: 'https://www.siniat.ro/ro-ro/documentatie',
        dwg: 'https://www.siniat.ro/ro-ro/documentatie',
        bookletLabel: 'https://www.siniat.ro/ro-ro/documentatie',
        pdfLabel: 'https://www.siniat.ro/ro-ro/documentatie',
        dwgLabel: 'https://www.siniat.ro/ro-ro/documentatie',
    };
    let propertyName = '';

    const systemType = systemService.getSystemType(offer);
    if (systemType.type === 'walls') {
        systemType.wallsType = systemType.wallsType.replace('s', 'd');
        systemType.name = systemType.name.replace(' S ', ' ');

        propertyName = `${systemType.type}_${systemType.wallsType}`;
    } else if (systemType.type === 'linnings') {
        propertyName = `${systemType.type}_${systemType.linningsType}`;
    } else if (systemType.type === 'ceilings') {
        propertyName = `${systemType.type}_${systemType.ceilingsType}`;
    }

    // booklet
    if (texts[`${propertyName}_booklet`]) {
        obj.booklet = texts[`${propertyName}_booklet`];
        obj.bookletLabel = texts[`${propertyName}_booklet_label`];
    }

    // pereti s
    if (systemType.type === 'walls' && systemType.wallsType === 's') {
        if (systemType.separativiType === 'asimetric') {
            propertyName += '_asimetric';
        } else if (systemType.separativiType === 'intermediar') {
            propertyName += '_intermediar';
        }
    }

    // placari fixari
    if (systemType.type === 'linnings' && systemType.linningsType === 'f') {
        if (offer.profileType.toLowerCase().includes('cd')) {
            propertyName += '_profile_cd';
        } else {
            propertyName += '_profile_cw';
        }
    }

    // numar placi
    if (systemType.type === 'walls' && systemType.wallsType === 's' && systemType.separativiType === 'asimetric') {
        propertyName += ``;
    } else {
        propertyName += `_plates_${systemType.numberOfPlates}`;
    }

    // plafoane suspendate
    if (systemType.type === 'ceilings' && systemType.ceilingsType === 's') {
        // tip structura simpla dubla
        if (offer.profileType.split('/')[0] !== '-') {
            propertyName += '_profile_d';
        } else {
            propertyName += '_profile_s';
        }

        // tip sustinere
        if (offer.ceilingSupport) {
            if (offer.ceilingSupport.toLowerCase() === 'autoportant') {
                propertyName += `_support_0`;
            } else if (offer.ceilingSupport.toLowerCase() === 'brida') {
                propertyName += `_support_1`;
            } else if (offer.ceilingSupport.toLowerCase() === 'tirant') {
                propertyName += `_support_2`;
            } else if (offer.ceilingSupport.toLowerCase() === 'nonius') {
                propertyName += `_support_3`;
            } else if (offer.ceilingSupport.toLowerCase() === 'tija m8') {
                propertyName += `_support_4`;
            } else if (offer.ceilingSupport.toLowerCase() === 'racord lemn') {
                propertyName += `_support_5`;
            } else if (offer.ceilingSupport.toLowerCase() === 'brida ac') {
                propertyName += `_support_6`;
            }
        }
    }

    // pdf
    if (texts[`${propertyName}_pdf`]) {
        obj.pdf = texts[`${propertyName}_pdf`];
        obj.pdfLabel = texts[`${propertyName}_pdf_label`];
    }
    // dwg
    if (texts[`${propertyName}_dwg`]) {
        obj.dwg = texts[`${propertyName}_dwg`];
        obj.dwgLabel = texts[`${propertyName}_dwg_label`];
    }

    return obj;
}

module.exports = {
    getLinks,
};