import React from 'react';
import PropTypes from 'prop-types';

import DeleteTeamPop from '../pop-overs/delete-team-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import AdminOnlyBadge from './admin-only-badge.jsx' 

const DeleteTeam = ({...props}) => {
  
  const notifyAdmin = (event) => {
    console.log('👀🔼', event, event.nativeEvent)
    if (!props.currentUserIsTeamAdmin) {
      props.notifyAdminOnly()
      event.stopPropagation()
      event.nativeEvent.preventDefault()
      event.nativeEvent.stopImmediatePropagation()


    }
    // return togglePopover if not admin then block popover w prevent default
  }
  return (
    <section className="add-project-container">
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap" onClick={notifyAdmin}>
            <button className="button button-small button-tertiary has-emoji opens-pop-over danger-zone" onClick={togglePopover}>
              <span>Delete {props.teamName} </span>
              <span className="emoji bomb" role="img" aria-label="" />
              <AdminOnlyBadge currentUserIsTeamAdmin={props.currentUserIsTeamAdmin} />
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
