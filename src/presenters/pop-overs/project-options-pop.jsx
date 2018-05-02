import React from 'react';
import PropTypes from 'prop-types';
import Popover from './pop-over.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

export const ProjectOptionsPop = ({
  projectId,
  projectName, projectIsPinned, togglePopover, 
  togglePinnedState, deleteProject, 
  leaveProject, removeProjectFromTeam
}) => {
  
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
        { projectIsPinned ? (
          <PopoverButton onClick={removePin} text="Un-Pin This" emoji="pushpin"/>
        ) : (
          <PopoverButton onClick={addPin} text="Pin This" emoji="pushpin"/>
        )}
      </section>


      {removeProjectFromTeam && (
        <section className="pop-over-actions team-options danger-zone last-section">
          <PopoverButton onClick={() => removeProjectFromTeam(projectId)} text="Remove Project" emoji="thumbs_down"/>
        </section>
      )}
      {(deleteProject && leaveProject) && (
        <section className="pop-over-actions danger-zone last-section">
          <PopoverButton onClick={clickDelete} text="Delete This" emoji="bomb"/>
          <PopoverButton onClick={clickLeave} text="Leave This" emoji="wave"/>
        </section>
      )}
    </dialog>
  );
};

ProjectOptionsPop.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  projectIsPinned: PropTypes.bool.isRequired,
  togglePopover: PropTypes.func.isRequired,
  togglePinnedState: PropTypes.func,
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
    projectIsPinned: project.isPinnedByUser || project.isPinnedByTeam
  };
  
  return (
    <Popover>
      {({togglePopover, visible}) => (
        <React.Fragment>
          <button className="project-options button-borderless opens-pop-over" onClick={togglePopover}> 
            <div className="down-arrow"></div>
          </button>
          { visible && <ProjectOptionsPop {...popupProps} {...projectOptions} togglePopover={togglePopover}/> }
        </React.Fragment>
      )}
    </Popover>
  );
}