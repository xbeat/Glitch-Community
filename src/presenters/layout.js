import Layout from '../templates/layout';
import Header from './header';
import Footer from '../templates/includes/footer';
import OverlayProject from './overlays/overlay-project';
import OverlayVideo from './overlays/overlay-video';
import Notifications from './notifications';
import NewStuffPresenter from './overlays/new-stuff';

export default (application, content) =>

  Layout({

    header: Header(application),
    
    content,

    footer: Footer(application),
    
    overlayProject: OverlayProject(application),
    overlayVideo: OverlayVideo(application),
    notifications: Notifications(application),
    newStuff: NewStuffPresenter(application),
  });
