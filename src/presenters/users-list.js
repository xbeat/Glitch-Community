const UsersListTemplate = require("../templates/includes/users-list");

module.exports = function(projectOrTeam, type) {
  
  function showAsGlitchTeam() {
    return projectOrTeam && projectOrTeam.showAsGlitchTeam && projectOrTeam.showAsGlitchTeam();
  }
  
  var self = {
  
    users() {
      return projectOrTeam.users();
    },

    hiddenUnlessShowAsGlitchTeam() {
      if (type === 'team') {
        return 'hidden'; 
      }

      if (!(showAsGlitchTeam())) { return 'hidden'; }
    },

    hiddenIfShowAsGlitchTeam() {
      if (type !== 'team') {
        if (showAsGlitchTeam()) { return 'hidden'; }
      }
    }
  };

  return UsersListTemplate(self);
};
