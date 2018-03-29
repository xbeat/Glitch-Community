import React from 'react';

export const ProjectOptionsPop = ({project, application, projectItemPresenter, userPagePresenter}) => {
  return (
    <dialog class="pop-over project-options-pop disposable">
      <section class="pop-over-actions hidden">
        <div class="button-link">
          <button class="button-small has-emoji button-tertiary">
            <span>Pin This
            </span>
            <span class="emoji pushpin"></span>
          </button>
        </div>
      </section>
      <section class="pop-over-actions">
        <div class="button-link">
          <button class="button-small has-emoji button-tertiary">
            <span>Un-Pin This</span>
            <span class="emoji pushpin"></span>
          </button>
        </div>
      </section>
    
      <section class="pop-over-actions team-options danger-zone last-section hidden">
        <button class="button-small has-emoji button-tertiary">
          <span>Remove Project</span>
          <span class="emoji thumbs_down"></span>
        </button></section><section class="pop-over-actions danger-zone last-section">
        <button class="button button-small has-emoji button-tertiary">
          <span>Delete This</span>
          <span class="emoji bomb"></span>
        </button>
        <button class="button button-small has-emoji button-tertiary">
          <span>Leave This</span><span class="emoji wave">
          </span></button>
      </section>
    </dialog>
  );
  
  /*
dialog.pop-over.project-options-pop.disposable(click=@stopPropagation @style)

  section.pop-over-actions(class=@hiddenIfProjectIsPinned)
    .button-link(click=@addPin)
      button.button-small.has-emoji.button-tertiary
        span Pin This
        span.emoji.pushpin
  section.pop-over-actions(class=@hiddenUnlessProjectIsPinned)
    .button-link(click=@removePin)
      button.button-small.has-emoji.button-tertiary
        span Un-Pin This
        span.emoji.pushpin

  section.pop-over-actions.team-options.danger-zone.last-section(class=@hiddenUnlessPageIsTeamPage)
    button.button-small.has-emoji.button-tertiary(click=@removeProjectFromTeam)
      span Remove Project
      span.emoji.thumbs_down
      
  section.pop-over-actions.danger-zone.last-section(class=@hiddenIfPageIsTeamPage)
    button.button.button-small.has-emoji.button-tertiary(click=@deleteProject)
      span Delete This
      span.emoji.bomb
    button.button.button-small.has-emoji.button-tertiary(click=@leaveProject)
      span Leave This
      span.emoji.wave  
*/
  
};



export default ProjectOptionsPop;