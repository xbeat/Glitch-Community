import Layout from '../templates/layout';
import Header from './header.jsx';
import Footer from './footer.jsx';
import Observable from 'o_0';

import Reactlet from './reactlet';

export default (application, content) =>

  Layout({

    header() {
      const userObservable = Observable(() => {
        const user = application.currentUser();
        const maybeUser = user.fetched() ? user.asProps() : null;
        if (maybeUser) {
          //Invoke any getters we care about
          maybeUser.teams;
        }
        return maybeUser;
      });
      const props = {
        api: application.api(),
        baseUrl: application.normalizedBaseUrl(),
        userObservable: userObservable,
        searchQuery: application.searchQuery(),
        getUserPref: application.getUserPref,
        setUserPref: application.updateUserPrefs,
      };
      return Reactlet(Header, props);
    },

    content,

    footer: Reactlet(Footer),
  });
