import React from 'react';

const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
const UsersList = ({users, showAsGlitchTeam}) => {

  return (
    <span>
      { showAsGlitchTeam ? (
        <div className="user made-by-glitch" data-tooltip="Glitch-Team" data-tooltip-left="true" style={{"background-color":"#74ecfc"}}>
          <img width={32} height={32} src={glitchTeamAvatar} alt="Glitch Team Avatar"/>
        </div>
      ) : (
        <div className="users">
          { users.map((user, key) => (
            <UserTile key={key} {...user}></UserTile>
          ))}
        </div>
      )}
      
    </span>
  );
};

const UserTile = (
  {userLink,
    tooltipName, 
    style,
    isSignedIn, 
    anonAvatar, 
    alt, 
    hiddenUnlessSignedIn, 
    userAvatarUrl}
) => (
  <a className="user" href={userLink} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
    { isSignedIn ? (
      <img width={32} height={32} src={userAvatarUrl} alt={alt}/>
    ) : (
      <img class="anon-avatar" width={32} height={32} src={anonAvatar} alt={alt}/>
    )}
  </a>
);

export default UsersList;