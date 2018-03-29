import React from 'react';

export const ProjectOptionsPop = ({
  projectName, projectIsPinned, closeAllPopOvers, 
  pageIsTeamPage, togglePinnedState, deleteProject, 
  leaveProject, removeProjectFromTeam
}) => {
 
  function addPin(event) {
    const projectContainer = event.target.closest('li');
    closeAllPopOvers();
    $(projectContainer).one('animationend', () => togglePinnedState());
    return $(projectContainer).addClass('slide-up');
  }
  
  function removePin(event) {
    const projectContainer = event.target.closest('li');
    closeAllPopOvers();
    $(projectContainer).one('animationend', () => togglePinnedState());
    return $(projectContainer).addClass('slide-down');
  }
     
  function clickLeave(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${projectName}?`;
    if (window.confirm(prompt)) {
      return leaveProject(event);
    }
  }

  
  return (
    <dialog className="pop-over project-options-pop disposable">
      { projectIsPinned ? (
        <section className="pop-over-actions">
          <div className="button-link" >
            <button className="button-small has-emoji button-tertiary" onClick={removePin}>
              <span>Un-Pin This </span>
              <span className="emoji pushpin"></span>
            </button>
          </div>
        </section>
      ) : (
        <section className="pop-over-actions">
          <div className="button-link" >
            <button className="button-small has-emoji button-tertiary">
              <span>Pin This </span>
              <span className="emoji pushpin"></span>
            </button>
          </div>
        </section>
      )}

      {pageIsTeamPage ? (
        <section className="pop-over-actions team-options danger-zone last-section">
          <button className="button-small has-emoji button-tertiary" onClick={removeProjectFromTeam}>
            <span>Remove Project </span>
            <span className="emoji thumbs_down"></span>
          </button>
        </section>
      ) : (
        <section className="pop-over-actions danger-zone last-section">
          <button className="button button-small has-emoji button-tertiary" onClick={deleteProject}>
            <span>Delete This </span>
            <span className="emoji bomb"></span>
          </button>
          <button className="button button-small has-emoji button-tertiary" onClick={clickLeave}>
            <span>Leave This </span>
            <span className="emoji wave"></span>
          </button>
        </section>
      )}
    </dialog>
  );
};

export default ProjectOptionsPop;