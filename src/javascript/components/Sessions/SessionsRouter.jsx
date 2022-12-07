import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import Sessions from './Sessions.jsx';
import SavedOffers from '../SavedOffers/SavedOffers.jsx';
import RegularRoute from '../Templates/RegularRoute.jsx';
import DataForm from './DataForm.jsx';

class UpdateSessionRouter extends PureComponent {

    render() {
        return(
            <Switch>
                <RegularRoute
                    loggedIn
                    path={ '/session/:id/offers' }
                    Component={ SavedOffers }/>
                <RegularRoute
                    loggedIn
                    path={ '/session/:id' }
                    Component={ DataForm }/>
                <RegularRoute
                    loggedIn
                    path={ '/' }
                    Component={ Sessions }/>
            </Switch>
        )
    }
}

const mapStateToProps = store => ( {
    sessions: store.sessions,
} ); 

export default withTranslation()(connect(mapStateToProps)(UpdateSessionRouter));