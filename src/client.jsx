/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

//
// Redirects
//
if (location.hash.startsWith("#!/")) {
  window.location.replace(EDITOR_URL + window.location.hash);
}

//
// Client side react
//
const App = () => (
  <BrowserRouter>
    <Notifications>
      <UserPrefsProvider>
        <CurrentUserProvider>
          {api => <Router api={api}/>}
        </CurrentUserProvider>
      </UserPrefsProvider>
    </Notifications>
  </BrowserRouter>
);


//
// Init the app
//
const dom = document.createElement('div');
document.body.appendChild(dom);
render(<App/>, dom);