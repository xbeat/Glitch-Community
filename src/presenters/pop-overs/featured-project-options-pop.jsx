import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

// import NestedPopover from './popover-nested.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);

// Featured Project Options Content
const FeaturedProjectOptionsContent = ({...props}) => {
    
  return(
    <dialog className="pop-over project-options-pop">
      <section className="pop-over-actions">
        <PopoverButton onClick="" text="Unfeature"/>
      </section>
      <section className="pop-over-actions">
        <PopoverButton onClick="" text="Edit Default View"/>
        <PopoverButton onClick="" text="Edit Height"/>
      </section>
    </dialog>
  ); 
};


// Project Options Pop
const FeaturedProjectOptionsPop = ({...props}) => {
  return(
    <FeaturedProjectOptionsContent {...props}/>
  );
};

FeaturedProjectOptionsPop.propTypes = {
  api: PropTypes.any,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func.isRequired,
  currentUserIsOnProject: PropTypes.bool.isRequired,
};
FeaturedProjectOptionsPop.defaultProps = {
  currentUserIsOnProject: false
};

// Project Options Container
// create as stateful react component
export default function FeaturedProjectOptions({projectOptions={}, project, api}, {...props}) {
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
              { visible && <FeaturedProjectOptionsPop {...props} {...projectOptions} project={project} api={api} currentUser={user} togglePopover={togglePopover} currentUserIsOnProject={currentUserIsOnProject(user)}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>     
  );
}

FeaturedProjectOptions.propTypes = {
  api: PropTypes.func,
  currentCollectionId: PropTypes.number,
  project: PropTypes.object.isRequired,
};

