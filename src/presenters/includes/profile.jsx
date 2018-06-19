//
// Profile.jsx!  I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';
import Thanks from './thanks.jsx';
import AddTeamUser from './add-team-user.jsx';
import {AuthDescription} from './description-field.jsx';
import EditableField from './editable-field.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

const ImageButtons = ({name, uploadImage, clearImage}) => (
  <div className="upload-image-buttons">
    { !!uploadImage && (
      <button className="button-small button-tertiary" onClick={uploadImage}>
        Upload {name}
      </button>
    )}
    { !!clearImage && (
      <button className="button-small button-tertiary" onClick={clearImage}>
        Clear {name}  
      </button>
    )}
  </div>
);
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};

export const AvatarContainer = ({
  style,
  children,
  buttons,
}) => (
  <div className="avatar-container">
    <div className="user-avatar" style={style}>
      {buttons}
    </div>
    <div className="profile-information">
      {children}
    </div>
  </div>
);
AvatarContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};

export const InfoContainer = ({children}) => (
  <div className="profile-info">
    {children}
  </div>
);
InfoContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CoverContainer = ({
  buttons, children, className, ...props
}) => (
  <div className={`cover-container ${className}`} {...props}>
    {children}
    {buttons}
  </div>
);
CoverContainer.propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const ProfileContainer = ({
  avatarStyle, avatarButtons,
  coverStyle, coverButtons,
  children,
}) => (
  <CoverContainer style={coverStyle} buttons={coverButtons}>
    <InfoContainer>
      <AvatarContainer style={avatarStyle} buttons={avatarButtons}>
        {children}
      </AvatarContainer>
    </InfoContainer>
  </CoverContainer>
);

const LoadingProfile = ({coverStyle}) => (
  <CoverContainer style={coverStyle}>
    <InfoContainer>
      <Loader/>
    </InfoContainer>
  </CoverContainer>
);

// stuff below this line is page specific and hopefully won't stay in this file forever

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

const TeamVerified = ({image, tooltip}) => (
  <span data-tooltip={tooltip}>
    <img className="verified" src={image} alt={tooltip}/>
  </span>
);
TeamVerified.propTypes = {
  image: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

const LoadedTeamProfile = ({
  team: {
    name, users, description, thanksCount,
    teamAvatarStyle, teamProfileStyle, hasCoverImage,
    isVerified, verifiedTooltip, verifiedImage,
  },
  currentUserIsOnTeam,
  uploadCover, clearCover, uploadAvatar,
  search, addUserToTeam, removeUserFromTeam,
  updateDescription,
}) => (
  <ProfileContainer
    avatarStyle={teamAvatarStyle} coverStyle={teamProfileStyle}
    avatarButtons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}
    coverButtons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
  >
    <h1 className="username">
      {name}
      { isVerified && <TeamVerified image={verifiedImage} tooltip={verifiedTooltip}/> }
    </h1>
    <div className="users-information">
      <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
      { currentUserIsOnTeam && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
    </div>
    <Thanks count={thanksCount}/>
    <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
  </ProfileContainer>
);
LoadedTeamProfile.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    thanksCount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

export const TeamProfile = ({fetched, team, ...props}) => (
  fetched ? <LoadedTeamProfile team={team} {...props}/> : <LoadingProfile coverStyle={team.teamProfileStyle}/>
);
TeamProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  team: PropTypes.shape({
    teamProfileStyle: PropTypes.object.isRequired,
  }).isRequired,
};

const NameAndLogin = ({name, login, id, isAuthorized, updateName, updateLogin}) => {
  if(!login) {
    // Just an ID? We're anonymous.
    return <h1 className="login">@{id}</h1>;
  }
  
  if(!isAuthorized) {
    if(!name) {
      //promote login to an h1.
      return <h1 className="login">@{login}</h1>;
    }
    return (
      <React.Fragment>
        <h1 className="username">{name}</h1>
        <h2 className="login">@{login}</h2>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h1 className="username"><EditableField value={name||""} update={updateName} placeholder='Display name?'/></h1>
      <h2 className="login"><EditableField value={login} update={updateLogin} prefix="@" placeholder='User ID?'/></h2>
    </React.Fragment>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  id: PropTypes.number.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func,
  updateLogin: PropTypes.func,
};

const LoadedUserProfile = ({
  user: { //has science gone too far?
    name, login, id, description, thanksCount,
    profileStyle, avatarStyle, hasCoverImage,
  },
  isAuthorized,
  updateDescription,
  updateName, updateLogin,
  uploadCover, clearCover,
  uploadAvatar,
}) => (
  <ProfileContainer avatarStyle={avatarStyle} coverStyle={profileStyle}
    coverButtons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
    avatarButtons={isAuthorized ? <ImageButtons name="Avatar" uploadImage={uploadAvatar} /> : null }
  >
    <NameAndLogin {...{name, login, id, isAuthorized, updateName, updateLogin}}/>
    <Thanks count={thanksCount}/>
    <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
  </ProfileContainer>
);
LoadedUserProfile.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
  }).isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

export const UserProfile = ({fetched, user, ...props}) => (
  fetched ? <LoadedUserProfile user={user} {...props}/> : <LoadingProfile coverStyle={user.profileStyle}/>
);
UserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    profileStyle: PropTypes.object.isRequired,
  }).isRequired,
};
