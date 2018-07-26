import React from 'react';

import {CurrentUserProvider, CurrentUserConsumer} from '../current-user.jsx';

import IndexTemplate from '../../templates/pages/index';
import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

import ByFogCreek from '../includes/by-fogcreek.jsx';
import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';
import WhatIsGlitch from '../what-is-glitch.jsx';

function old(application) {
  console.log("Presented index");

  const self = {
    application,
    projects: application.projects,

    user: application.user,

    WhatIsGlitch() {
      if (application.currentUser().isSignedIn()) {
        return null;
      }
      return Reactlet(WhatIsGlitch);
    },

    currentUser: application.currentUser,

    featured() {
      return Reactlet(Featured);
    },
    
    randomCategories() {
      const props = {
        api: application.api(),
      };
      return Reactlet(RandomCategories, props);
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
      return Reactlet(Categories, props);
    },

    QuestionsPresenter() {
      const props = {
        api: application.api(),
      };
      return Reactlet(Questions, props);
    },

    RecentProjectsPresenter() {
      const props = {
        api: application.api(),
        userModel: application.currentUser(),
      };
      return Reactlet(RecentProjects, props);
    },

    ByFogCreek() {
      return Reactlet(ByFogCreek, null);
    },

  };

  const content = IndexTemplate(self);

  return LayoutPresenter(application, content);
}

/*
span
  main(role="main")
    h1.headline
      a(href="https://glitch.com")
        span= "Glitch"
      span= " "
      span is the friendly community where you'll build the app of your dreams

    - if @currentUser().isSignedIn()
      = @QuestionsPresenter
    - if @currentUser().id()
      = @RecentProjectsPresenter

    = @featured
        
    = @randomCategories

    = @Categories
    
    = @WhatIsGlitch

    = @ByFogCreek

    section.made-in-glitch
      p
        span Of course, this site was made on Glitch too
      a(href="https://glitch.com/edit/#!/community")
        button.has-emoji View Source
          .emoji.carp_streamer

  script(src="//fast.wistia.com/embed/medias/vskja9agqj.jsonp" async=true)
  script(src="//fast.wistia.com/assets/external/E-v1.js" async=true)
*/

const IndexPage = ({api, user}) => (
  <main>
    <h1 className="headline">
      <a href="https://glitch.com">Glitch</a>{' '}
      is the friendly community where you'll build the app of your dreams
    </h1>
    {!!user.login && <Questions api={api}/>}
    {!!user.id && <RecentProjects api={api}/>}
  </main>
);

const IndexPageContainer = ({userModel, ...props}) => (
  <CurrentUserProvider model={userModel}>
    <CurrentUserConsumer>
      {user => <IndexPage user={user} {...props}/>}
    </CurrentUserConsumer>
  </CurrentUserProvider>
);

export default function IndexPagePresenter(application) {
  const props = {
    api: application.api(),
    userModel: application.currentUser(),
  };
  const content = Reactlet(IndexPage, props);
  return LayoutPresenter(application, content);
}