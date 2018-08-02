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
<<<<<<< HEAD
        overlayNewStuffVisible: application.overlayNewStuffVisible,
        promiseProjectsByIds: (projectIds) => ProjectModel.promiseProjectsByIds(application.api(), projectIds),
        api: application.api,
=======
        getUserPref: application.getUserPref,
        setUserPref: application.updateUserPrefs,
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
      };
      return Reactlet(Header, props);
    },
    
    content,

    footer: Reactlet(Footer),
  });
