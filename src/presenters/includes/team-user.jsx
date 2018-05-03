import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';

const TeamUser = (props) => {
  console.log(props);
  let {user} = props;
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="user team-user-avatar" title={user.login} data-tooltip={user.tooltipName} data-tooltip-left="true" style={user.style}>
          <img width="32" height="32" src={user.userAvatarUrl} onClick={togglePopover} />
          {visible && <UserInfoPop {...props}/>}
        </div>
      )}
    </PopoverContainer>
  );
};

TeamUser.propTypes = {
  user: PropTypes.arrayOf(PropTypes.shape({
    login: PropTypes.string.isRequired,
    tooltipName: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
  })).isRequired,
  currentUserIsOnTeam: PropTypes.func.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

export default TeamUser;
