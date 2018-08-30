import React from 'react';
import PropTypes from 'prop-types';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoAndRemovePop from '../pop-overs/team-user-info-and-remove-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';


// Team Users list (in profile container)

export const TeamUsers = (props) => (
  <UserPopoversList users={props.users} adminIds={props.adminIds}>
    {(user, togglePopover) => 
      <TeamUserInfoAndRemovePop 
        userIsTeamAdmin={props.adminIds.includes(user.id)}
        togglePopover={togglePopover}
        user={user}
        {...props}
      />
    }
  </UserPopoversList>
);

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
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
