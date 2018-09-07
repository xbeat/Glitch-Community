/* globals EDITOR_URL */
import 'details-element-polyfill';

import React from 'react';
import {render} from 'react-dom';

import {BrowserRouter, withRouter} from 'react-router-dom';

import {CurrentUserProvider} from './presenters/current-user.jsx';
import {UserPrefsProvider} from './presenters/includes/user-prefs.jsx';
import {DevTogglesProvider} from './presenters/includes/dev-toggles.jsx';
import {Notifications} from './presenters/notifications.jsx';

import Router from './presenters/pages/router.jsx';

const ResetScroll = withRouter(class ResetScroll extends React.Component {
  componentDidUpdate(prev) {
    if (prev.location.key) {
      window.scrollTo({
  render() {
    return null;
  }
});

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
        <DevTogglesProvider>
          <CurrentUserProvider>
            {api => <Router api={api}/>}
          </CurrentUserProvider>
        </DevTogglesProvider>
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