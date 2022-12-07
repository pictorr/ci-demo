import React, { PureComponent } from 'react';
import { getSystemType } from "../../utils/utils";
import { mainSite } from "../../utils/config";

class Offer3DImage extends PureComponent {
    state = {
        image3DPath: '',
        image3DLabel: ''
    }

    componentDidMount() {
        const {offer} = this.props;

        // http://localhost:3000/3d/linnings/linnings_f_plates_d_profile_cd_interax_s_wool_yes.png
        let imageData = this._getFeatures3DImage(offer);
        if (imageData) {
            this.setState({
                image3DPath: imageData.path.replace(`${ mainSite }`, ''),
                image3DLabel: imageData.label
            });
        }
    }

    _getFeatures3DImage = (offer) => {
        let systemType = getSystemType(offer);
        let path = `${process.env.REACT_APP_PUBLIC_RESOURCES}/3d/`;
        let label = '';
        // category and subcategory
        if (systemType.type === 'ceilings') {
            path += `ceilings/ceilings_${ systemType.ceilingsType }`;
        } else if (systemType.type === 'linnings') {
            path += `linnings/linnings_${ systemType.linningsType }`;
        } else if (systemType.type === 'walls') {
            path += `walls/walls_${ offer.systemName.includes("Pereti Smart") ? "d" : systemType.wallsType }`;
        }
        label += systemType.name;

        // placari lipire
        if (systemType.type === 'linnings' && systemType.linningsType === 'p') {
            return {
                path: `${ path }.png`,
                label: label
            }
        }

        // rc4
        if (systemType.type === 'walls' && offer.burglaryResistance && offer.burglaryResistance === '4') {
            path += '_rc4';
            label += ' efractie';
        }

        if (systemType.type === 'walls' && systemType.wallsType === 's') {
            if (systemType.wallsType === 's') {
                if (systemType.separativiType === 'asimetric') {
                    path += '_asimetric';
                    label += ' asimetric';
                } else if (systemType.separativiType === 'intermediar') {
                    path += '_intermediar';
                    path += `_plates_${systemType.numberOfPlates}`;
                    label += ` intermediar`;
                } else {
                    path += `_plates_${systemType.numberOfPlates}`;
                }
            }
        } else {
            path += `_plates_${ systemType.numberOfPlates }`;
        }

        if (systemType.type === 'ceilings') {
            // plafoane suspendate
            if (systemType.ceilingsType === 's') {
                // tip suport
                if (offer.ceilingSupport) {
                    if (offer.ceilingSupport.toLowerCase() === 'autoportant') {
                        path += `_support_0`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'brida') {
                        path += `_support_1`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'tirant') {
                        path += `_support_2`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'nonius') {
                        path += `_support_3`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'tija m8') {
                        path += `_support_4`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'racord lemn') {
                        path += `_support_5`;
                        label += ` ${ offer.ceilingSupport }`;
                    } else if (offer.ceilingSupport.toLowerCase() === 'brida ac') {
                        path += `_support_6`;
                        label += ` ${ offer.ceilingSupport }`;
                    }
                }

                // profile metalice
                if (offer.profileType.includes('/')) {
                    let splitProfileType = offer.profileType.split('/');
                    if (splitProfileType[0].toLowerCase().includes('cd')) {
                        path += '_profile_cd';
                        label += ' CD/';
                    } else if (splitProfileType[0].toLowerCase().includes('ua')) {
                        path += '_profile_ua';
                        label += ' UA/';
                    } else {
                        path += '_profile_0';
                        label += ' 0/';
                    }
                    if (splitProfileType[1].toLowerCase().includes('cd')) {
                        path += '_cd';
                        label += 'CD';
                    } else if (splitProfileType[0].toLowerCase().includes('ua')) {
                        path += '_ua';
                        label += 'UA';
                    } else {
                        path += '_profile_0';
                        label += '0';
                    }
                }

                // vata
                if (offer.soundInsulation.toLowerCase().includes('da')) {
                    path += '_wool_yes';
                    label += ' cu vata';
                } else {
                    path += '_wool_no';
                    label += ' fara vata';
                }

                return {
                    path: `${ path }.png`,
                    label: label
                }
            }

            if (systemType.ceilingsType === 'ss') {
                if (offer && offer.protectionSense) {
                    if (offer.protectionSense === '1') {
                        path += '_direction_1';
                        label += ' sens js';
                    } else if (offer.protectionSense === '2') {
                        path += '_direction_2';
                        label += ' sens sj';
                    } else if (offer.protectionSense === '3') {
                        path += '_direction_3';
                        label += ' sens sjs';
                    }
                }

                // profile metalice
                if (offer.profileType.toLowerCase().includes('cw')) {
                    path += '_profile_cw';
                    label += ' CW';
                } else if (offer.profileType.toLowerCase().includes('ua')) {
                    path += '_profile_ua';
                    label += ' UA';
                }

                // interax
                if (offer.interax.includes('H')) {
                    path += '_interax_d';
                    label += ' H';
                } else {
                    path += '_interax_s';
                }

                // vata
                if (offer.soundInsulation.toLowerCase().includes('da')) {
                    path += '_wool_yes';
                    label += ' cu vata';
                } else {
                    path += '_wool_no';
                    label += ' fara vata';
                }

                return {
                    path: `${ path }.png`,
                    label: label
                }
            }
        }

        if (systemType.type === 'linnings') {
            // placari liniare / placari noisy UU
            if (systemType.linningsType === 'l' || systemType.linningsType === 'nuu') {
                return {
                    path: `${ path }.png`,
                    label: label
                }
            }

            // placari fixari - placari independente
            if (systemType.linningsType === 'f' || systemType.linningsType === 'i') {
                // profile metalice
                if (offer.profileType.toLowerCase().includes('cw')) {
                    path += '_profile_cw';
                    label += ' CW';
                } else if (offer.profileType.toLowerCase().includes('cd')) {
                    path += '_profile_cd';
                    label += ' CD';
                }

                // interax
                if (offer.interax.includes('H')) {
                    path += '_interax_d';
                    label += ' H';
                } else {
                    path += '_interax_s';
                }

                // vata
                if (offer.soundInsulation.toLowerCase().includes('da')) {
                    path += '_wool_yes';
                    label += ' cu vata';
                } else {
                    path += '_wool_no';
                    label += ' fara vata';
                }

                return {
                    path: `${ path }.png`,
                    label: label
                }
            }

            // placari noisy fixari - placari noisy independente
            if (systemType.linningsType === 'nf' || systemType.linningsType === 'ni') {
                // profile metalice / interax
                if (offer.profileType.includes('/') && offer.interax.includes('/')) {
                    let splitInterax = offer.interax.split('/');
                    if (splitInterax[0].includes('H')) {
                        path += '_profile_cwh';
                        label += ' CWH/';
                    } else {
                        path += '_profile_cw';
                        label += ' CW/';
                    }
                    if (splitInterax[1].includes('H')) {
                        path += '_cwh';
                        label += 'CWH';
                    } else {
                        path += '_cw';
                        label += 'CW';
                    }
                }

                // vata
                if (offer.soundInsulation.toLowerCase().includes('da')) {
                    path += '_wool_yes';
                    label += ' cu vata';
                } else {
                    path += '_wool_no';
                    label += ' fara vata';
                }

                return {
                    path: `${ path }.png`,
                    label: label
                }
            }
        }

        if (systemType.type === 'walls') {
            // interax
            if (offer.interax.includes('H')) {
                path += '_interax_d';
                label += ' H';
            } else {
                path += '_interax_s';
            }

            // vata
            if (offer.soundInsulation.toLowerCase().includes('da')) {
                path += '_wool_yes';
                label += ' cu vata';
            } else {
                path += '_wool_no';
                label += ' fara vata';
            }

            return {
                path: `${ path }.png`,
                label: label
            }
        }

        return null;
    }

    render() {
        const {image3DPath, image3DLabel} = this.state;
        // example url : http://localhost:3000/3d/linnings/linnings_f_plates_d_profile_cd_interax_s_wool_yes.png
        // example path : /3d/linnings/linnings_f_plates_d_profile_cd_interax_s_wool_yes.png
        return (
            <>
                <img className={ 'fit-picture' } src={ image3DPath }/>
            </>
        )
    }
}

export default Offer3DImage;
