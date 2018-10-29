import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

const App = () => (
  <BrowserRouter>
    <Notifications>
      <UserPrefsProvider>
        <DevTogglesProvider>
          <CurrentUserProvider>
            {api => <Router api={api}/>}
          </CurrentUserProvider>
        </DevTogglesProvider>
      </UserPrefsProvider>
    </Notifications>
  </BrowserRouter>
);

export default App;