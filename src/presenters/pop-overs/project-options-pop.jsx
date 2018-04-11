import React from 'react';

const PopOverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
)

export const ProjectOptionsPop = ({
  projectId,
  projectName, projectIsPinned, closeAllPopOvers, 
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
    closeAllPopOvers();
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
    <dialog className="pop-over project-options-pop disposable">
      <section className="pop-over-actions">
        { projectIsPinned ? (
          <PopOverButton onClick={removePin} text="Un-Pin This" emoji="pushpin"/>
        ) : (
          <PopOverButton onClick={addPin} text="Pin This" emoji="pushpin"/>
        )}
      </section>


      {removeProjectFromTeam && (
        <section className="pop-over-actions team-options danger-zone last-section">
          <PopOverButton onClick={removeProjectFromTeam(projectId)} text="Remove Project" emoji="thumbs_down"/>
        </section>
      )}
      {(deleteProject && leaveProject) && (
        <section className="pop-over-actions danger-zone last-section">
          <PopOverButton onClick={clickDelete} text="Delete This" emoji="bomb"/>
          <PopOverButton onClick={clickLeave} text="Leave This" emoji="wave"/>
        </section>
      )}
    </dialog>
  );
};

class ProjectOptionsContainer extends React.Component {
  constructor() {
    super()
    this.state = { visible: false }
  }

  render() {
    const {projectOptions, closeAllPopOvers, project} = this.props;
    
    // If no project options are provided, render nothing.
    if(!Object.keys(projectOptions)) {
      return null;
    }
    
    const showProjectOptionsPop = (event) => {
      closeAllPopOvers();
      event.stopPropagation();
      this.setState({visible: true});
    }
    
    const props = {
      projectId: project.id,
      projectName: project.name,
      projectIsPinned: project.isPinnedByUser||project.isPinnedByTeam,
      closeAllPopOvers: closeAllPopOvers,
      projectOptions: projectOptions,
    };
    
    return (
      <span>
        <div className="project-options button-borderless opens-pop-over" onClick={showProjectOptionsPop}> 
          <div className="down-arrow"></div>
        </div>
        { this.state.visible && <ProjectOptionsPop {...{props}}></ProjectOptionsPop> }
      </span>
      );
  }
}

export default ProjectOptionsContainer;