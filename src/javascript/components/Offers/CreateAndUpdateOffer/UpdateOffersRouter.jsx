import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import CreateAndUpdateOffers from './CreateAndUpdateOffers';
import RegularRoute from '../../Templates/RegularRoute.jsx';
import OffersList from '../OffersList';
import OffersDetails from '../OffersDetails';


class UpdateOffersRouter extends PureComponent {


    render() {
        const { match } = this.props;
        return(
            <Switch>
                <RegularRoute
                    render={(props) => {
                        return <OffersDetails {...props} parentMatch={match}/>
                    }}
                    loggedIn
                    path={ '/private/sessions/session/:id/offers/view/:offerDetailsId' }
                />
                <RegularRoute
                    render={(props) => {
                        return <OffersDetails {...props} parentMatch={match}/>
                    }}
                    loggedIn
                    path={ '/private/sessions/session/:id/offers/edit-offer/:offerId/generated-offers/:offerDetailsId/details' }
                />
                <RegularRoute
                    render={(props) => {
                        return <OffersList {...props} parentMatch={match}/>
                    }}
                    loggedIn
                    path={ '/private/sessions/session/:id/offers/edit-offer/:offerId/generated-offers' }
                />
                <RegularRoute
                    render={(props) => {
                        return <CreateAndUpdateOffers {...props} parentMatch={match}/>
                    }}
                    loggedIn
                    path={ '/' }
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ( {
    offer: store.offer,
} );

export default withTranslation()(connect(mapStateToProps)(UpdateOffersRouter));