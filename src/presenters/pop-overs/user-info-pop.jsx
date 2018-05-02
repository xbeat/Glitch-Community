import React from 'react';
import PropTypes from 'prop-types';

const UserThanks = (thanks) => (
  <div className="result-description">
    {thanks.thanks}
    &nbsp;
    <span className="emoji sparkling_heart" />
  </div>
);

const UserInfoPop = (user) => (
  <dialog className="pop-over user-info-pop">
    <section className="pop-over-info ">
      <a href={user.link}>
        <img className="avatar" src={user.avatar} alt={`User avatar for ${user.login}`}/>
      </a>
      <div className="name" title={user.name}>{user.name}</div>
      <div className="description" title={user.login}>@{user.login}</div>
      { user.thanksCount > 0 && <UserThanks thanks={user.thanksString} />}
    </section>
    <section className="pop-over-actions last-section">
      <p>remove from team</p>
      <span className="emoji wave" />
    </section>
  </dialog>
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
  avatar: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  thanksCount: PropTypes.number.isRequired,
  thanksString: PropTypes.string,
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


// todo: remove user-result styles(?)
// todo: remove //temp files


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

