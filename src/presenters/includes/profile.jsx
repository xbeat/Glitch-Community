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

const ImageButtons = ({name, uploadImage, clearImage}) => (
  <React.Fragment>
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
  </React.Fragment>
);
ImageButtons.propTypes = {
  name: PropTypes.string.isRequired,
  uploadImage: PropTypes.func,
  clearImage: PropTypes.func,
};

const AvatarContainer = ({
  style,
  children,
  buttons,
}) => (
  <div className="user-avatar-container">
    <div className="user-avatar" style={style}>
      {!!buttons && <div className="upload-avatar-buttons">{buttons}</div>}
    </div>
    <div className="user-information">
      {children}
    </div>
  </div>
);
AvatarContainer.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.element,
};

const CoverContainer = ({
  style, buttons,
  children,
}) => (
  <section className="profile" style={style}>
    <div className="profile-info">
      {children}
    </div>
    {!!buttons && <div className="upload-cover-buttons">{buttons}</div>}
  </section>
);
CoverContainer.propTypes = {
  style: PropTypes.object.isRequired,
  buttons: PropTypes.node,
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
    buttons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage && clearCover}/> : null}
  >
    {fetched ?
      <AvatarContainer style={avatarStyle} buttons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}>
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
      : <Loader/>
    }
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

const LoadedUserProfile = ({
  user: { //has science gone too far?
    name, login, description, thanksCount,
    profileStyle, avatarStyle, hasCoverImage,
  },
  fetched, isAuthorized,
  updateDescription,
  uploadCover, clearCover,
}) => (
  <CoverContainer style={profileStyle}
    buttons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
  >
    {fetched ?
      <AvatarContainer style={avatarStyle}>
        {name ?
          <React.Fragment>
            <h1 className="username">{name}</h1>
            <h2 className="login">@{login}</h2>
          </React.Fragment>
          : <h1 className="login">@{login}</h1>
        }
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </AvatarContainer>
      : <Loader />
    }
  </CoverContainer>
);
LoadedUserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.PropTypes.node.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
  }).isRequired,
};

export const UserProfile = ({fetched, user, ...props}) => (
  fetched ? <LoadedUserProfile user={user} {...props}/> : <CoverContainer style={user.profileStyle}><Loader/></CoverContainer>
);
