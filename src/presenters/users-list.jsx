import React from 'react';
  
const UsersList = () => (
  <section className="by-fogcreek" role="complementary">
    <h2>Made By Fog Creek</h2>
    <img src={logo} alt="Fog Creek logo"/>
    <p>
      You might know us for making Trello, <a href="https://manuscript.com/">Manuscript</a>, FogBugz, and co-creating Stack Overflow. 
      We're <a href="https://www.fogcreek.com">a friendly, self-funded company</a> that's
      been helping people make stuff for over {age} years.
    </p>
  </section>
);

export default UserList;



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

/*
- glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267"

span
  .users(class=@hiddenIfShowAsGlitchTeam)
    - @users().forEach (user) ->
      - {userLink, tooltipName, style, hiddenIfSignedIn, anonAvatar, alt, hiddenUnlessSignedIn, userAvatarUrl} = user
      a.user(href=userLink data-tooltip=tooltipName data-tooltip-left=true style=style)
        img.anon-avatar(class=hiddenIfSignedIn width=32 height=32 src=anonAvatar alt=alt)
        img(class=hiddenUnlessSignedIn width=32 height=32 src=userAvatarUrl alt=alt)

  .users(class=@hiddenUnlessShowAsGlitchTeam)
    .user.made-by-glitch(data-tooltip='Glitch Team' data-tooltip-left=true style="background-color:#74ecfc")
      img(width=32 height=32 src=glitchTeamAvatar alt="Glitch Team")

*/