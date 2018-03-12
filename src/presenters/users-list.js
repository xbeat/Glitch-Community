const UsersListTemplate = require("../templates/includes/users-list");
const UserAvatarTemplate = require("../templates/includes/user-avatar");

import UserAvatar from "./includes/user-avatar.jsx";
import Reactlet from "./reactlet";

module.exports = function(projectOrTeam, type) {
  
  var self = {
  
    users() {
      return projectOrTeam.users();
    },

    userAvatars() {
      return self.users().map(user => {
        const props = {
          userAvatarUrl: user.userAvatarUrl(),
          anonAvatar: user.anonAvatar(),
          alt: user.alt(),
          userLink: user.userLink(),
          login: user.login(),
          tooltipName: user.tooltipName(),
          style: user.style(),
          isSignedIn: user.isSignedIn(),
        }
        return Reactlet(UserAvatar, props);
      });
    },

    hiddenUnlessShowAsGlitchTeam() {
      if (type === 'team') {
        return 'hidden'; 
      }

      let showAsGlitchTeam = projectOrTeam && projectOrTeam.showAsGlitchTeam();
      if (!(showAsGlitchTeam)) { return 'hidden'; }
    },

    hiddenIfShowAsGlitchTeam() {
      let showAsGlitchTeam = projectOrTeam && projectOrTeam.showAsGlitchTeam();
      if (type !== 'team') {
        if (showAsGlitchTeam) { return 'hidden'; }
      }
    }
  };

  return UsersListTemplate(self);
};
