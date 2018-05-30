//
// Profile.jsx!  I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';
import Thanks from './thanks.jsx';
import AddTeamUser from '../includes/add-team-user.jsx';
import {AuthDescription} from './description-field.jsx';
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

const ImageButtons = ({name, hasImage, uploadImage, clearImage}) => (
  <React.Fragment>
    { !!uploadImage && (
      <button className="button-small button-tertiary" onClick={uploadImage}>
        Upload {name}  
      </button>
    )}
    { hasImage && !!clearImage && (
      <button className="button-small button-tertiary" onClick={clearImage}>
        Clear {name}  
      </button>
    )}
  </React.Fragment>
);
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  hasImage: PropTypes.bool.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};

const AvatarContainer = ({
  style,
  children,
  Buttons,
}) => (
  <div className="user-avatar-container">
    <div className="user-avatar" style={style}>
      {!!Buttons && <div className="upload-avatar-buttons">{Buttons}</div>}
    </div>
    <div className="user-information">
      {children}
    </div>
  </div>
);
AvatarContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  Buttons: PropTypes.element,
};

const CoverContainer = ({style, Buttons, children}) => {
  return (
    <section className="profile" style={style}>
      <div className="profile-info">
        {children}
      </div>
      {!!Buttons && <div className="upload-cover-buttons">{Buttons}</div>}
    </section>
  );
};
CoverContainer.propTypes = {
  style: PropTypes.object.isRequired,
  Buttons: PropTypes.node,
  children: PropTypes.element.isRequired,
};

export const TeamProfile = ({
  fetched, currentUserIsOnTeam, style,
  uploadCover, clearCover, hasCoverImage,
  removeUserFromTeam, search, addUserToTeam,
  name, users, thanksCount, avatarStyle,
  description, updateDescription,
  isVerified, verifiedTooltip, verifiedImage,
  uploadAvatar,
}) => (
  <CoverContainer style={style}
    Buttons={currentUserIsOnTeam && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={clearCover} hasImage={hasCoverImage}/>}
  >
    {fetched ?
      <AvatarContainer style={avatarStyle} Buttons={currentUserIsOnTeam && <ImageButtons name="Avatar" uploadImage={uploadAvatar}/>}>
        <h1 className="username">
          {name}
          { isVerified && <span data-tooltip={verifiedTooltip}>
            <img className="verified" src={verifiedImage} alt={verifiedTooltip}/>
          </span> }
        </h1>
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
          { currentUserIsOnTeam && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
        </div>
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
      </AvatarContainer>
      : <Loader />}
  </CoverContainer>
);
TeamProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })),
  thanksCount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  updateDescription: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

export const UserProfile = ({
  fetched, style, avatarStyle, isAuthorized, updateDescription,
  uploadCover, clearCover, hasCoverImage,
  name, userLoginOrId, thanksCount, description,
}) => (
  <CoverContainer style={style}
    Buttons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={clearCover} hasImage={hasCoverImage}/>}
  >
    {fetched ?
      <AvatarContainer style={avatarStyle}>
        { name ?
          <React.Fragment>
            <h1 className="username">{name}</h1>
            <h2 className="login">@{userLoginOrId}</h2>
          </React.Fragment>
          : <h1 className="login">@{userLoginOrId}</h1>
        }
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </AvatarContainer>
      : <Loader />
    }
  </CoverContainer>
);
UserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  name: PropTypes.string,
  userLoginOrId: PropTypes.PropTypes.node.isRequired,
  thanksCount: PropTypes.number.isRequired,
};
