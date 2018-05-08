/* global analytics */

import moment from 'moment-mini';

import HeaderTemplate from '../templates/includes/header';

import ProjectModel from "../models/project";

import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import Reactlet from "./reactlet";

import React from 'react';
import PropTypes from 'prop-types';






const Header = () => {
  
/*
header(role="banner")
  .header-info
    a(href=@baseUrl)
      img.logo(src=@logo alt="Glitch")

  nav(role="navigation")  
    form(action="#{@baseUrl}search" method="get" role="search" @submit)
      label.screen-reader-text(for="search-projects") Search Glitch projects
      input.search-input(name="q" id="search-projects" placeholder="bots, apps, users" value=@application.searchQuery)

    = @NewProjectPop
    
    span(class=@hiddenIfSignedIn)
      = @SignInPop
    a(href="https://glitch.com/edit/" data-track="resume coding" class=@hiddenUnlessSignedIn)
      .button.button-small.button-cta Resume Coding
    = @UserOptionsPop
    
    
    
    <header role="banner">
   <div class="header-info"><a href="/"><img class="logo" src="https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch"></a></div>
   <nav role="navigation">
      <form action="/search" method="get" role="search"><label class="screen-reader-text" for="search-projects">Search Glitch projects
         </label><input id="search-projects" class="search-input" name="q" placeholder="bots, apps, users">
      </form>
      <span id="reactlet-NewProjectPopContainer-24">
         <span>
            <div class="button-wrap"><button class="button-small" data-track="open new-project pop">New Project</button></div>
         </span>
      </span>
      <span class="hidden"><span id="reactlet-SignInPopContainer-25"><span><button class="button button-small">Sign in</button></span></span></span>
      <a class="" href="https://glitch.com/edit/" data-track="resume coding">
         <div class="button button-small button-cta">Resume Coding</div>
      </a>
      <span id="reactlet-UserOptionsPopContainer-26">
         <span>
            <div class="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true"><button class="user"><img src="https://avatars3.githubusercontent.com/u/12502380?v=4" width="30px" height="30px" alt="User options"><span class="down-arrow icon"></span></button></div>
         </span>
      </span>
   </nav>
</header>

*/ 
  
  return (
    <header role="banner">
      <div class="header-info">
        <a href="/"><img class="logo" src="https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch"></a>
      </div>
     
     <nav role="navigation">
        <form action="/search" method="get" role="search"><label class="screen-reader-text" for="search-projects">Search Glitch projects
           </label><input id="search-projects" class="search-input" name="q" placeholder="bots, apps, users">
        </form>
        <span id="reactlet-NewProjectPopContainer-24">
           <span>
              <div class="button-wrap"><button class="button-small" data-track="open new-project pop">New Project</button></div>
           </span>
        </span>
        <span class="hidden"><span id="reactlet-SignInPopContainer-25"><span><button class="button button-small">Sign in</button></span></span></span>
        <a class="" href="https://glitch.com/edit/" data-track="resume coding">
           <div class="button button-small button-cta">Resume Coding</div>
        </a>
        <span id="reactlet-UserOptionsPopContainer-26">
           <span>
              <div class="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true"><button class="user"><img src="https://avatars3.githubusercontent.com/u/12502380?v=4" width="30px" height="30px" alt="User options"><span class="down-arrow icon"></span></button></div>
           </span>
        </span>
     </nav>
  </header>
    );
};

export default Header;

function oldPresenter(application) {
  
  const getTeamsPojo = function(teams) { 
    
    if (!teams || !teams.length) {
      return [];
    }
    
    // Teams load in two passes, first as an incomplete object,
    // then as a model. Filter out the incomplete teams.
    teams = teams.filter(team => team.I !== undefined);
    
    return teams.map(({name, url, teamAvatarUrl}) => ({
      name: name(),
      url: url(),
      teamAvatarUrl: teamAvatarUrl(),
    }));
  };

  var self = {

    application,
    baseUrl: application.normalizedBaseUrl(),
  
    hiddenUnlessUserIsExperienced() {
      if (!application.currentUser().isAnExperiencedUser()) { return 'hidden'; }
    },

    logo() {
      const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
      const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
      const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";
      const hour = moment().format('HH');
      if ((hour >= 16) && (hour <=18)) {
        return LOGO_SUNSET;
      } else if ((hour > 18) || (hour <= 8)) {
        return LOGO_NIGHT;
      } 
      return LOGO_DAY;
      
    },

    hiddenIfSignedIn() {
      if (application.currentUser().login()) { return 'hidden'; }
    },
        
    hiddenUnlessSignedIn() {
      if (!application.currentUser().login()) { return 'hidden'; }
    },
        
    SignInPop() {
      return Reactlet(SignInPop);
    },
    
    NewProjectPop() {
      const projectIds = [
        'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
        'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
        '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
      ];
      const projects = ProjectModel.getProjectsByIds(application.api(), projectIds);
      const fetchedProjects = projects.filter(project => project.fetched());
      const newProjects = fetchedProjects.map((project) => {
        const props = project.asProps();

        //Deliberately hide the user list 
        props.users = [];
        return props;
      });

      return Reactlet(NewProjectPop, {newProjects});
    },

    UserOptionsPop() {
      const user = application.currentUser();
      if(!user.fetched()) {
        return;
      }
      const props = {
        teams: getTeamsPojo(user.teams()),
        profileLink: `/@${user.login()}`,
        avatarUrl: user.avatarUrl(),
        showNewStuffOverlay() {
          return application.overlayNewStuffVisible(true);
        },
        signOut() {
          analytics.track("Logout");
          analytics.reset();
          localStorage.removeItem('cachedUser');
          return location.reload();
        },
      };

      return Reactlet(UserOptionsPop, props);
    },
    
    submit(event) {
      if (event.target.children.q.value.trim().length === 0) {
        return event.preventDefault();
      }
    },
  };
        
  return HeaderTemplate(self);
}
