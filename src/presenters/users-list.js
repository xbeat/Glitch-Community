const UsersListTemplate = require("../templates/includes/users-list");
import Reactlet from "./reactlet";

module.exports = function(projectOrTeam, type) {
  
  var self = {
  
    users() {
      return projectOrTeam.users();
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
