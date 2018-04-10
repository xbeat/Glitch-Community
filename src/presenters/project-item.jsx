import React from 'react';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import {UsersList, GlitchTeamUsersList} from "./users-list.jsx";
import Reactlet from "./reactlet";

function getProps() {
  let project = this;
  let application = null;
  
  function projectLink() {
    if (project.isRecentProject) {
      return project.editUrl();
    } 
    return `/~${project.domain()}`;
  }
  
  return {
    link: projectLink(),
    showProject: (event) => {
      event.preventDefault();
      event.stopPropagation();
      return project.showOverlay(application);
    },
    isRecentProject: project.isRecentProject,
    private: project.private(),
    name: project.name(),
    isPinnedByTeam: project.isPinnedByTeam(application),
    isPinnedByUser: project.isPinnedByUser(application),
    id: project.id(),
    avatar: project.avatar(),
    domain: project.domain(),
    description: project.description(),
    showAsGlitchTeam: !!(project.showAsGlitchTeam && project.showAsGlitchTeam()),
    
  };
    
  
}

export const ProjectItem = ({application, project, categoryColor, projectOptions={}}) => {

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

  function togglePinnedState() {
    let obj = application.user();
    if (application.pageIsTeamPage()) {
      obj = application.team()
      
      if (project.isPinnedByTeam) {
        return application.team().removePin(application, project.id);
      } 
    return application.team().addPin(application, project.id);
    } 
    if (project.isPinnedByUser) {
      return application.user().removePin(application, project.id);
    } 
    return application.user().addPin(application, project.id);
  }
  
  const Users = ({glitchTeam}) => {
    if(glitchTeam) {
      return <GlitchTeamUsersList/> 
    }
    return <UsersList users={project.users().map(user => user.asProps())}/>
  }

  
  return ( 

    <li>
      <Users glitchTeam={project.showAsGlitchTeam}/>

      {userHasProjectOptions && (
        <div class="project-options button-borderless opens-pop-over hidden visible" onClick={showProjectOptionsPop}> 
          <div class="down-arrow"></div>
        </div>
      )}
    
      <a href={project.link} onClick={project.showProject}>
        <div class={['project', project.private ? 'private-project' : ''].join(' ')} 
          style={{backgroundColor: categoryColor, borderBottomColor:categoryColor}}
          data-track="project" data-track-label={project.domain}>
          <div class="project-container">
            <img class="avatar" src={project.avatar} alt={`${project.domain} avatar`}/>
            <button class={project.isRecentProject ? "button-cta" : ""}>
              <span class="private-project-badge"></span>
              <div class="project-name">{project.domain}</div>
            </button>
            <div class="description">{project.description}</div>
            <div class="overflow-mask" style={{backgroundColor: categoryColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};


export default ProjectItem;