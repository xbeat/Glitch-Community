//
// Profile.jsx!  I export TeamProfile and UserProfile.
//

import React from 'react';
import PropTypes from 'prop-types';

import Loader from './loader.jsx';
import Thanks from './thanks.jsx';
import AddTeamUser from './add-team-user.jsx';
import {AuthDescription} from './description-field.jsx';
import {AuthField} from './editable-field.jsx';
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

const AvatarContainer = ({
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

const CoverContainer = ({
  style, buttons,
  children,
}) => (
  <section className="cover-container" style={style}>
    <div className="profile-info">
      {children}
    </div>
    {buttons}
  </section>
);
CoverContainer.propTypes = {
  style: PropTypes.object.isRequired,
  buttons: PropTypes.node,
  children: PropTypes.element.isRequired,
};

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
  <CoverContainer style={teamProfileStyle}
    buttons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
  >
    <AvatarContainer style={teamAvatarStyle} buttons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}>
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
    </AvatarContainer>
  </CoverContainer>
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
  fetched ? <LoadedTeamProfile team={team} {...props}/> : <CoverContainer style={team.teamProfileStyle}><Loader/></CoverContainer>
);
TeamProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  team: PropTypes.shape({
    teamProfileStyle: PropTypes.object.isRequired,
  }).isRequired,
};

const LoadedUserProfile = ({
  user: { //has science gone too far?
    name, login, id, description, thanksCount,
    profileStyle, avatarStyle, hasCoverImage,
  },
  isAuthorized,
  updateDescription,
  uploadCover, clearCover,
}) => (
  <CoverContainer style={profileStyle}
    buttons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
  >
    <AvatarContainer style={avatarStyle}>
      {name ?
        <React.Fragment>
          <h1 className="username">{name}</h1>
          <h2 className="login">@{login || id}</h2>
        </React.Fragment>
        : <h1 className="login">@{login || id}</h1>
      }
      <Thanks count={thanksCount}/>
      <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
    </AvatarContainer>
  </CoverContainer>
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
};

export const UserProfile = ({fetched, user, ...props}) => (
  fetched ? <LoadedUserProfile user={user} {...props}/> : <CoverContainer style={user.profileStyle}><Loader/></CoverContainer>
);
UserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    profileStyle: PropTypes.object.isRequired,
  }).isRequired,
};
