import React from 'react';
import PropTypes from 'prop-types';

const UserResultItem = () => (
  <li className="result" tabIndex="0" click={this.props.action}>
  </li>
);

UserResultItem.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string,
  login: PropTypes.string.isRequired,
  thanks: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};


export default UserResultItem;



// // temp
// .result-container(style=@hoverBackground)
//   li.result.user-result(tabindex=0 click=@addUserToTeam keydown=@userResultKey)
//     img.result-avatar(src=@avatarUrl)
//     .result-information
//       .result-name.result-info(class=@hiddenUnlessName)= @name
//       .result-login.result-info= @login
//       - # email goes here
//       .result-thanks(class=@hiddenUnlessThanks class=@hiddenUnlessShowingThanks)= @thanks
//         span.emoji.sparkling_heart

// temp

// TODO: This file was created by bulk-decaffeinate.
// Check that you're happy with the conversion, then remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// const UserResultTemplate = require("../templates/includes/user-result");

// module.exports = function(application, user, options) {

//   options = options || {};
  
//   var self = {

//     login() {
//       return `@${user.login()}`;
//     },

//     name() {
//       return user.name();
//     },

//     // truncatedDescription: ->
//     //   user.truncatedDescription()

//     hoverBackground() {
//       return {
//         backgroundImage: `url('${user.coverUrl()}')`,
//         backgroundColor: user.coverColor('small'),
//       };
//     },

//     hiddenUnlessName() {
//       if (!user.name()) { return 'hidden'; }
//     },
    
//     addUserToTeam() {
//       console.log(application);
//       console.log(self.application);
//       console.log(`adding ${user.name()} to ${application.team().id()}`);
//       application.team().addUser(application, user);
//       return application.closeAllPopOvers();
//     },
    
//     userResultKey(event) {
//       const ENTER = 13;
//       console.log(event);
//       if (event.keyCode === ENTER) {
//         return self.addUserToTeam();
//       }
//     },    

//     avatarUrl() {
//       return user.userAvatarUrl('large');
//     },

//     hiddenUnlessThanks() {
//       if (!(user.thanksCount() > 0)) { return "hidden"; }
//     },

//     hiddenUnlessShowingThanks() {
//       if (!options.showThanks) { return 'hidden'; }
//     },

//     thanks() {
//       return user.userThanks();
//     },
//   };
    
    

//   return UserResultTemplate(self);
// };

