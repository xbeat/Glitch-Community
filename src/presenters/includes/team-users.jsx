import React from 'react';

import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

//this file exists as a shim for the team page until it gets reactified and this can go inline

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  <UserPopoversList users={users}>
    {user => <UserInfoPop currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={removeUserFromTeam} />}
  </UserPopoversList>
);

export default TeamUsers;