import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

import OverlaySelectCollection from '../overlays/overlay-select-collection.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);


// Project Options Pop

const ProjectOptionsPop = ({...props}) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, {once: true});
    projectContainer.classList.add(className);
    props.togglePopover();
  }
  
  function leaveProject(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${props.project.name}?`;
    if (window.confirm(prompt)) {
      props.leaveProject(props.project.id, event);
    }
  }
    
  function leaveTeamProject() {
    props.leaveTeamProject(props.project.id, props.currentUser.id);
  }
  
  function joinTeamProject() {
    props.joinTeamProject(props.project.id, props.currentUser);
  }
  
  function addToCollection(){
    // TO DO - trigger add to collection modal
  }
    
  function animateThenAddPin(event) {
    animate(event, 'slide-up', () => props.addPin(props.project.id));
  }
  
  function animateThenRemovePin(event) {
    animate(event, 'slide-down', () => props.removePin(props.project.id));
  }
  
  function animateThenDeleteProject(event) {
    animate(event, 'slide-down', () => props.deleteProject(props.project.id));
  }
  

  return (
    <dialog className="pop-over project-options-pop">
      {props.currentUserIsOnProject &&
        <section className="pop-over-actions">
          {!!props.addPin && <PopoverButton onClick={animateThenAddPin} text="Pin " emoji="pushpin"/>}
          {!!props.removePin && <PopoverButton onClick={animateThenRemovePin} text="Un-Pin " emoji="pushpin"/>}
          {!!props.addProjectToCollection && 
              <OverlaySelectCollection domain={props.project.domain}>
                <PopoverButton onClick={null} text="Add to Collection " emoji="framed_picture"/>
              </OverlaySelectCollection>
          }
        </section>
      }

      {(props.joinTeamProject && props.leaveTeamProject) &&
        <section className="pop-over-actions collaborator-actions">
          {!props.currentUserIsOnProject &&
            <PopoverButton onClick={joinTeamProject} text="Join Project " emoji="rainbow"/>
          }
          {props.currentUserIsOnProject &&
            <PopoverButton onClick={leaveTeamProject} text="Leave Project " emoji="wave"/>
          }
        </section>
      }
      
      {(props.leaveProject && props.project.users.length > 1) &&
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={leaveProject} text="Leave Project " emoji="wave"/>
        </section>
      }

      <section className="pop-over-actions danger-zone last-section">
        {!!props.removeProjectFromTeam && <PopoverButton onClick={() => props.removeProjectFromTeam(props.project.id)} text="Remove Project " emoji="thumbs_down"/>}
        {!!props.removeProjectFromCollection && <PopoverButton onClick={() => props.removeProjectFromCollection(props.project.id)} text="Remove Project " emoji="thumbs_down"/>}
         
        {!props.addProjectToCollection && <PopoverButton onClick={null} text="Remove from Collection" emoji="thumbs_down"/>}
        {props.currentUserIsOnProject && <PopoverButton onClick={animateThenDeleteProject} text="Delete Project " emoji="bomb"/>}
      </section>
    </dialog>
  );
};

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    users: PropTypes.array.isRequired,
  }),
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  addToCollection: PropTypes.func, 
  removeProjectFromTeam: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
  currentUserIsOnProject: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  removeProjectFromCollection: PropTypes.func,
};
ProjectOptionsPop.defaultProps = {
  currentUserIsOnProject: false
};


// Project Options Container

export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
  }

  function currentUserIsOnProject(user) {
    let projectUsers = project.users.map(projectUser => {
      return projectUser.id;
    });
    if (projectUsers.includes(user.id)) {
      return true;
    }
  }

  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <CurrentUserConsumer>
          {user => (
            <div>
              <button className="project-options button-borderless opens-pop-over" onClick={togglePopover}> 
                <div className="down-arrow" />
              </button>
              { visible && <ProjectOptionsPop project={project} {...projectOptions} togglePopover={togglePopover} currentUser={user} currentUserIsOnProject={currentUserIsOnProject(user)}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>
  );
}

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
};