import React, { PureComponent } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    thumb: {
        backgroundColor: "#A61F7D",
    },
    track: {
        backgroundColor: "#A61F7D !important",
    }
};

const PurpleSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: "#A61F7D",
        },
        '&$checked + $track': {
            backgroundColor: "#A61F7D",
        },
    },
    checked: {},
    track: {},
})(Switch);


class CustomSwitch extends PureComponent {
    render() {
        const { checked, onClick, disabled } = this.props;
        return (
            <FormControl>
                <PurpleSwitch
                    checked={ checked }
                    onClick={ onClick }
                    disabled={disabled || false}
                >
                </PurpleSwitch>
            </FormControl>
        );
    }
}

export default withStyles(styles)(CustomSwitch);