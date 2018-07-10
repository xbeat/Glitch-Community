import React from 'react';
import PropTypes from 'prop-types';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const DeleteTeam = ({currentUserIsOnTeam, ...props}) => {
  if(!currentUserIsOnTeam) {
    return null;
  }
  
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button add-project has-emoji opens-pop-over danger-zone" onClick={togglePopover}>
              Delete Team <span className="emoji bomb" role="img" aria-label=""></span>
            </button>
            { visible && <AddTeamProjectPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

DeleteTeam.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default DeleteTeam;
