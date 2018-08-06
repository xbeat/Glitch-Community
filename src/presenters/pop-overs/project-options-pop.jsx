import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

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
  
  function addPinAction(event) {
    animate(event, 'slide-up', () => props.addPin(props.project.id));
  }
  
  function removePinAction(event) {
    animate(event, 'slide-down', () => props.removePin(props.project.id));
  }
  
  function leaveProjectAction(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${props.project.name}?`;
    if (window.confirm(prompt)) {
      props.leaveProject(props.project.id, event);
    }
  }
  
  function currentUserIsOnProject() {
    let projectUsers = props.users.map(user => {
      return user.id
    })
    if (projectUsers.includes(props.currentUser.id)) {
      return true
    }
  }
  
  function leaveTeamProjectAction() {
    props.leaveTeamProject(props.project.id, props.currentUser.id)
  }
  
  function joinTeamProjectAction() {
    props.leaveTeamProject(props.project.id, props.currentUser.id)
  }
  
  function deleteAction(event) {
    animate(event, 'slide-down', () => props.deleteProject(props.project.id));
  }
  

  return (
    <dialog className="pop-over project-options-pop">
      <section className="pop-over-actions">
        {!!props.addPin && <PopoverButton onClick={addPinAction} text="Pin " emoji="pushpin"/>}
        {!!props.removePin && <PopoverButton onClick={removePinAction} text="Un-Pin " emoji="pushpin"/>}
      </section>
        <section className="pop-over-actions">
          {(!!props.joinTeamProject && !currentUserIsOnProject) &&
            <PopoverButton onClick={joinTeamProjectAction} text="Leave Project " emoji="wave"/>
          }          
          {(!!props.leaveTeamProject && props.project.users.length > 1 && currentUserIsOnProject) &&
            <PopoverButton onClick={leaveTeamProjectAction} text="Leave Project " emoji="wave"/>
          }
          {(!!props.leaveProject && props.project.users.length > 1 ) &&
            <PopoverButton onClick={leaveProjectAction} text="Leave Project " emoji="wave"/>
          }
        </section>
      
      {(!!props.leaveProject && props.project.users.length > 1 ) &&
        <section className="pop-over-actions danger-zone">
          <PopoverButton onClick={leaveProjectAction} text="Leave Project " emoji="wave"/>
        </section>
      }
      <section className="pop-over-actions danger-zone last-section">
        {!!props.removeProjectFromTeam && <PopoverButton onClick={() => props.removeProjectFromTeam(props.project.id)} text="Remove Project " emoji="thumbs_down"/>}
        {!!props.deleteProject && <PopoverButton onClick={deleteAction} text="Delete Project " emoji="bomb"/>}
      </section>
    </dialog>
  );
};

ProjectOptionsPop.propTypes = {
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
};


// Project Options Container

export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
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
              { visible && <ProjectOptionsPop project={project} {...projectOptions} togglePopover={togglePopover} currentUser={user} /> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>
  );
}

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
}