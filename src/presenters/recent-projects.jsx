import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarStyle, getProfileStyle} from '../models/user';

import {CoverContainer} from './includes/profile.jsx';
import SignInPop from "./pop-overs/sign-in-pop.jsx";

import RecentProjectsTemplate from '../templates/includes/recent-projects';
import Loader from '../templates/includes/loader';

import {ProjectsUL} from "./projects-list.jsx";
import Reactlet from "./reactlet";

function old(application) {

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

const RecentProjects = ({user}) => (
  <section className="profile recent-projects">
    <h2><a href={user.userLink}>Your Projects →</a></h2>
    <CoverContainer style={getProfileStyle(user)}>
      <div className="profile-avatar">
        <div className="user-avatar-container">
          <a href={user.userLink}>
            <div className={`user-avatar ${userAvatarIsAnon}`} style={getAvatarStyle(user)} alt=""></div>
          </a>
          {userIsAnon && <div className="anon-user-sign-up"><SignInPop/></div>}
        </div>
      </div>
      <article className="projects">
        {projects}
      </article>
    </CoverContainer>
  </section>
);

export default RecentProjects;