import React from 'react';

export const ProjectOptionsPop = ({project, application, projectItemPresenter, userPagePresenter}) => {
  const self = {

    stopPropagation(event) {
      return event.stopPropagation();
    },

    pinnedProjectIds() {
      return application.user().pins().map(pin => pin.projectId);
    },

    hiddenIfProjectIsPinned() {
      if (project.isPinnedByUser(application) || project.isPinnedByTeam(application)) {
        return 'hidden';
      }
    }, 

    hiddenUnlessProjectIsPinned() {
      if (!project.isPinnedByUser(application) && !project.isPinnedByTeam(application)) {
        return 'hidden';
      }
    },

    hiddenUnlessPageIsTeamPage() {
      if (!application.pageIsTeamPage()) { return 'hidden'; }
    },
        
    hiddenIfPageIsTeamPage() {
      if (application.pageIsTeamPage()) { return 'hidden'; }
    },
    
  };
  
  function stopPropagation(event) {
    return event.stopPropagation();
  }
  
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
                  
  function deleteProject(event) {
    return userPagePresenter.deleteProject(project, event);
  }
      
  function leaveProject(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${project.name()}?`;
    if (window.confirm(prompt)) {
      return userPagePresenter.leaveProject(project, event);
    }
  }
  
  return (
    <dialog class="pop-over project-options-pop disposable" onClick={stopPropagation}>
      <section class="pop-over-actions"> //hiddenIfProjectIsPinned
      <div class="button-link" onClick={addPin}>
        <button class="button-small has-emoji button-tertiary">
          <span>Pin This </span>
          <span class="emoji pushpin"></span>
        </button>
      </div>
      </section>
      
      <section class="pop-over-actions"> //hiddenUnlessProjectIsPinned
      <div class="button-link" onClick={removePin}>
        <button class="button-small has-emoji button-tertiary">
          <span>Un-Pin This </span>
          <span class="emoji pushpin"></span>
        </button>
      </div>
      </section>

      {application.pageIsTeamPage() ? (
      <section class="pop-over-actions team-options danger-zone last-section"> //hiddenUnlessPageIsTeamPage
      <button class="button-small has-emoji button-tertiary" onClick={removeProjectFromTeam}>
        <span>Remove Project </span>
        <span class="emoji thumbs_down"></span>
      </button>
      </section>
        ) : (
      <section class="pop-over-actions danger-zone last-section"> //hiddenIfPageIsTeamPage
      <button class="button button-small has-emoji button-tertiary" onClick={deleteProject}>
        <span>Delete This </span>
        <span class="emoji bomb"></span>
      </button>
      <button class="button button-small has-emoji button-tertiary" onClick={leaveProject}>
        <span>Leave This </span>
        <span class="emoji wave"></span>
      </button>
      </section>
        );}
    </dialog>
  );
};



export default ProjectOptionsPop;