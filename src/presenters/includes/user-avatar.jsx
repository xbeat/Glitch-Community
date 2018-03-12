import React from 'react';

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

export default UserAvatar;
