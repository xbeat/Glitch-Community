import React from 'react';
import PropTypes from 'prop-types';

const UserInfoPop = (user) => (
  <dialog>f</p>
);


// dialog.pop-over.user-info-pop.disposable(click=@stopPropagation)

//   section.pop-over-info.user-result
//     ul.results
//       a(href=@userLink)
//         = UserResultPresenter(@application, @user, {showThanks: true})

//   section.pop-over-info.last-section.section-has-tertiary-buttons.danger-zone(class=@hiddenIfUserIsNotOnTeam)
//     button.button-small.has-emoji.button-tertiary.button-on-secondary-background(click=@removeUser)
//       span Remove from Team :: 
//       span.emoji.wave


UserInfoPop.propTypes = {
  id: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired, 
  name: PropTypes.string,
  login: PropTypes.string.isRequired,
  // description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isOnTeam: PropTypes.bool,
  currentUserIsOnTeam: PropTypes.bool,
  removeUserFromTeam: PropTypes.func
};

UserInfoPop.defaultProps = {
  isOnTeam: false,
  currentUserIsOnTeam: false,
  removeUserFromTeam: () => undefined
};

export default UserInfoPop;

// make not disposable




// module.exports = function(application, user) {

//   return {
  
//     application,
//     user,

//     stopPropagation(event) {
//       return event.stopPropagation();
//     },

//     userCover() {
//       return user.coverUrl('small');
//     },
      
//     userAvatarBackground() {
//       return {backgroundColor: user.color()};
//     },
  
//     userLink() {
//       return user.userLink();
//     },

//     removeUser() {
//       return application.team().removeUser(application, user);
//     },
    
//     name() {
//       return user.name();
//     },
    
//     avatarUrl() {
//       return user.userAvatarUrl('small');
//     },
    
//     hiddenIfUserIsCurrentUser() {
//       if (user.isCurrentUser(application)) { return 'hidden'; }
//     },
    
//     hiddenUnlessUserIsCurrentUser() {
//       if (!user.isCurrentUser(application)) { return 'hidden'; }
//     },
//   };
// };


// - UserResultPresenter = require "../../presenters/user-result"

