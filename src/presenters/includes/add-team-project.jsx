import React from 'react';
import PropTypes from 'prop-types';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const AddTeamProject = ({currentUserIsOnTeam, ...props}) => {
  if(!currentUserIsOnTeam) {
    return null;
  }
  
  const disabledIfProjectLimitReached = () => {
    if (props.projectLimitIsReached) {
      return 'disabled'
    }
  }
  
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className={`button add-project has-emoji opens-pop-over ${disabledIfProjectLimitReached()} ${props.extraButtonClass}`} onClick={togglePopover}>
              Add Project <span className="emoji bento-box" role="img" aria-label=""></span>
            </button>
            { visible && <AddTeamProjectPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

AddTeamProject.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  addProject: PropTypes.func.isRequired,
  myProjects: PropTypes.array.isRequired,
  projectLimitIsReached: PropTypes.bool.isRequired,
  teamProjects: PropTypes.array.isRequired,
  extraButtonClass: PropTypes.string,
};

export default AddTeamProject;
