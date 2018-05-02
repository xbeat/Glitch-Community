import React from 'react';
import PropTypes from 'prop-types';

const UserInfoPop = (user) => (
  <dialog className="pop-over user-info-pop">
    <section className="pop-over-info user-result">
      
      
      <li className="result" tabIndex="0" onClick={() => user.action(user)}>
        <img className="avatar" src={user.avatar} alt={`User avatar for ${user.login}`}/>
        <div className="result-name" title={user.name}>{user.name}</div>
        <div className="result-description" title={user.login}>@{user.login}</div>
        { user.thanks > 0 && <UserThanks thanks={user.thanks} />}
      </li>

      
      <input onChange={(event) => {this.searchProjects(event.target.value);}} id="team-project-search" className="pop-over-input search-input pop-over-search" placeholder="Search for a project" />
    </section>
    <section className="pop-over-actions results-list">
      { this.state.isSearching && <Loader /> }
      <ul className="results">
        { this.state.searchResults.map((project, key) => (
          <ProjectResultItem key={key} {...project}/>
        ))}
      </ul>
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
  link: PropTypes.string.isRequired,
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

