import React from 'react';
import PropTypes from 'prop-types';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';


// Team Users list (in profile container)

export const TeamUsers = (props) => {
  
  let userIsTeamAdmin = (user) => {
    return props.adminIds.includes(user.id);
  };
  return (
    <UserPopoversList users={props.users} adminIds={props.adminIds} currentUserIsTeamAdmin={props.currentUserIsTeamAdmin}>
      {(user, togglePopover) => 
        <TeamUserInfoPop 
          userIsTeamAdmin={userIsTeamAdmin(user)}
          togglePopover={togglePopover} 
          user={user} 
          {...props}
        />
      }
    </UserPopoversList>
  );
};

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array.isRequired,
};


// Add Team User

export const AddTeamUser = (props) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <span className="add-user-container">
        <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
        {visible && 
          <AddTeamUserPop 
            {...props}
            togglePopover={togglePopover}
          />
        }
      </span>
    )}
  </PopoverContainer>
);
