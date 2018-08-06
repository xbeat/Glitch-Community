import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

const ProjectOptionsPop = ({
  projectId, projectName,
  addPin, removePin, deleteProject, 
  leaveProject, removeProjectFromTeam,
  togglePopover,
}) => {
  
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, {once: true});
    projectContainer.classList.add(className);
    togglePopover();
  }
  
  function clickAddPin(event) {
    animate(event, 'slide-up', () => addPin(projectId));
  }
  
  function clickRemovePin(event) {
    animate(event, 'slide-down', () => removePin(projectId));
  }
  
  function clickLeave(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${projectName}?`;
    if (window.confirm(prompt)) {
      leaveProject(projectId, event);
    }
  }
  
  function clickDelete(event) {
    animate(event, 'slide-down', () => deleteProject(projectId));
  }
    
  return (
    <dialog className="pop-over project-options-pop">
      <section className="pop-over-actions">
        {!!addPin && <PopoverButton onClick={clickAddPin} text="Pin" emoji="pushpin"/>}
        {!!removePin && <PopoverButton onClick={clickRemovePin} text="Un-Pin" emoji="pushpin"/>}
      </section>
      {!!leaveProject &&
        <section className="pop-over-actions danger-zone">
          {<PopoverButton onClick={clickLeave} text="Leave" emoji="wave"/>}
        </section>
      }
      <section className="pop-over-actions danger-zone last-section">
        {!!removeProjectFromTeam && <PopoverButton onClick={() => removeProjectFromTeam(projectId)} text="Remove Project" emoji="thumbs_down"/>}
        {!!deleteProject && <PopoverButton onClick={clickDelete} text="Delete" emoji="bomb"/>}
      </section>
    </dialog>
  );
};

ProjectOptionsPop.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  togglePopover: PropTypes.func.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  currentUser: PropTypes.object.isRequired,
};

export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
  }
  
  const popupProps = {
    projectId: project.id,
    projectName: project.domain,
  };
  
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <div>
          <button className="project-options button-borderless opens-pop-over" onClick={togglePopover}> 
            <div className="down-arrow"></div>
          </button>
          { visible && <ProjectOptionsPop {...popupProps} {...projectOptions} togglePopover={togglePopover}/> }
        </div>
      )}
    </PopoverContainer>
  );
}