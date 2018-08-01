import React from 'react';
import PropTypes from 'prop-types';

import {ApiProvider} from './api.jsx';
import {CurrentUserProvider} from './current-user.jsx';
import {Notifications} from './notifications.jsx';

import Routing from './pages/routing.jsx';

const App = ({application}) => (
  <Notifications>
    <ApiProvider api={application.api()}>
      <CurrentUserProvider model={application.currentUser()}>
        <Routing application={application}/>
      </CurrentUserProvider>
    </ApiProvider>
  </Notifications>
);

App.propTypes = {
  application: PropTypes.any.isRequired,
};

export default App;