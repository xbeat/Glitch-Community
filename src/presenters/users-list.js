const UsersListTemplate = require("../templates/includes/users-list");
const UserAvatarTemplate = require("../templates/includes/user-avatar");

import UserAvatar from "./includes/user-avatar.jsx";
import Reactlet from "./reactlet";

module.exports = function(projectOrTeam, type) {
  
  var self = {
  
    users() {
      return projectOrTeam.users();
    },

    /*
    userAvatars() {
      const UserAvatar = ({userAvatarUrl, anonAvatar, alt, userLink, login, tooltipName, style, isSignedIn}) => { 
        let img = <img className="anon-avatar" width="32" height="32" src={anonAvatar} alt={alt}></img>
        if(isSignedIn) {
          img = <img width="32" height="32" src={userAvatarUrl} alt={alt}></img>
        }

        return (
          <a className="user" href={userLink} title={login} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
            {img}
          </a>
        );
      }
    },
    */

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
