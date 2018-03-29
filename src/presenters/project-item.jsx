import React from 'react';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import {UsersList, GlitchTeamUsersList} from "./users-list.jsx";
import Reactlet from "./reactlet";

export const ProjectItem = ({application, project, category, projectOptions={}) => {
  var self = { 

    category,
    project,
    
    UsersList() {
      if(project.showAsGlitchTeam && project.showAsGlitchTeam()){
        return Reactlet(GlitchTeamUsersList, {});
      }
        
      const props = {
        users: project.users().map(user => user.asProps()),
      };
      return Reactlet(UsersList, props);
    },
    
    projectLink() {
      if (project.isRecentProject) {
        return self.editorLink();
      } 
      return `/~${project.domain()}`;
      
    },

    editorLink() {
      return project.editUrl();
    },

    showProject(event) {
      event.preventDefault();
      event.stopPropagation();
      return project.showOverlay(application);
    },

    buttonCtaIfCurrentUser() {
      if (project.isRecentProject) {
        return "button-cta";
      }
    },

    projectIsPrivate() {
      return project.private() ? 'private-project' : '';
    },

    showProjectOptionsPop(event) {
      application.closeAllPopOvers();
      event.stopPropagation();
      const button = $(event.target).closest('.opens-pop-over');
      
      let props = {
        projectName: project.name(),
        projectIsPinned: project.isPinnedByUser(application) || project.isPinnedByTeam(application),
        closeAllPopOvers: application.closeAllPopOvers,
        pageIsTeamPage: application.pageIsTeamPage(),
        togglePinnedState: self.togglePinnedState,
        deleteProject: (event) => projectOptions.deleteProject(project, event),
        leaveProject: (event) => projectOptions.leaveProject(project, event),
        removeProjectFromTeam: () => projectOptions.removeProjectFromTeam(project),
      };
      return button[0].after(Reactlet(ProjectOptionsPop, props));
    },
    
    userHasProjectOptions() {
      return application.user().isOnUserPageForCurrentUser(application) || application.team().currentUserIsOnTeam(application)
    },

    visibleIfUserHasProjectOptions() {
      if (self.userHasProjectOptions()) {                    
        return 'visible';
      }
    },

    stopPropagation(event) {
      return event.stopPropagation();
    },

    togglePinnedState() {
      if (application.pageIsTeamPage()) {
        return self.toggleTeamPin();
      } 
      return self.toggleUserPin();
      
    },

    toggleUserPin() {
      if (project.isPinnedByUser(application)) {
        return application.user().removePin(application, project.id());
      } 
      return application.user().addPin(application, project.id());
      
    },

    toggleTeamPin() {
      if (project.isPinnedByTeam(application)) {
        return application.team().removePin(application, project.id());
      } 
      console.log('toggleTeamPin addpin');
      return application.team().addPin(application, project.id());
      
    },

    style() {
      return {
        backgroundColor: (typeof category.color === 'function' ? category.color() : undefined),
        borderBottomColor: (typeof category.color === 'function' ? category.color() : undefined),
      };
    },

    maskStyle() {
      return {backgroundColor: (typeof category.color === 'function' ? category.color() : undefined)};
    },

    avatar() {
      return project.avatar();
    },
  };
  
  return null;
  /*
   li
  = @UsersList

  a(href=@projectLink click=@showProject)
    .project(@style data-track="project" data-track-label=@project.domain class=@projectIsPrivate)
      .project-container
        img.avatar(src=@avatar alt="#{@project.domain()} avatar")
        button(class=@buttonCtaIfCurrentUser)
          span.private-project-badge
          .project-name=@project.domain
        .description=@project.description
        .overflow-mask(style=@maskStyle)
    */
  <li>
    <div class="users "></div>
    { /*visibleIfUserHasProjectOptions */}
     <div class="project-options button-borderless opens-pop-over hidden visible" onClick={showProjectOptionsPop}> 
        <div class="down-arrow"></div>
     </div>
     <a href="/~community">
        <div class="project " data-track="project" data-track-label="community">
           <div class="project-container">
              <img class="avatar" src="https://cdn.glitch.com/project-avatar/2bdfb3f8-05ef-4035-a06e-2043962a3a13.png" alt="community avatar">
              <button class="">
                 <span class="private-project-badge"></span>
                 <div class="project-name">community</div>
              </button>
              <div class="description">The Glitch community site</div>
              <div class="overflow-mask"></div>
           </div>
        </div>
     </a>
</li>
  
};


export default ProjectItem;