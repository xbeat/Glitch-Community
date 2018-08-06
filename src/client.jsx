/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';


// client-side routing:

async function route(location) {
  const normalizedRoute = location.pathname.replace(/^\/|\/$/g, "");
  console.log(`normalizedRoute is ${normalizedRoute}`);

  //
  // Redirects
  //
  if (location.hash.startsWith("#!/")) {
    window.location = EDITOR_URL + window.location.hash;
    return;
  }
  
  //
  //  Page Routing
  //
  const dom = document.createElement('div');
  document.body.appendChild(dom);
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
  render(<App/>, dom);
}

route(window.location);