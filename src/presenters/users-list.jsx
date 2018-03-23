import React from 'react';

const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
const UsersList = ({projectOrTeam, type}) => {
  function users() {
    return projectOrTeam.users();
  }

  function hiddenUnlessShowAsGlitchTeam() {
    if (type === 'team') {
      return 'hidden'; 
    }

    if (!(showAsGlitchTeam())) { return 'hidden'; }
  }

   function hiddenIfShowAsGlitchTeam() {
      if (type !== 'team') {
        if (showAsGlitchTeam()) { return 'hidden'; }
      }
    }
  
  function showAsGlitchTeam() {
    return projectOrTeam && projectOrTeam.showAsGlitchTeam && projectOrTeam.showAsGlitchTeam();
  }

  return (
    <span>
      // hiddenIfShowAsGlitchTeam
      <div className="users">
        { users.map((user, key) => (
          <UserTile key={key} {...user}></UserTile>
        ))}
      </div>
      
      //hiddenUnlessShowAsGlitchTeam
      //.user.made-by-glitch(data-tooltip='Glitch Team' data-tooltip-left=true style="background-color:#74ecfc")
      //img(width=32 height=32 src=glitchTeamAvatar alt="Glitch Team")
    </span>
  );
};

const UserTile = (
  {userLink,
   tooltipName, 
   style,
   hiddenIfSignedIn, 
   anonAvatar, 
   alt, 
   hiddenUnlessSignedIn, 
   userAvatarUrl}
  ) => (
/*
a.user(href=userLink data-tooltip=tooltipName data-tooltip-left=true style=style)
        img.anon-avatar(class=hiddenIfSignedIn width=32 height=32 src=anonAvatar alt=alt)
        img(class=hiddenUnlessSignedIn width=32 height=32 src=userAvatarUrl alt=alt)
        */
);

/*

span
  .users(class=@hiddenIfShowAsGlitchTeam)
    - @users().forEach (user) ->
      - {userLink, tooltipName, style, hiddenIfSignedIn, anonAvatar, alt, hiddenUnlessSignedIn, userAvatarUrl} = user
      

  .users(class=@hiddenUnlessShowAsGlitchTeam)
    .user.made-by-glitch(data-tooltip='Glitch Team' data-tooltip-left=true style="background-color:#74ecfc")
      img(width=32 height=32 src=glitchTeamAvatar alt="Glitch Team")

*/

export default UsersList;