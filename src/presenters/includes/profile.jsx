//
// I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';
import Thanks from './thanks.jsx';
import {AuthDescription} from './description-field.jsx';
import EditableField from './editable-field.jsx';
import AdminOnlyBadge from './admin-only-badge.jsx' 


// Image Buttons

export const ImageButtons = ({name, uploadImage, clearImage, currentUserIsTeamAdmin}) => (
  <div className="upload-image-buttons">
    { !!uploadImage && (
      <div className="button button-small button-tertiary" onClick={uploadImage}>
        <span>Upload {name}</span>
        <AdminOnlyBadge currentUserIsTeamAdmin={currentUserIsTeamAdmin} />
      </div>
    )}
    { (!!clearImage && currentUserIsTeamAdmin) && (
      <div className="button button-small button-tertiary" onClick={clearImage}>
        Clear {name} 
        <AdminOnlyBadge currentUserIsTeamAdmin={currentUserIsTeamAdmin} />
      </div>
    )}
  </div>
);
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
  currentUserIsTeamAdmin: PropTypes.bool,
};


// Project Info Container

export const ProjectInfoContainer = ({
  style,
  children,
  buttons,
}) => (
  <React.Fragment>
    <div className="avatar-container">
      <div className="user-avatar" style={style} />
      {buttons}
    </div>
    <div className="profile-information">
      {children}
    </div>
  </React.Fragment>
);
ProjectInfoContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};


// Info Container (generic)

export const InfoContainer = ({children}) => (
  <div className="profile-info">
    {children}
  </div>
);
InfoContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


// Cover Container

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


// Profile Container

export const ProfileContainer = ({
  avatarStyle, avatarButtons,
  coverStyle, coverButtons,
  children,
}) => (
  <CoverContainer style={coverStyle} buttons={coverButtons}>
    <InfoContainer>
      <div className="avatar-container">
        <div className="user-avatar" style={avatarStyle} />
        {avatarButtons}
      </div>
      <div className="profile-information">
        {children}
      </div>
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
  uploadAvatar
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

export const UserProfile = ({fetched, user, ...props}) => {
  if (!fetched) {
    return <LoadingProfile coverStyle={user.profileStyle}/>;
  } 
  return <LoadedUserProfile user={user} {...props}/>;
};
UserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    profileStyle: PropTypes.object.isRequired,
  }).isRequired,
};