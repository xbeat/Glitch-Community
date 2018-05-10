import React from 'react';

import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

import User from '../../models/user';

//this file exists as a shim for the team page until it gets reactified and this can go inline

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  <UserPopoversList users={users}>
    {user => <UserInfoPop currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={() => removeUserFromTeam(User({user}))} />}
  </UserPopoversList>
);

export default TeamUsers;