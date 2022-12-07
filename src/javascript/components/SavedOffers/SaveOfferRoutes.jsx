import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import SavedOffers from './SavedOffers';
import RegularRoute from '../Templates/RegularRoute.jsx';
import CreateOffersRouter from '../Offers/CreateAndUpdateOffer/CreateOffersRouter.jsx';
import UpdateOffersRouter from '../Offers/CreateAndUpdateOffer/UpdateOffersRouter.jsx';


class SavedOffersRouter extends PureComponent {


    render() {
        return(
            <Switch>
                <RegularRoute
                    loggedIn
                    path={ '/new-offer' }
                    Component={ CreateOffersRouter }/>
                <RegularRoute
                    loggedIn
                    path={ '/edit-offer' }
                    Component={ UpdateOffersRouter }/>
                <RegularRoute
                    loggedIn
                    path={ '/view' }
                    Component={ UpdateOffersRouter }/>
                <RegularRoute
                    loggedIn
                    path={ '/' }
                    Component={ SavedOffers }/>
            </Switch>
        )
    }
}

const mapStateToProps = store => ( {
    offer: store.offer,
} );

export default withTranslation()(connect(mapStateToProps)(SavedOffersRouter));