import React from 'react';

import PropTypes from 'prop-types';
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
      togglePinnedState: projectOptions.togglePinnedState(project),
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
    return <UsersList users={project.users}/>
  }
  
  return ( 

    <li>
      <Users glitchTeam={project.showAsGlitchTeam}/>

      {projectOptions && (
        <div className="project-options button-borderless opens-pop-over hidden visible" onClick={showProjectOptionsPop}> 
          <div className="down-arrow"></div>
        </div>
      )}
    
      <a href={project.link} onClick={showProject}>
        <div className={['project', project.private ? 'private-project' : ''].join(' ')} 
          style={{backgroundColor: categoryColor, borderBottomColor:categoryColor}}
          data-track="project" data-track-label={project.domain}>
          <div className="project-container">
            <img className="avatar" src={project.avatar} alt={`${project.domain} avatar`}/>
            <button className={project.isRecentProject ? "button-cta" : ""}>
              <span className="private-project-badge"></span>
              <div className="project-name">{project.domain}</div>
            </button>
            <div className="description">{project.description}</div>
            <div className="overflow-mask" style={{backgroundColor: categoryColor}}></div>
          </div>
        </div>
      </a>
    </li>
  );
};

ProjectItem.propTypes = {
  closeAllPopOvers: PropTypes.func.isRequired,
  project: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isPinnedByTeam: PropTypes.bool.isRequired,
    isPinnedByUser: PropTypes.bool.isRequired,
    isRecentProject: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    showOverlay: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  categoryColor: PropTypes.string,
  projectOptions: PropTypes.shape({
    togglePinnedState: PropTypes.func,
    deleteProject: PropTypes.func,
    leaveProject: PropTypes.func,
    removeProjectFromTeam: PropTypes.func,
  }),
}


export default ProjectItem;