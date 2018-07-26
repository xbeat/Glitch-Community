import React from 'react';
import PropTypes from 'prop-types';

import {CoverC

import RecentProjectsTemplate from '../templates/includes/recent-projects';
import Loader from '../templates/includes/loader';

import {ProjectsUL} from "./projects-list.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import Reactlet from "./reactlet";

export default function(application) {

  const self = { 

    application,
    currentUser: application.currentUser(),

    style() {
      return {
        backgroundImage: `url('${application.currentUser().coverUrl('large')}')`,
        backgroundColor: application.currentUser().coverColor(),
      };
    },
    
    userAvatarStyle() {
      return {
        backgroundColor: application.currentUser().color(),
        backgroundImage: `url('${application.currentUser().userAvatarUrl('large')}')`,
      };
    },
    
    userAvatarUrl() {
      return application.currentUser().userAvatarUrl('large');
    },
    
    loader() {
      return Loader(self);
    },
    
    projects() {
      const projectsObservable = application.currentUser().projects;
      const projects = projectsObservable.slice(0,3);      
      
      if(projects.find(project => !project.fetched())){
        return self.loader();
      }
      
      const props = {
        projects: projects.map(project => project.asProps()),
      };

      return Reactlet(ProjectsUL, props);
    },
        
    SignInPop() {
      return Reactlet(SignInPop);
    },
    
    userAvatarIsAnon() {
      if (application.currentUser().isAnon()) { return 'anon-user-avatar'; }
    },

    userLink() {
      return application.currentUser().userLink();
    },

    hiddenIfUserIsFetched() {
      if (application.currentUser().fetched()) { return 'hidden'; }
    },

    hiddenUnlessCurrentUser() {
      const currentAndFetched = application.currentUser().id() && application.currentUser().fetched();
      if (!currentAndFetched) { return 'hidden'; }
    },
  };

  return RecentProjectsTemplate(self);
}

const RecentProjects = () => (
  /*
  h2
    a(href=@userLink)
      span Your Projects →
  .cover-container(@style)
    .profile-avatar
      .user-avatar-container
        a(href=@userLink)
          .user-avatar(class=@userAvatarIsAnon style=@userAvatarStyle alt="Your avatar")
      - if @currentUser.isAnon()
        .anon-user-sign-up
          = @SignInPop
    article.projects
      span(class=@hiddenIfUserIsFetched)
        =@loader

      =@projects
      */
  <section className="profile recent-projects">
    <h2><a href={userLink}>Your Projects →</a></h2>
    
  </section>
);