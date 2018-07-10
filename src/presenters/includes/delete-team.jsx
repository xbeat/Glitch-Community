import React from 'react';
import PropTypes from 'prop-types';

import AddTeamProjectPop from '../pop-overs/add-team-project-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const DeleteTeam = ({...props}) => {
  
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button button-small button-tertiary has-emoji opens-pop-over danger-zone" onClick={togglePopover}>
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
  teamId: PropTypes.number.isRequired,
  //     { currentUserIsOnTeam && <DeleteTeam teamId={id} teamName={name} users={users} adminUsers={adminUsers}/> }

};

export default DeleteTeam;
