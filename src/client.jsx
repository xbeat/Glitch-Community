/* globals EDITOR_URL Raven */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter} from 'react-router-dom';

import application from './application';

import qs from 'querystringify';
const queryString = qs.parse(window.location.search);

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';
import ErrorPage from './presenters/pages/error.jsx';


// client-side routing:

async function route(location, application) {
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
  // OAuth Handling
  //
  if (normalizedRoute.startsWith("login/")) {
    const provider = normalizedRoute.substring("login/".length);
    const code = queryString.code;
   
    try {
      await application.login(provider, code);
      window.location.replace("/");
    } catch (error) {
      const errorData = error && error.response && error.response.data;
      const deets = {provider, queryString, error: errorData};
      console.error("OAuth login error.", deets);
      Raven.captureMessage("Oauth login error", {extra: deets});

      const div = document.createElement('div');
      document.body.appendChild(div);
      render(<ErrorPage title="OAuth Login Problem" description="Hard to say what happened, but we couldn't log you in. Try again?"/>, div);
    }
    return;
  }
  
  //
  //  Page Routing
  //

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const App = ({application}) => (
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <CurrentUserProvider api={application.api()}>
            <Router application={application}/>
          </CurrentUserProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  );
  render(<App application={application}/>, dom);
}

route(window.location, application);