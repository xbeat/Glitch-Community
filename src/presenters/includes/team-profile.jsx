import React from 'react';
import PropTypes from 'prop-types'

const UserAvatarContainer = ({teamAvatarStyle,isCurrentUserOnTeam,uploadAvatar,teamName}) => {
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
        </h1>
      </div>
    </div>
  /*
.user-avatar-container(class=@hiddenUnlessTeamFetched)
  .user-information
    h1.username= @teamName()
      span(data-tooltip=@verifiedTeamTooltip)
        img.verified(src=@verifiedImage class=@hiddenUnlessVerified)

    .users-information
      = @TeamUsers
      = @addTeamUserButton

    p.thanks(class=@hiddenUnlessTeamHasThanks)= @teamThanks()
      span= " "
      span.emoji.sparkling_heart

    p.description.content-editable(class=@hiddenUnlessCurrentUserIsOnTeam keyup=@updateDescription blur=@applyDescription placeholder="Tell us about your team" contenteditable=true role="textbox" aria-multiline=true spellcheck=false)=@initialTeamDescription                
    p.description.read-only(class=@hiddenIfCurrentUserIsOnTeam class=@hiddenIfNoDescription)= @description
  */
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

