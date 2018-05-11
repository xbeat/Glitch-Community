import React from 'react';
import PropTypes from 'prop-types'

const TeamProfile = ({teamProfileStyle,isTeamFetched}) => {
  return (
    <section className="profile">
      <div className="profile-container" style={teamProfileStyle}>
        <div className="profile-info">
          { !isTeamFetched && <Loader/> }
        </div>
      </div>
    </section>
  )
}

/*
  section.profile
    .profile-container(style=@teamProfileStyle)
      .profile-info
        .loader(class=@hiddenIfTeamFetched)
          span= Loader(@application)

        .user-avatar-container(class=@hiddenUnlessTeamFetched)
          .user-avatar(style=@teamAvatarStyle)
            button.button-small.button-tertiary.upload-avatar-button(class=@hiddenUnlessCurrentUserIsOnTeam click=@uploadAvatar) Upload Avatar

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

    button.button-small.button-tertiary.upload-cover-button(class=@hiddenUnlessCurrentUserIsOnTeam click=@uploadCover) Upload Cover
            
*/

export default TeamProfile;

