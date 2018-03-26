import React from 'react';

  
export const UsersList = ({users, extraClass="" }) => (
  <div className={`users ${extraClass}`}>
    { users.map((user, key) => (
      <UserTile key={key} {...user}></UserTile>
    ))}
  </div>
);

const UserTile = ({
  userLink,
  tooltipName, 
  style,
  alt, 
  userAvatarUrl,
  extraClass="",
}) => (
  <a className={`user ${extraClass}`} href={userLink} data-tooltip={tooltipName} data-tooltip-left="true" style={style}>
    <img width="32px" height="32px" src={userAvatarUrl} alt={alt}/>
  </a>
);
  
export const GlitchTeamUsersList = () => {
  const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
  const user = {
    userLink: null,
    tooltipName: "Glitch-Team",
    style: {backgroundColor:"#74ecfc"},
    alt: "Glitch Team Avatar",
    userAvatarUrl: glitchTeamAvatar,
    extraClass: "made-by-glitch",
  };
  
  return (
    <UsersList users={[user]}></UsersList>
  );
}

export default UsersList;