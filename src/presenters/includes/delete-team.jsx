import React from 'react';
import PropTypes from 'prop-types';

import DeleteTeamPop from '../pop-overs/delete-team-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

const DeleteTeam = ({...props}) => {
  const togglePopoverIfAdmin = (togglePopover) => {
    togglePopover
  }
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button button-small button-tertiary has-emoji opens-pop-over danger-zone" onClick={togglePopoverIfAdmin}>
              <span>Delete {props.teamName} </span>
              <span className="emoji bomb" role="img" aria-label="" />
              { !props.currentUserIsTeamAdmin && 
                <div className="status-badge">
                  <span className="status admin">Admins</span>
                </div> 
              }
            </button>
            { visible && <DeleteTeamPop {...props} togglePopover={togglePopover} /> }
          </div>
        )}
      </PopoverContainer>
    </section>
  );
};

DeleteTeam.propTypes = {
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  admins: PropTypes.func.isRequired,
  notifyAdminOnly: PropTypes.func.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};

export default DeleteTeam;
