import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import ErrorBoundary from './presenters/includes/error-boundary.jsx';
import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
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
  </ErrorBoundary>
);

export default App;

