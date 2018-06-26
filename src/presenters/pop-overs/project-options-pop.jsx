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
  leaveProject, removeProjectFromTeam
}) => {
  /*
  function addPin(event) {
    togglePin(event, 'slide-up');
  }
  
  function removePin(event) {
    togglePin(event, 'slide-down');
  }
  
  function togglePin(event, className) {
    const projectContainer = event.target.closest('li');
    togglePopover();
    $(projectContainer).one('animationend', () => togglePinnedState(projectId));
    return $(projectContainer).addClass(className);
  }
  */
  function clickLeave(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${projectName}?`;
    if (window.confirm(prompt)) {
      return leaveProject(projectId, event);
    }
  }
  
  function clickDelete(event) {
    return deleteProject(projectId, event);
  }
  
  return (
    <dialog className="pop-over project-options-pop">
      <section className="pop-over-actions">
        {!!addPin && <PopoverButton onClick={() => addPin(projectId)} text="Pin This" emoji="pushpin"/>}
        {!!removePin && <PopoverButton onClick={() => removePin(projectId)} text="Un-Pin This" emoji="pushpin"/>}
      </section>
      <section className="pop-over-actions danger-zone last-section">
        {!!removeProjectFromTeam && <PopoverButton onClick={() => removeProjectFromTeam(projectId)} text="Remove Project" emoji="thumbs_down"/>}
        {!!deleteProject && <PopoverButton onClick={clickDelete} text="Delete This" emoji="bomb"/>}
        {!!leaveProject && <PopoverButton onClick={clickLeave} text="Leave This" emoji="wave"/>}
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
};

export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
  }
  
  const popupProps = {
    projectId: project.id,
    projectName: project.name,
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