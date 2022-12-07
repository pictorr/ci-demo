import React, { PureComponent } from 'react';
import { Card } from '@material-ui/core';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { getDinosaur } from '../../actions/dinosaursActions.js';
import { resetItem } from '../../actions/generalActions.js';
import { withTranslation } from 'react-i18next';
import GeneralButton from '../Templates/Buttons/GeneralButton.jsx';

class Dinosaur extends PureComponent {
	componentDidMount() {
		const { match, dispatch } = this.props;
		dispatch(getDinosaur(match?.params?.dinosaurId));
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(resetItem('DINOSAUR'));
	}

	render() {
		const { dinosaurs, t } = this.props;

		if (dinosaurs.fetchingDinosaur) {
			return (
				<Card className='general-card small'>
					Loading
				</Card>
			);
		}

		return (
			<Card className='general-card small'>
				<Grid container>
					<div className='dinosaur-image-wrapper'>
						<img
							className='dinosaur-image'
							src={ dinosaurs.dinosaur.image }
							alt={ dinosaurs.dinosaur.species }/>
					</div>
				</Grid>
				<Grid
					className='dinosaur-details'
					spacing={ 2 }
					container>
					<Grid
						item
						xs={ 12 }>
						<p className='dinosaur-details-paragraph'>
							{ dinosaurs.dinosaur.species }
						</p>
					</Grid>
					<Grid
						item
						xs={ 12 }>
						<p className='dinosaur-details-paragraph'>
							{ t(dinosaurs.dinosaur.foodPreference) }
						</p>
					</Grid>
					<Grid
						item
						xs={ 12 }>
						<p className='dinosaur-details-paragraph'>
							<a
								href={ dinosaurs.dinosaur.wikipediaPage }
								target='_blank'
								rel="noreferrer">
								{ dinosaurs.dinosaur.wikipediaPage }
							</a>
						</p>
					</Grid>
					<Grid
						item
						xs={ 12 }>
						<p className='dinosaur-details-paragraph'>
							{ dinosaurs.dinosaur.averageSize }
						</p>
					</Grid>
					<Grid
						className='dinosaur-details-actions'
						item
						xs={ 12 }>
						<GeneralButton href={ '/private/dinosaurs' }>
							{ t('back') }
						</GeneralButton>
					</Grid>
				</Grid>
			</Card>
		);
	}
}

const mapStateToProps = store => ( {
	dinosaurs: store.dinosaurs,
} );

export default withTranslation()(connect(mapStateToProps)(Dinosaur));