import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';

const TeamUser = (props) => {
  const {user} = props;
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <React.Fragment>
          <button className="user team-user-avatar" title={user.login} onClick={togglePopover} data-tooltip={user.tooltipName} data-tooltip-left="true" style={user.style}>
            <img width="32" height="32" src={user.userAvatarUrl} alt={`User Properties for ${user.login}`}/>
          </button>
          {visible && <UserInfoPop {...props}/>}
        </React.Fragment>
      )}
    </PopoverContainer>
  );
};jmhgk
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

const TeamUsers = ({users, currentUserIsOnTeam}) => {
  return (
    <div className="users team-users">
      {users.map(({user, removeUserFromTeam}) => (
        <TeamUser key={user.id} user={user} currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={removeUserFromTeam} />
      ))}
    </div>
  );
};
TeamUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    removeUserFromTeam: PropTypes.func.isRequired,
  }).isRequired).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export default TeamUsers;