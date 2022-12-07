import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { colours } from '../../utils/colours.js';

const styles = theme => ( {
	formControl: {
		width: '100%',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
} );

class CustomSelect extends PureComponent {
	render() {
		const {
			hideEmpty, readOnly, className, classes, id, name, value, options, required, label, error, helperText, placeholder,
			onChange, onBlur
		} = this.props;

		return (
			<ThemeProvider theme={ createTheme({
				palette: {
					primary: {
						main: colours.purple,
						light: colours.purple
					},
					secondary: {
						main: colours.purple
					},
				},
			}) }>
				<FormControl variant="outlined" className={ classes.formControl }>
					<InputLabel htmlFor="id">{ label }</InputLabel>
					<Select
						className={ className ? className + ' option ' + classes.select : classes.select + ' option ' }
						native
						id={ id }
						required={ required }
						value={ value }
						onChange={ onChange }
						label={ label }
						disabled={readOnly}
						inputProps={ {
							name: name,
							error: error,
							helperText: helperText,
							onBlur: onBlur,
							className: classes.select,
						} }>
						{ hideEmpty ? null : <option aria-label="None" value="select-value">{ placeholder || '' }</option> }
						{ options }
					</Select>
				</FormControl>
			</ThemeProvider>
		);
	}
}

export default withStyles(styles)(CustomSelect);