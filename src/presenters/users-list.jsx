import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from './pop-overs/popover-container.jsx';
import {ANON_AVATAR_URL} from '../models/user.js';

const GLITCH_TEAM_AVATAR = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
const ADMIN_ICON = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fadmin.svg?1532107187144"

// UserAvatar

function addDefaultSrc(event) {
  event.target.src = ANON_AVATAR_URL;
}

const UserAvatar = ({
  alt, 
  userAvatarUrl,
}) => (
  <img onError={addDefaultSrc} className="user-list-avatar" width="32px" height="32px" src={userAvatarUrl} alt={alt}/>
);

UserAvatar.propTypes = {
  alt: PropTypes.string.isRequired,
  userAvatarUrl: PropTypes.string.isRequired,
};


// UserTile

const UserTile = ({
  userLink,
  tooltipName, 
  style,
  alt, 
  userAvatarUrl,
  extraClass="",
}) => (
  <a className={`user ${extraClass}`} href={userLink} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
    <UserAvatar userAvatarUrl={userAvatarUrl} alt={alt} />
  </a>
);

UserTile.propTypes = {
  userLink: PropTypes.string,
  tooltipName: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  extraClass: PropTypes.string,
};


// PopulatedUsersList

export const PopulatedUsersList = ({users, extraClass="" }) => (
  <ul className={`users ${extraClass}`}>
    {users.map((user, key) => (
      <li key={key}>
        <UserTile {...user} />
      </li>
    ))}
  </ul>
);

PopulatedUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  extraClass: PropTypes.string,
};


// UsersList

const UsersList = ({glitchTeam=false, users, ...props}) => {
  if(glitchTeam) {
    users = [{
      userLink: null,
      tooltipName: "Glitch-Team",
      style: {backgroundColor: "#74ecfc"},
      alt: "Glitch Team Avatar",
      userAvatarUrl: GLITCH_TEAM_AVATAR,
      extraClass: "made-by-glitch",
    }];
  }
  return <PopulatedUsersList users={users} {...props}/>;
};

UsersList.propTypes = {
  glitchTeam: PropTypes.bool,
};

export default UsersList;


//UserPopoverTile

const UserPopoverTile = ({
  tooltipName, 
  style,
  alt, 
  userAvatarUrl,
  children,
  adminIds,
}) => {
  
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button onClick={togglePopover} className="user button-unstyled" data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
            <UserAvatar userAvatarUrl={userAvatarUrl} alt={alt} />
            
            <span className="admin-badge">admin</span>
          </button>
          {!!visible && children(togglePopover)}
        </div>
      )}
    </PopoverContainer>
  )
};

UserPopoverTile.propTypes = {
  userLink: PropTypes.string,
  tooltipName: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  extraClass: PropTypes.string,
  children: PropTypes.func.isRequired,
  adminIds: PropTypes.array
};


// UserPopoversList

export const UserPopoversList = ({users, children, adminIds}) => (
  <ul className="users">
    {users.map((user, key) => (
      <li key={key}>
        <UserPopoverTile {...user} adminIds={adminIds} >
          {(togglePopover) => children(user, togglePopover)}
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
