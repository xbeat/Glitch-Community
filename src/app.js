import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './presenters/includes/error-boundary';
import { AnalyticsContext } from './presenters/analytics';
import { CurrentUserProvider } from './state/current-user';
import { APIContextProvider } from './state/api';
import { UserPrefsProvider } from './presenters/includes/user-prefs';
import { DevTogglesProvider } from './presenters/includes/dev-toggles';
import { Notifications } from './presenters/notifications';
import SuperUserBanner from './presenters/overlays/super-user-banner';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <AnalyticsContext context={{ groupId: '0' }}>
              <CurrentUserProvider>
<<<<<<< HEAD
                <>
                  <SuperUserBanner />
                  <Router />
                </>
=======
                <APIContextProvider>
                  <Router />
                </APIContextProvider>
>>>>>>> a37a5c7c46c23feb31e423a032f0c5a1b4a76af9
              </CurrentUserProvider>
            </AnalyticsContext>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
