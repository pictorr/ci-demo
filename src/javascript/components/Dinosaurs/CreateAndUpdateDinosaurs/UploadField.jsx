import React, { PureComponent } from 'react';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Dropzone from 'react-dropzone';
import { isURL } from '../../../utils/utils.js';

class UploadField extends PureComponent {
	_renderUploadField = ({ getRootProps, getInputProps }) => {
		const { src, t } = this.props;
		let imageSrc;
		if (isURL(src)) {
			imageSrc = src;
		} else if (src) {
			imageSrc = URL.createObjectURL(src);
		}
		return (
			<div
				{ ...getRootProps() }
				className={ `upload-field${ imageSrc ? ' filled' : '' }` }>
				{ imageSrc
					?
					<img
						className='upload-field-filled'
						src={ imageSrc }
						alt={ t('dinosaurImage') }/>
					:
					<div className='upload-field-empty'>
						<CameraAltIcon className='icon'/>
						<p className='paragraph'>
							{ t('attach_image') }
						</p>
					</div>
				}
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
				accept={ [
					'image/jpeg',
					'image/png',
					'image/jpg',
				] }>
				{ this._renderUploadField }
			</Dropzone>
		);
	}
}

export default UploadField;