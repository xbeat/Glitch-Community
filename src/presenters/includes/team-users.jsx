import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import UserPo

//this file exists as a shim for the team page until it gets reactified and this can go inline

const TeamUser = (props) => {
  const {user} = props;
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <React.Fragment>
          <div data-tooltip={user.tooltipName} data-tooltip-left="true">
            <button className="team-user-avatar user-avatar button-flat" title={user.login} onClick={togglePopover} style={user.style}>
              <img width="32" height="32" src={user.userAvatarUrl} alt={`User Properties for ${user.login}`}/>
            </button>
          </div>
          {visible && <UserInfoPop {...props}/>}
        </React.Fragment>
      )}
    </PopoverContainer>
  );
};
TeamUser.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    tooltipName: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

const TeamUsersOld = ({users, currentUserIsOnTeam}) => (
  <ul className="users team-users">
    {users.map((data) => (
      <li key={data.user.id} className="user">
        <TeamUser {...data} currentUserIsOnTeam={currentUserIsOnTeam} />
      </li>
    ))}
  </ul>
);
TeamUsersOld.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    removeUserFromTeam: PropTypes.func.isRequired,
  }).isRequired).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamUsersOld;

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  
);