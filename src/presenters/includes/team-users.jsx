import React from 'react';
import PropTypes from 'prop-types';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';


// Team Users list (in profile container)

export const TeamUsers = ({users, currentUserIsOnTeam, removeUser, adminIds, api, teamId, currentUserIsTeamAdmin}) => {
  let userIsTeamAdmin = (user) => {
    return adminIds.includes(user.id);
  };
  return (
    <UserPopoversList users={users} adminIds={adminIds}>
      {(user, togglePopover) => <TeamUserInfoPop 
        api={api} 
        teamId={teamId} 
        togglePopover={togglePopover} 
        user={user} 
        currentUserIsOnTeam={currentUserIsOnTeam} 
        currentUserIsTeamAdmin={currentUserIsTeamAdmin}
        removeUserFromTeam={() => removeUser(user.id)}                         
        userIsTeamAdmin={userIsTeamAdmin(user)}
      />}
    </UserPopoversList>
  );
};

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array,
};


// Add Team User

export const AddTeamUser = (props) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <span className="add-user-container">
        <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
        {visible && <AddTeamUserPop {...props} togglePopover={togglePopover}/>}
      </span>
    )}
  </PopoverContainer>
);
