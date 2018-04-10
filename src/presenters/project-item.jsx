import React from 'react';
import ProjectOptionsPop from "./pop-overs/project-options-pop.jsx";
import {UsersList, GlitchTeamUsersList} from "./users-list.jsx";
import Reactlet from "./reactlet";

export const ProjectItem = ({closeAllPopOvers, project, categoryColor, projectOptions}) => {

  function showProjectOptionsPop(event) {
    closeAllPopOvers();
    event.stopPropagation();
    const button = $(event.target).closest('.opens-pop-over');
      
    let props = {
      projectName: project.name,
      projectIsPinned: project.isPinnedByUser || project.isPinnedByTeam,
      closeAllPopOvers: closeAllPopOvers,
      pageIsTeamPage: projectOptions.pageIsTeamPage,
      togglePinnedState: projectOptions.togglePinnedState,
      deleteProject: (event) => projectOptions.deleteProject(project, event),
      leaveProject: (event) => projectOptions.leaveProject(project, event),
      removeProjectFromTeam: () => projectOptions.removeProjectFromTeam(project),
    };
    
    //todo: store 'is visible' state, and toggle that.
    // use the container patten.
    return button[0].after(Reactlet(ProjectOptionsPop, props));
  }
  
  function showProject() {
    event.preventDefault();
    event.stopPropagation();
    return project.showOverlay();
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

      {projectOptions && (
        <div class="project-options button-borderless opens-pop-over hidden visible" onClick={showProjectOptionsPop}> 
          <div class="down-arrow"></div>
        </div>
      )}
    
      <a href={project.link} onClick={showProject}>
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