import React, { PureComponent } from 'react';
import { getSystemType } from "../../utils/utils";
import { linkTexts } from "../../utils/constants";

class ExternalLinks extends PureComponent {
    state = {
        links: ''
    }

    componentDidMount() {
        this._setExternalLinks();
    }

    _setExternalLinks = () => {
        const {offer} = this.props;
        let obj = {
            booklet: 'https://www.siniat.ro/ro-ro/documentatie',
            pdf: 'https://www.siniat.ro/ro-ro/documentatie',
            dwg: 'https://www.siniat.ro/ro-ro/documentatie',
            bookletLabel: 'https://www.siniat.ro/ro-ro/documentatie',
            pdfLabel: 'https://www.siniat.ro/ro-ro/documentatie',
            dwgLabel: 'https://www.siniat.ro/ro-ro/documentatie',
        };
        let propertyName = '';

        const systemType = getSystemType(offer);
        if (systemType.type === 'walls') {
            propertyName = `${systemType.type}_${systemType.wallsType}`;
        } else if (systemType.type === 'linnings') {
            propertyName = `${systemType.type}_${systemType.linningsType}`;
        } else if (systemType.type === 'ceilings') {
            propertyName = `${systemType.type}_${systemType.ceilingsType}`;
        }

        // booklet
        if (linkTexts[`${propertyName}_booklet`]) {
            obj.booklet = linkTexts[`${propertyName}_booklet`];
            obj.bookletLabel = linkTexts[`${propertyName}_booklet_label`];
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
        if (linkTexts[`${propertyName}_pdf`]) {
            obj.pdf = linkTexts[`${propertyName}_pdf`];
            obj.pdfLabel = linkTexts[`${propertyName}_pdf_label`];
        }
        // dwg
        if (linkTexts[`${propertyName}_dwg`]) {
            obj.dwg = linkTexts[`${propertyName}_dwg`];
            obj.dwgLabel = linkTexts[`${propertyName}_dwg_label`];
        }

        this.setState({
            links: obj
        });
    }

    render() {
        const {links} = this.state;
        const {t} = this.props;

        return (
            <>
                <br />
                <br />
                <div><span>{t('more_details_here')}:</span></div>
                <br />
                <div><a href={links.pdf} target="_blank">{t('PDF_details')}</a></div>
                <div><a href={links.dwg} target="_blank">{ t('DWG_details') }</a></div>
                <div><a href={links.booklet} target="_blank">{ t('brochures_sistems') }</a></div>
            </>
        )
    }
}

export default ExternalLinks;