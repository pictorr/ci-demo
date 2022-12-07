import React, { PureComponent } from "react";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {withTranslation} from "react-i18next";
import {translations} from "../../../utils/constants";

class TabPanel extends PureComponent {
    render () {
        const { children, value, index, typeName, current, onClick } = this.props;

        const constantType = translations[typeName];

        return (
        <div className={`tab-panel-style ${constantType?.match(/^(create_offer_)(.*)$/)[2] === current ? 'custom-color-selected' : null}`}
            hidden={value !== index}>
            {value === index && (
            <Box p={2} onClick = {onClick}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
        );
    }
}

export default withTranslation()(TabPanel);