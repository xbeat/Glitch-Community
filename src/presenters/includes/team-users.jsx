import React from 'react';
import PropTypes from 'prop-types';

import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

export const TeamUsers = ({users, currentUserIsOnTeam, removeUser, userIsTeamAdmin}) => (
  <UserPopoversList users={users}>
    {(user, togglePopover) => <TeamUserInfoPop togglePopover={togglePopover} user={user} currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={() => removeUser(user.id)} userIsTeamAdmin={userIsTeamAdmin(user)} />}
  </UserPopoversList>
);
TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired,
};

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