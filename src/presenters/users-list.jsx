import React from 'react';

  
export const UsersList = ({users}) => (
  <div className="users">
    { users.map((user, key) => (
      <UserTile key={key} {...user}></UserTile>
    ))}
  </div>
);

const UserTile = (
  {
    userLink,
    tooltipName, 
    style,
    alt, 
    userAvatarUrl,
  }
) => (
  <a className="user" href={userLink} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
    <img width={32} height={32} src={userAvatarUrl} alt={alt}/>
  </a>
);
  
export const GlitchTeamUsersList = () => {
  const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
  return (
    <div className="user made-by-glitch" data-tooltip="Glitch-Team" data-tooltip-left="true" style={{"background-color":"#74ecfc"}}>
      <img width={32} height={32} src={glitchTeamAvatar} alt="Glitch Team Avatar"/>
    </div>
  );
}

export default UsersList;