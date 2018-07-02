//
// Profile.jsx!  I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';
import Thanks from './thanks.jsx';
import {AuthDescription} from './description-field.jsx';
import EditableField from './editable-field.jsx';

export const ImageButtons = ({name, uploadImage, clearImage}) => (
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