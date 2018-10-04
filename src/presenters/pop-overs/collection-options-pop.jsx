import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

import OverlaySelectCollection from '../overlays/overlay-select-collection.jsx';
import NestedPopover from './popover-nested.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

// Collection Options Content
const CollectionOptionsContent = ({ ...props}) => {
  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, {once: true});
    projectContainer.classList.add(className);
    props.togglePopover();
  
  
  return(
    <dialog className="pop-over project-options-pop">
      {props.currentUserIsOnProject 
        ? <section className="pop-over-actions">
            {!!props.addPin && <PopoverButton onClick={animateThenAddPin} text="Pin " emoji="pushpin"/>}
            {!!props.removePin && <PopoverButton onClick={animateThenRemovePin} text="Un-Pin " emoji="pushpin"/>}
            {!!props.addProjectToCollection && <PopoverButton onClick={addToCollection} text="Add to Collection " emoji="framed_picture"/>}

        </section>
        : <section className="pop-over-actions">
            {!!props.addProjectToCollection && <PopoverButton onClick={addToCollection} text="Add to Collection " emoji="framed_picture"/>}
        </section>
      }

      {(props.joinTeamProject && props.leaveTeamProject) &&
        <section className="pop-over-actions collaborator-actions">
          {!props.currentUserIsOnProject &&
            <PopoverButton onClick={joinTeamProject} text="Join Project " emoji="rainbow"/>
          }
          {props.currentUserIsOnProject &&
            <PopoverButton onClick={leaveTeamProject} text="Leave Project " emoji="wave"/>
          }
        </section>
      }
      
      {(props.leaveProject && props.project.users.length > 1) &&
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={leaveProject} text="Leave Project " emoji="wave"/>
        </section>
      }

      {props.currentUserIsOnProject && 
        <section className="pop-over-actions danger-zone last-section">
          {!!props.removeProjectFromTeam && <PopoverButton onClick={() => props.removeProjectFromTeam(props.project.id)} text="Remove Project " emoji="thumbs_down"/>}
          {!!props.removeProjectFromCollection && <PopoverButton onClick={() => props.removeProjectFromCollection(props.project.id)} text="Remove Project " emoji="thumbs_down"/>}

          {!props.addProjectToCollection && <PopoverButton onClick={() => props.removeProjectFromCollection(props.project.id)} text="Remove from Collection" emoji="thumbs_down"/>}
          {props.currentUserIsOnProject && <PopoverButton onClick={animateThenDeleteProject} text="Delete Project " emoji="bomb"/>}
        </section>
      }
    </dialog>
    );
}


// Project Options Pop
const ProjectOptionsPop = (props) => {
  return(
    <NestedPopover alternateContent={() => <AddProjectToCollectionPop project={props.project} {...props}/>}>
      { addToCollection => (
        <ProjectOptionsContent {...props} addToCollection={addToCollection}/>
        )}
    </NestedPopover>
  );
};

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    users: PropTypes.array.isRequired,
  }),
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
  currentUserIsOnProject: PropTypes.bool.isRequired,
};
ProjectOptionsPop.defaultProps = {
  currentUserIsOnProject: false
};

// Project Options Container
// create as stateful react component
export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
  }

  function currentUserIsOnProject(user) {
    let projectUsers = project.users.map(projectUser => {
      return projectUser.id;
    });
    if (projectUsers.includes(user.id)) {
      return true;
    }
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
              { visible && <ProjectOptionsPop project={project} {...projectOptions} togglePopover={togglePopover} currentUser={user} currentUserIsOnProject={currentUserIsOnProject(user)}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>
  );
}

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
};

