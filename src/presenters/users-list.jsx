import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from './pop-overs/popover-container.jsx';
import {ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName, getLink} from '../models/user.js';

function getStyle({color}) {
  return {backgroundColor: color};
}

function addDefaultSrc(event) {
  event.target.src = ANON_AVATAR_URL;
}

const UserAvatar = ({
  alt, 
  avatarUrl,
}) => (
  <img onError={addDefaultSrc} className="user-list-avatar" width="32px" height="32px" src={avatarUrl} alt={alt}/>
);

UserAvatar.propTypes = {
  alt: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};

const UserTile = (user) => (
  <a href={getLink(user)} className="user" data-tooltip={getDisplayName(user)} data-tooltip-left="true" style={getStyle(user)}>
    <UserAvatar avatarUrl={getAvatarThumbnailUrl(user)} alt={getDisplayName(user)} />
  </a>
);

UserTile.propTypes = {
  id: PropTypes.number.isRequired,
  login: PropTypes.string,
  name: PropTypes.string,
  avatarThumbnailUrl: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export const PopulatedUsersList = ({users, extraClass="" }) => (
  <ul className={`users ${extraClass}`}>
    {users.map(user => (
      <li key={user.id}>
        <UserTile {...user} />
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
  const avatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  const style = getStyle({color: "#74ecfc"});
  return (
    <ul className={`users ${extraClass}`}>
      <li>
        <span className="user made-by-glitch" data-tooltip={name} data-tooltip-left="true" style={style}>
          <UserAvatar avatarUrl={avatar} alt={name}/>
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

export default UsersList;

const UserPopoverTile = ({children, ...user}) => (
  <PopoverContainer>
    {({visible, togglePopover}) => (
      <div className="button-wrap">
        <button onClick={togglePopover} className="user button-unstyled" data-tooltip={getDisplayName(user)} data-tooltip-left="true" style={getStyle(user)}>
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
  color: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export const UserPopoversList = ({users, children}) => (
  <ul className="users">
    {users.map(user => (
      <li key={user.id}>
        <UserPopoverTile {...user}>
          {(togglePopover) => children(user, togglePopover)}
        </UserPopoverTile>
      </li>
    ))}
  </ul>
);

UserPopoversList.propTypes = {
  users: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
};