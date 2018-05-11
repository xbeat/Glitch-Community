import React from 'react';
import PropTypes from 'prop-types'

class TeamDescription extends React.Component() {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {isCurrentUserOnTeam} = this.props;
    if(!isCurrentUserOnTeam) {
      if(!description) {
        
      return (
        <p className="description read-only">{description}</p>
        );
    }
  }
/*
  p.description.content-editable(class=@hiddenUnlessCurrentUserIsOnTeam keyup=@updateDescription blur=@applyDescription placeholder="Tell us about your team" contenteditable=true role="textbox" aria-multiline=true spellcheck=false)=@initialTeamDescription                
  p.description.read-only(class=@hiddenIfCurrentUserIsOnTeam class=@hiddenIfNoDescription)= @description
*/
}

const UserAvatarContainer = ({
  teamAvatarStyle,
  isCurrentUserOnTeam,
  uploadAvatar,
  teamName,
  verifiedTeamTooltip,
  isVerifiedTeam,
  verifiedImage,
  hasTeamThanks,
  teamThanks,
}) => {
  return (
    <div className="user-avatar-container">
      <div className="user-avatar" style={teamAvatarStyle}>
        { isCurrentUserOnTeam && (
          <button className="button-small button-tertiary upload-avatar-button" onClick={uploadAvatar}>
            Upload Avatar
          </button>
        )}
      </div>
      <div className="user-information">
        <h1 className="username">{teamName}
          <span data-tooltip={verifiedTeamTooltip}>
            { isVerifiedTeam && <img className="verified" src={verifiedImage}/> }
          </span>
        </h1>
        <div className="users-information">
          <TeamUsers/>
          <addTeamUserButton/>
        </div>
        { hasTeamThanks && (
          <p className="thanks">
            {teamThanks} <span className="emoji sparkling_heart"/>
          </p>
        )}
      </div>
      <TeamDescription/>
    </div>
  );
};

const TeamProfile = ({teamProfileStyle,isTeamFetched, isCurrentUserOnTeam, ...props}) => {
  return (
    <section className="profile">
      <div className="profile-container" style={teamProfileStyle}>
        <div className="profile-info">
          { !isTeamFetched && <Loader/> }
          
          { isTeamFetched && <UserAvatarContainer {...props}/>}
        </div>
      </div>
      {isCurrentUserOnTeam && (
        <button className="button-small button-tertiary upload-cover-button" onClick={uploadCover}>
          Upload Cover  
        </button>
      )}
    </section>
  )
}

export default TeamProfile;

