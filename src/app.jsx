import React from 'react';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

const App = () => (
  <Notifications>
    <UserPrefsProvider>
      <DevTogglesProvider>
        <CurrentUserProvider>
          {api => <Router api={api}/>}
        </CurrentUserProvider>
      </DevTogglesProvider>
    </UserPrefsProvider>
  </Notifications>
);

export default App;