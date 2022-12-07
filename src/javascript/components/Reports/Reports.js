import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItemFromStorage } from '../../utils/utils';
import { downloadReport } from '../../actions/reportsActions';
import { Card, Checkbox, Grid, FormControl, FormControlLabel, Select, MenuItem } from '@material-ui/core';
import CustomButton from '../Templates/Buttons/CustomButton';
import CustomAlert from "../Templates/CustomAlert";
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import PublishIcon from '@material-ui/icons/Publish';
import { withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
    root: {
      color: '#A61F7D',
      '&$checked': {
        color: '#A61F7D',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class Reports extends PureComponent {
    constructor(props) {
        super(props);

        const { t } = props;

        this.state = {
            redirect: false,
            downloadOptions: [],
            downloadOptionsDisplay: [],
            months: [
                t('january'),
                t('february'),
                t('march'),
                t('april'),
                t('may'),
                t('june'),
                t('july'),
                t('august'),
                t('september'),
                t('october'),
                t('november'),
                t('december')
            ],
            disabled: true,
            error: '',
            numberColumns: 3,
            type: 0,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this._changeNumberColumns);
        this._restrictAccess();
        this._getDownloadOptions();
    }

    componentDidUpdate(prevProps) {
        const { reports } = this.props;
        if (prevProps.reports.reportFileName !== reports.reportFileName && reports.reportFileName.length > 0) {
            const { downloadOptions } = this.state;
            let updatedDownloadOptions = [...downloadOptions];
            updatedDownloadOptions.forEach(el => {
                el.selected = false;
            });
            this.setState({ downloadOptions: updatedDownloadOptions, downloadOptionsDisplay:downloadOptions },  () => {
                this._changeNumberColumns();
            });

            setTimeout(() => {
                window.open(`${process.env.REACT_APP_PUBLIC_UPLOADS}/${reports.reportFileName}`);
            }, 500);
        }
        if (prevProps.reports.downloadingReportError !== reports.downloadingReportError && reports.downloadingReportError.length > 0) {
            this.setState({
                error: reports.downloadingReportError
            }, () => {
                this._changeNumberColumns();
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._changeNumberColumns)
    }

    _restrictAccess = () => {
        let hasAccess = false;
        if (getItemFromStorage('isMasterAdmin') === 'true') {
            hasAccess = true;
        }
        if (!hasAccess) {
            this.setState({
                redirect: true
            });
        }
    }

    _getDownloadOptions = () => {
        const { months } = this.state;
        const { t } = this.props;

        let currentYear = moment().year();
        let currentMonth = moment().month();
        let lastYear = moment().subtract(1, 'years').year();

        let options = [];
        options.push({
            selected: false,
            label: `- ${currentYear} -`,
            year: currentYear,
            month: '-'
        });
        for (let i = currentMonth; i >= 0; i--) {
            options.push({
                selected: false,
                label: `${t(months[i])} ${currentYear}`,
                year: currentYear,
                month: i
            });
        }
        options.push({
            selected: false,
            label: `- ${lastYear} -`,
            year: lastYear,
            month: '-'
        });
        for (let i = 11; i >= 0; i--) {
            options.push({
                selected: false,
                label: `${t(months[i])} ${lastYear}`,
                year: lastYear,
                month: i
            });
        }

        this.setState({
            downloadOptions: options,
            downloadOptionsDisplay: options
        }, () => {
            this._changeNumberColumns();
        });
    }

    _handleChange = (e) => {
        const { downloadOptions } = this.state;
        let updatedDownloadOptions = [...downloadOptions];
        let findIndex = updatedDownloadOptions.findIndex(el => el.label === e.target.name);
        if (findIndex !== -1) {
            updatedDownloadOptions[findIndex].selected = !updatedDownloadOptions[findIndex].selected
        }
        this.setState({
            downloadOptions: updatedDownloadOptions,
            downloadOptionsDisplay: updatedDownloadOptions,
            disabled: updatedDownloadOptions.find(el => el.selected) === undefined
        }, () => {
            this._changeNumberColumns();
        });
    };


    _handleChangeReport = (e) => {
        this.setState({
            type: e.target.value,
        });
    };

    _handleSubmit = () => {
        const { downloadOptions, type } = this.state;
        const { dispatch } = this.props;
        const filteredOptions = downloadOptions.filter(el => el.selected);

        let data = [];
        let findYear = filteredOptions.find(el => el.month === '-');
        if (findYear) {
            data.push({
                month: findYear.month,
                year: findYear.year
            });
        } else {
            filteredOptions.forEach(el => {
                data.push({
                    month: el.month,
                    year: el.year
                })
            });
        }

        if (data.length > 0) {
            this.setState({
                error: ''
            });
            dispatch(downloadReport(data, type));
            this._changeNumberColumns();
        }
    }

    _changeNumberColumns = () => {
        if (window.innerWidth <= 1250) {
            const { downloadOptions } = this.state;
            let updateDisplayOptions = [];

            let optionsLength = downloadOptions.length;

            for(let i = 0; i < optionsLength / 2; ++i) {
                updateDisplayOptions.push(downloadOptions[i])
                if (optionsLength / 2 + i < optionsLength) {
                    updateDisplayOptions.push(downloadOptions[parseInt(optionsLength / 2) + i])
                }
            }

            this.setState({
                numberColumns: 2,
                downloadOptionsDisplay: updateDisplayOptions,
            })
            
        }
        else {
            const { downloadOptions } = this.state;
            let updateDisplayOptions = [];

            let optionsLength = downloadOptions.length;

            for(let i = 0; i < optionsLength / 3; ++i) {
                updateDisplayOptions.push(downloadOptions[i])
                if (optionsLength / 3 + i < optionsLength) {
                    updateDisplayOptions.push(downloadOptions[parseInt(optionsLength / 3) + i]);
                }

                if (optionsLength / 3 * 2 + i < optionsLength) {
                    updateDisplayOptions.push(downloadOptions[parseInt(optionsLength / 3) * 2 + i])
                }
            }

            this.setState({
                numberColumns: 3,
                downloadOptionsDisplay: updateDisplayOptions,
            })
        }
    }

    render() {
        const { redirect, downloadOptionsDisplay, numberColumns, error, disabled, type } = this.state;
        const { t } = this.props;

        let styles = ['one', 'two', 'three', 'four'];

        if (redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <Card className='general-card small-left'>
                <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                         <div className="button-center">
                            <Typography
                                className="rubrik-font"
                                variant="h4"
                                component="h1">
                                {t('reports')}
                            </Typography>
                        </div>
                        <div class="wrapper">
                            {
                                downloadOptionsDisplay.map((el, index) => {
                                    return <div className={`${styles[(index) % numberColumns]}`}> <FormControlLabel
                                        control={<GreenCheckbox
                                            checked={el.selected}
                                            onChange={this._handleChange}
                                            name={el.label}
                                        />}
                                        label={el.label}
                                    />
                                    </div>
                                })
                            }
                        </div>

                        <br /><br />
                        <Select
                            value={type}
                            onChange={this._handleChangeReport}
                            style={{width: '50%', margin: '0 auto'}}
                        >
                            <MenuItem value={1}>{t('report')} 1</MenuItem>
                            <MenuItem value={2}>{t('report')} 2</MenuItem>
                            <MenuItem value={3}>{t('report')} 3</MenuItem>
                            <MenuItem value={0}>{t('report')} 4</MenuItem>
                        </Select>
                    </FormControl>
                    <div className="button-center flex-col">
                        <CustomButton
                            className2='ml-0'
                            prefix={(<PublishIcon className="rotate-180deg mr-5" />)}
                            className="pr-20 pl-17"
                            title={t('download')}
                            onClick={this._handleSubmit}
                            disabled={disabled}
                        />
                        {error &&
                        <div className="button-center margin-0 pl-20">
                            <CustomAlert
                                severity='error'
                                message={ error }/>
                            </div>
                        // <div>{error}</div>
                    }
                    </div>
                </Grid>
            </Card>
        );
    }
}

const mapStateToProps = store => ({
    reports: store.reports,
});

export default withTranslation()(connect(mapStateToProps)(withStyles()(Reports)));