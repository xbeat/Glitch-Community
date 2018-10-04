import React from 'react';
import PropTypes from 'prop-types';

import {UserLink} from './includes/link.jsx';
import PopoverContainer from './pop-overs/popover-container.jsx';
import {ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName} from '../models/user.js';

function getStyle({color}) {
  return {backgroundColor: color};
}

const GLITCH_TEAM_AVATAR = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";

// UserAvatar

function addDefaultSrc(event) {
  event.target.src = ANON_AVATAR_URL;
}

const UserAvatarRaw = ({name, src, style}) => (
  <img onError={addDefaultSrc} className="user-list-avatar" width="32px" height="32px"
    src={getAvatarThumbnailUrl(user)} style={getStyle(user)} alt={getDisplayName(user)}
    data-tooltip={getDisplayName(user)} data-tooltip-left="true"
  />
);

const UserAvatar = ({user}) => (
  <UserAvatarRaw name={getDisplayName(user)} src={getAvatarThumbnailUrl(user)} style=
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
  }).isRequired,
};


// StaticUsersList

export const StaticUsersList = ({users, extraClass=""}) => (
  <ul className={`users ${extraClass}`}>
    {users.map(user => (
      <li key={user.id}>
        <span className="user">
          <UserAvatar user={user}/>
        </span>
      </li>
    ))}
  </ul>
);
StaticUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  extraClass: PropTypes.string,
};


// PopulatedUsersList

export const PopulatedUsersList = ({users, extraClass="" }) => (
  <ul className={`users ${extraClass}`}>
    {users.map(user => (
      <li key={user.id}>
        <UserLink user={user} className="user">
          <UserAvatar user={user} />
        </UserLink>
      </li>
    ))}
  </ul>
);
PopulatedUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  extraClass: PropTypes.string,
};

const GlitchTeamUsersList = ({extraClass=''}) => {
  const name = 'Glitch Team';
  const style = getStyle({color: "#74ecfc"});
  return (
    <ul className={`users ${extraClass}`}>
      <li>
        <span className="user made-by-glitch" data-tooltip={name} data-tooltip-left="true" style={style}>
          <UserAvatar avatarUrl={GLITCH_TEAM_AVATAR} alt={name}/>
        </span>
      </li>
    </ul>
  );
};

const UsersList = ({glitchTeam=false, users, extraClass}) => {
  if(glitchTeam) {
    return <GlitchTeamUsersList extraClass={extraClass}/>;
  }
  return <PopulatedUsersList users={users} extraClass={extraClass}/>;
};

UsersList.propTypes = {
  glitchTeam: PropTypes.bool,
};

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return " (admin)";
  }
  return "";
};

export default UsersList;

const UserPopoverTile = ({children, adminIds, ...user}) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <div className="button-wrap">
        <button 
          onClick={togglePopover} 
          className="user button-unstyled" 
          data-tooltip={getDisplayName(user) + adminStatusDisplay(adminIds, user)} 
          data-tooltip-left="true" 
          style={getStyle(user)}
        >
          <UserAvatar avatarUrl={getAvatarThumbnailUrl(user)} alt={getDisplayName(user)} />
        </button>
        {!!visible && children(togglePopover)}
      </div>
    )}
  </PopoverContainer>
);

UserPopoverTile.propTypes = {
  id: PropTypes.number.isRequired,
  login: PropTypes.string,
  name: PropTypes.string,
  avatarThumbnailUrl: PropTypes.string,
  color: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  adminIds: PropTypes.array.isRequired,
};


// UserPopoversList

export const UserPopoversList = ({...props}) => (
  <ul className="users">
    {props.users.map(user => (
      <li key={user.id}>
        <UserPopoverTile {...user} adminIds={props.adminIds}>
          {(togglePopover) => props.children(user, togglePopover)}
        </UserPopoverTile>
      </li>
    ))}
  </ul>
);

UserPopoversList.propTypes = {
  users: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  adminIds: PropTypes.array,
};

UserPopoversList.defaultProps = {
  adminIds: []
};
