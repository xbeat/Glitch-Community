import React from 'react';

const glitchTeamAvatar = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  
const GlitchTeamUsersList = () => (
  <div className="user made-by-glitch" data-tooltip="Glitch-Team" data-tooltip-left="true" style={{"background-color":"#74ecfc"}}>
    <img width={32} height={32} src={glitchTeamAvatar} alt="Glitch Team Avatar"/>
  </div>
);

export default GlitchTeamUsersList;