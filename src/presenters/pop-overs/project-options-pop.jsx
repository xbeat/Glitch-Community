import React from 'react';

export const ProjectOptionsPop = ({project, application, projectItemPresenter, deleteProject, leaveProject}) => {
 
  function addPin(event) {
    const projectContainer = event.target.closest('li');
    application.closeAllPopOvers();
    $(projectContainer).one('animationend', () => projectItemPresenter.togglePinnedState());
    return $(projectContainer).addClass('slide-up');
  }
  
  function removePin(event) {
    const projectContainer = event.target.closest('li');
    application.closeAllPopOvers();
    $(projectContainer).one('animationend', () => projectItemPresenter.togglePinnedState());
    return $(projectContainer).addClass('slide-down');
  }
  
  function removeProjectFromTeam() {
    return application.team().removeProject(application, project);
  }
  
  const projectIsPinned = project.isPinnedByUser(application) || project.isPinnedByTeam(application);
  
  return (
    <dialog className="pop-over project-options-pop disposable">
      { projectIsPinned ? (
        <section className="pop-over-actions">
          <div className="button-link" onClick={removePin}>
            <button className="button-small has-emoji button-tertiary">
              <span>Un-Pin This </span>
              <span className="emoji pushpin"></span>
            </button>
          </div>
        </section>
      ) : (
        <section className="pop-over-actions">
          <div className="button-link" onClick={addPin}>
            <button className="button-small has-emoji button-tertiary">
              <span>Pin This </span>
              <span className="emoji pushpin"></span>
            </button>
          </div>
        </section>
      )}

      {application.pageIsTeamPage() ? (
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
          <button className="button button-small has-emoji button-tertiary" onClick={leaveProject}>
            <span>Leave This </span>
            <span className="emoji wave"></span>
          </button>
        </section>
      )}
    </dialog>
  );
};

export default ProjectOptionsPop;