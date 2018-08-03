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

console.log("#########");
console.log("❓ query strings are", queryString);
console.log("🎏 application is", application);
console.log("👻 current user is", application.currentUser());
console.log("🌈 login", application.currentUser().login());
console.log("#########");



// client-side routing:

function identifyUser(application) {
  const currentUserId = application.currentUser().id();
  if (currentUserId) {
    application.getCurrentUserById(currentUserId);
  }
  const user = application.currentUser();
  const analytics = window.analytics;
  if (analytics && application.currentUser().id()) {
    try {
      analytics.identify(user.id(), {
        name: user.name(),
        login: user.login(),
        email: user.email(),
        created_at: user.createdAt(),
      });
    } catch (error) {
      console.error(error);
      Raven.captureException(error);
    }
  }
}

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
  // If we have a session, load it and notify our analytics:
  //
  identifyUser(application);
  
  //
  //  Page Routing
  //

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const App = ({application}) => (
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <CurrentUserProvider model={application.currentUser()}>
            <Router application={application}/>
          </CurrentUserProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  );
  render(<App application={application}/>, dom);
}

route(window.location, application);