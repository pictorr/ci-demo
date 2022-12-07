import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';

class UploadExcel extends PureComponent {
	_renderUploadExcel = ({ getRootProps, getInputProps }) => {
		const { prefix, t } = this.props;
		return (
			<div
				{ ...getRootProps() }
                // className={'uploadButton'}
            >
				<GeneralButton className="imports-button pr-20 pl-20" prefix={prefix}>
                    { t('attach_file') }
				</GeneralButton>
				<input { ...getInputProps() }/>
			</div>
		);
	};

	render() {
		const { onDrop, onDropRejected, setFieldValue } = this.props;
		return (
			<Dropzone
				onDrop={ onDrop(setFieldValue) }
				onDropRejected={ onDropRejected }
				multiple={ false }
                maxSize={ 30000000 }
                // accept= { [
                //     // xls, xlam, xlsb, xltm, xlsm, xlsx, xltx
                //     'application/vnd.ms-excel',
                //     'application/excel',
                //     'application/x-excel',
                //     'application/x-msexcel',
                //     'application/vnd.ms-excel.addin.macroenabled.12',
                //     'application/vnd.ms-excel.sheet.binary.macroenabled.12',
                //     'application/vnd.ms-excel.template.macroenabled.12',
                //     'application/vnd.ms-excel.sheet.macroenabled.12',
                //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                //     'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
                //     // odc, odb, odf, odft, odg, otg, odi, oti, odp, otp, ods, ots, odt, odm, ott
                //     'application/vnd.oasis.opendocument.chart',
                //     'application/vnd.oasis.opendocument.database',
                //     'application/vnd.oasis.opendocument.formula',
                //     'application/vnd.oasis.opendocument.formula-template',
                //     'application/vnd.oasis.opendocument.graphics',
                //     'application/vnd.oasis.opendocument.graphics-template',
                //     'application/vnd.oasis.opendocument.image',
                //     'application/vnd.oasis.opendocument.image-template',
                //     'application/vnd.oasis.opendocument.presentation',
                //     'application/vnd.oasis.opendocument.presentation-template',
                //     'application/vnd.oasis.opendocument.spreadsheet',
                //     'application/vnd.oasis.opendocument.spreadsheet-template',
                //     'application/vnd.oasis.opendocument.text',
                //     'application/vnd.oasis.opendocument.text-master',
                //     'application/vnd.oasis.opendocument.text-template'
                // ]}
			>
				{ this._renderUploadExcel }
			</Dropzone>
		);
	}
}

export default UploadExcel;