import React, { PureComponent } from 'react';
import {Select, MenuItem } from '@material-ui/core';
import { languages } from '../../../utils/constants';
import ReactCountryFlag from 'react-country-flag';

class LangSelect extends PureComponent {
    _handleChange = (el) => () => {
        localStorage.setItem('language', el);
        window.location.reload();
    }

    _renderLanguages = () => {
        return languages.map((el) => {
            let value = el?.toUpperCase();
            if (value === 'EN') {
                value = 'GB'
            }
            if (value === 'CR') {
                value = 'HR'
            }
            if (value === 'SB') {
                value = 'RS'
            }
            return <div className='mr-10'>
                <ReactCountryFlag
                        countryCode={value}
                        onClick={this._handleChange(el)}
                        svg
                        style={{
                            fontSize: '2em',
                            lineHeight: '2em',
                        }}
                    />
                </div>
        })
    }

    render() {
        const { t } = this.props;

        let lang = localStorage.getItem('language');
        if (!lang) { lang ='ro'; }

        return (
            <div className='flex-jb width-flags'>
                {this._renderLanguages()}
            </div>

        );
    }
}

export default LangSelect;