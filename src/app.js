import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './presenters/includes/error-boundary';
import { ReduxProvider } from './state'
import { AnalyticsContext } from './presenters/analytics';
import { CurrentUserProvider } from './state/current-user';
import { UserPrefsProvider } from './presenters/includes/user-prefs';
import { DevTogglesProvider } from './presenters/includes/dev-toggles';
import { Notifications } from './presenters/notifications';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <ReduxProvider>
        <Notifications>
          <UserPrefsProvider>
            <DevTogglesProvider>
              <AnalyticsContext context={{ groupId: '0' }}>
                <Router />
              </AnalyticsContext>
            </DevTogglesProvider>
          </UserPrefsProvider>
        </Notifications>
      </ReduxProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
