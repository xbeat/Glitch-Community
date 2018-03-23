import React from 'react';

const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
const UsersList = ({users, showAsGlitchTeam}) => {
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
  
  /*function showAsGlitchTeam() {
    return projectOrTeam && projectOrTeam.showAsGlitchTeam && projectOrTeam.showAsGlitchTeam();
  }*/

  return (
    <span>
      // hiddenIfShowAsGlitchTeam
      { showAsGlitchTeam ? (
        <div className="user made-by-glitch" data-tooltip="Glitch-Team" data-tooltip-left="true" style={{"background-color":"#74ecfc"}}>
        <img width={32} height={32} src={glitchTeamAvatar} alt="Glitch Team Avatar"/>
      </div>
        )
        
      <div className="users">
        { users.map((user, key) => (
          <UserTile key={key} {...user}></UserTile>
        ))}
      </div>
      
      //hiddenUnlessShowAsGlitchTeam
      
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
  <a className="user" href={userLink} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
    //hiddenIfSignedIn
    <img class="anon-avatar" width={32} height={32} src={anonAvatar} alt={alt}/>
    //hiddenUnlessSignedIn
    <img width={32} height={32} src={userAvatarUrl} alt={alt}/>
    
  </a>
);

export default UsersList;