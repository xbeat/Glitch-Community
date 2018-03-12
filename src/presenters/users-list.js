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
      const props = {
        users: self.users()
      }
      return Reactlet(UserAvatar, props);
      
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
