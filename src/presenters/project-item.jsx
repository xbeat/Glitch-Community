import React from 'react';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import {UsersList, GlitchTeamUsersList} from "./users-list.jsx";
import Reactlet from "./reactlet";

export const ProjectItem = ({application, project, categoryColor, projectOptions={}}) => {
    
  function projectLink() {
    if (project.isRecentProject) {
      return self.editorLink();
    } 
    return `/~${project.domain()}`;
      
  }

  function  editorLink() {
    return project.editUrl();
  }

  function showProject(event) {
    event.preventDefault();
    event.stopPropagation();
    return project.showOverlay(application);
  }

  function buttonCtaIfCurrentUser() {
    if (project.isRecentProject) {
      return "button-cta";
    }
  }

  function projectIsPrivate() {
    return project.private() ? 'private-project' : '';
  }

  function showProjectOptionsPop(event) {
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
  }
    
  const userHasProjectOptions = application.user().isOnUserPageForCurrentUser(application) || application.team().currentUserIsOnTeam(application);

  function stopPropagation(event) {
    return event.stopPropagation();
  }

  function togglePinnedState() {
    if (application.pageIsTeamPage()) {
      return self.toggleTeamPin();
    } 
    return self.toggleUserPin();
      
  }

  function toggleUserPin() {
    if (project.isPinnedByUser(application)) {
      return application.user().removePin(application, project.id());
    } 
    return application.user().addPin(application, project.id());
      
  }

  function  toggleTeamPin() {
    if (project.isPinnedByTeam(application)) {
      return application.team().removePin(application, project.id());
    } 
    console.log('toggleTeamPin addpin');
    return application.team().addPin(application, project.id());
      
  }
  
  function avatar() {
    return project.avatar();
  }
  
  const Users = ({glitchTeam}) => {
    if(glitchTeam) {
      return <GlitchTeamUsersList/> 
    }
    return <UsersList users={project.users().map(user => user.asProps())}/>
  }

  
  return ( 

    <li>
      <Users glitchTeam={project.showAsGlitchTeam && project.showAsGlitchTeam()}/>

      {userHasProjectOptions && (
        <div class="project-options button-borderless opens-pop-over hidden visible" onClick={showProjectOptionsPop}> 
          <div class="down-arrow"></div>
        </div>
      )}
    
      <a href={projectLink} onClick={showProject}>
        <div class={`project ${projectIsPrivate()}`} style={{backgroundColor: categoryColor, borderBottomColor:categoryColor}} data-track="project" data-track-label={project.domain}>
          <div class="project-container">
            <img class="avatar" src={avatar} alt={`${projectDomain} avatar`}/>
            <button class={buttonCtaIfCurrentUser}>
              <span class="private-project-badge"></span>
              <div class="project-name">{projectDomain}</div>
            </button>
            <div class="description">{projectDescription}</div>
            <div class="overflow-mask" style={{backgroundColor: categoryColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};


export default ProjectItem;