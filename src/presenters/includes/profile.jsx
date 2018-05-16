//
// Profile.jsx!  I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';
import Thanks from './thanks.jsx';
import AddTeamUser from '../includes/add-team-user.jsx';
import {EditableDescription, StaticDescription} from './description-field.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  <UserPopoversList users={users}>
    {(user, togglePopover) => <UserInfoPop togglePopover={togglePopover} user={user} currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={() => removeUserFromTeam(user)} />}
  </UserPopoversList>
);

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

const UserAvatar = ({
  addUserToTeam,
  avatarStyle,
  currentUserIsOnTeam,
  description,
  name,
  removeUserFromTeam,
  search,
  users,
  thanksCount,
  updateDescription,
  uploadAvatar,
  isVerified,
  verifiedImage,
  verifiedTooltip,
  userAvatarIsAnon,
  userLoginOrId,
}) => {
  return (
    <div className="user-avatar-container">
      <div className="user-avatar" style={avatarStyle}>
        { currentUserIsOnTeam && (
          <button className="button-small button-tertiary upload-avatar-button" onClick={uploadAvatar}>
            Upload Avatar
          </button>
        )}
      </div>
      <div className="user-information">
        <h1 className="username">{name}
          <span data-tooltip={verifiedTooltip}>
            { isVerified && <img className="verified" src={verifiedImage} alt={verifiedTooltip}/> }
          </span>
        </h1>
        { !!userLoginOrId && (
          <h2 className="login">@{userLoginOrId}</h2>
        )}
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
          { currentUserIsOnTeam && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
        </div>
        { thanksCount > 0 && <Thanks count={thanksCount}/> }
        {currentUserIsOnTeam
          ?
          <EditableDescription
            initialDescription={description}
            updateDescription={updateDescription}
            placeholder="Tell us about your team"
          />
          :
          <StaticDescription description={description} />}
      </div>
    </div>
  );
};
/*        .user-avatar-container(class=@hiddenUnlessUserFetched)
            .user-avatar(class=@userAvatarIsAnon style=@userAvatarStyle)
              - # img(src="#{@userAvatarUrl()}")
              button.hidden.button-small.button-tertiary.upload-avatar-button(class=@hiddenUnlessCurrentUserIsOnTeam click=@uploadAvatar) Upload Avatar

            .user-information
              h1.username(class=@hiddenUnlessUserHasName)= @userName()
              h2.login
                span= "@"
                span= @userLoginOrId()

              p.description.content-editable(class=@hiddenUnlessUserIsCurrentUser class=@hiddenIfEditingDescription focus=@focusOnEditableDescription placeholder="Tell us about yourself" contenteditable=true role="textbox" aria-multiline=true spellcheck=false)=@editableDescriptionMarkdown
              p#description-markdown.description.content-editable(class=@hiddenUnlessUserIsCurrentUser class=@hiddenUnlessEditingDescription blur=@defocusOnEditableDescription keyup=@updateDescription placeholder="Tell us about yourself" contenteditable=true role="textbox" aria-multiline=true spellcheck=false)=@editableDescription                
              
              p.description.read-only(class=@hiddenIfUserIsNotCurrentUser class=@hiddenIfNoDescription)= @description
              p.description.anon-user-description(class=@hiddenUnlessUserIsAnon) This user is anonymous until they sign in
*/

UserAvatar.propTypes = {
  addUserToTeam: PropTypes.func.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  thanksCount: PropTypes.number.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
};

export const Profile = (props) => {
  const {
    isAuthorized,
    fetched,
    style,
    uploadCover,
  } = props;
  return (
    <section className="profile">
      <div className="profile-container" style={style}>
        <div className="profile-info">
          { fetched ? <UserAvatar {...props}/> : <Loader />}
        </div>
      </div>
      {isAuthorized && (
        <button className="button-small button-tertiary upload-cover-button" onClick={uploadCover}>
          Upload Cover  
        </button>
      )}
    </section>
  );
};

TeamProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};

export const TeamProfile = ({currentUserIsOnTeam, ...props}) => {
  return <Profile isAuthorized={currentUserIsOnTeam} {...props}/>
};

export const UserProfile = (props) => {
  return <Profile {...props}/>
};
                            
UserProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};
