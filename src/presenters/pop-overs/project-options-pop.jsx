import React from 'react';

const PopOverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
)

export const ProjectOptionsPop = ({
  projectName, projectIsPinned, closeAllPopOvers, 
  pageIsTeamPage, togglePinnedState, deleteProject, 
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
    closeAllPopOvers();
    $(projectContainer).one('animationend', () => togglePinnedState());
    return $(projectContainer).addClass(className);
  }
     
  function clickLeave(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${projectName}?`;
    if (window.confirm(prompt)) {
      return leaveProject(event);
    }
  }
  
  return (
    <dialog className="pop-over project-options-pop disposable">
      <section className="pop-over-actions">
        { projectIsPinned ? (
          <PopOverButton onClick={removePin} text="Un-Pin This" emoji="pushpin"/>
        ) : (
          <PopOverButton onClick={addPin} text="Pin This" emoji="pushpin"/>
        )}
      </section>


      {pageIsTeamPage ? (
        <section className="pop-over-actions team-options danger-zone last-section">
          <PopOverButton onClick={removeProjectFromTeam} text="Remove Project" emoji="thumbs_down"/>
        </section>
      ) : (
        <section className="pop-over-actions danger-zone last-section">
          <PopOverButton onClick={deleteProject} text="Delete This" emoji="bomb"/>
          <PopOverButton onClick={clickLeave} text="Leave This" emoji="wave"/>
        </section>
      )}
    </dialog>
  );
};

export default ProjectOptionsPop;