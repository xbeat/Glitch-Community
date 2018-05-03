// replaces team-user-avatar.js / jade

import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from '../pop-overs/popover-container.jsx';

import UserInfoPop from '../pop-overs/user-info-pop.jsx';


const TeamUser = (props) => {
  console.log(props);
  // let {user} = props
  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="user team-user-avatar" title={props.user.login} data-tooltip={props.user.tooltipName} data-tooltip-left="true" style="background-color: {props.user.color};">
          <img width="32" height="32" src={props.user.userAvatarUrl} onClick={togglePopover} />
          {visible && <UserInfoPop {...props}/>}
        </div>
      )}
    </PopoverContainer>
  );
};

export default TeamUser;


// .user.team-user-avatar(title=@login data-tooltip=@tooltipName data-tooltip-left=true @style)
//   img(width=32 height=32 src=@avatarUrl @alt click=@toggleUserInfoPop)
//   .button-borderless(click=@toggleUserInfoPop)
//     .down-arrow

//   = @UserInfoPop



// import UserInfoPop from './pop-overs/user-info-pop.jsx';
// import Reactlet from "./reactlet";

// export default function(application, user) {

//   var self = { 

//     team: application.team,
    
//     UserInfoPop() {
//       const currentUserIsOnTeam = application.team().currentUserIsOnTeam(application);
//       const props = {
//         id: user.id(),
//         color: user.color(),
//         name: user.name(),
//         login: user.login(),
//         avatar: user.userAvatarUrl('large'),
//         link: user.userLink(),
//         thanksCount: user.thanksCount(),
//         thanksString: user.userThanks(),
//         isOnTeam: self.userIsOnTeam(),
//         currentUserIsOnTeam: currentUserIsOnTeam,
//         removeUserFromTeam: () => application.team().removeUser(application, user),
//         // closeAllPopOvers: () => application.closeAllPopOvers()
//       };
//       return Reactlet(UserInfoPop, props);
//     },

//     userIsOnTeam() {
//       let teamId = self.team().id;
//       if (!user.teams()) {
//         return false;
//       }
//       if (user.teams().find(team => {
//         team.id === teamId;
//       })) {
//         return true;
//       }
//     },
    
//     login() {
//       return user.login();
//     },

//     tooltipName() {
//       return user.tooltipName();
//     },

//     style() {
//       return {backgroundColor: user.color()};
//     },

//     avatarUrl() {
//       return user.userAvatarUrl('large');
//     },

//     alt() {
//       return user.alt();
//     },
//   };

// }
