import Layout from '../templates/layout';
import Header from './header.jsx';
import Footer from './footer.jsx';
import OverlayProject from './overlays/overlay-project';
import OverlayVideo from './overlays/overlay-video';
import Notifications from './notifications';
import NewStuffPresenter from './overlays/new-stuff';
import ProjectModel from '../models/project';
import Observable from 'o_0';

import Reactlet from './reactlet';

export default (application, content) =>

  Layout({

    header() {
      const userObservable = Observable(() => {
        const user = application.currentUser();
        user.teams();
        const maybeUser = user.fetched() ? user.asProps() : null;
        return maybeUser;
      });
      const props = {
        baseUrl: application.normalizedBaseUrl(),
        userObservable: userObservable,
        searchQuery: application.searchQuery(),
        overlayNewStuffVisible: application.overlayNewStuffVisible,
        promiseProjectsByIds: (projectIds) => ProjectModel.promiseProjectsByIds(application.api(), projectIds),
      };
      return Reactlet(Header, props);
    },
    
    content,

    footer: Reactlet(Footer),
    
    overlayProject: OverlayProject(application),
    overlayVideo: OverlayVideo(application),
    notifications: Notifications(application),
    newStuff: NewStuffPresenter(application),
  });
