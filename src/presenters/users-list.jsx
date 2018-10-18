import React from 'react';
import PropTypes from 'prop-types';

import {UserLink} from './includes/link.jsx';
import PopoverContainer from './pop-overs/popover-container.jsx';
import {Avatar, UserAvatar} from './includes/avatar.jsx';


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


// UserTile

export const UserTile = (user) => (
  <a href={getLink(user)} className="user" data-tooltip={getDisplayName(user)} data-tooltip-left="true" style={getStyle(user)}>
    <UserAvatar avatarUrl={getAvatarThumbnailUrl(user)} alt={getDisplayName(user)} />
  </a>
);
UserTile.propTypes = {
  id: PropTypes.number.isRequired,
  login: PropTypes.string,
  name: PropTypes.string,
  avatarThumbnailUrl: PropTypes.string,
  color: PropTypes.string.isRequired,
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
  const GLITCH_TEAM_AVATAR = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  return (
    <ul className={`users ${extraClass}`}>
      <li>
        <span className="user made-by-glitch">
          <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc"/>
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


// UserPopoversList

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return " (admin)";
  }
  return "";
};

export const UserPopoversList = ({users, adminIds, children}) => (
  <ul className="users">
    {users.map(user => (
      <li key={user.id}>
        <PopoverContainer>
          {({visible, togglePopover}) => (
            <div className="button-wrap">
              <button onClick={togglePopover} className="user button-unstyled">
                <UserAvatar user={user} suffix={adminStatusDisplay(adminIds, user)}/>
              </button>
              {!!visible && children(user, togglePopover)}
            </div>
          )}
        </PopoverContainer>
      </li>
    ))}
  </ul>
);

UserPopoversList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  children: PropTypes.func.isRequired,
  adminIds: PropTypes.array,
};

UserPopoversList.defaultProps = {
  adminIds: []
};
