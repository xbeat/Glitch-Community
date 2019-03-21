import React from 'react';
import PropTypes from 'prop-types';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';

const AddTeamProject = ({ currentUserIsOnTeam, ...props }) => {
  if (!currentUserIsOnTeam) {
    return null;
  }

  return (
    <section className="add-project-container">
      {/* Add disabled={props.projectLimitIsReached} once billing is ready */}
      <PopoverWithButton
        buttonClass={`add-project has-emoji ${props.extraButtonClass}`}
        buttonText={
          <>
            Add Project <span className="emoji bento-box" role="img" aria-label="" />
          </>
        }
      >
        {({ togglePopover }) => <AddTeamProjectPop {...props} togglePopover={togglePopover} />}
      </PopoverWithButton>
    </section>
  );
};

AddTeamProject.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
  extraButtonClass: PropTypes.string,
};

AddTeamProject.defaultProps = {
  extraButtonClass: '',
};

export default AddTeamProject;
