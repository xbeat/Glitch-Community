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

const AvatarContainer = ({
  avatarStyle,
  children,
  AvatarButtons,
}) => (
  <div className="user-avatar-container">
    <div className="user-avatar" style={avatarStyle}>
      {AvatarButtons}
    </div>
    <div className="user-information">
      {children}
    </div>
  </div>
);

AvatarContainer.propTypes = {
  avatarStyle: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  AvatarButtons: PropTypes.element,
};

const AvatarButtons = ({isAuthorized, uploadAvatar}) => (
  isAuthorized ?
    <button className="button-small button-tertiary upload-avatar-button" onClick={uploadAvatar}>
      Upload Avatar
    </button> :
    null
);
AvatarButtons.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

const TeamAvatar = ({
  currentUserIsOnTeam, removeUserFromTeam, search, addUserToTeam,
  name, users, thanksCount, description,
  updateDescription, descriptionPlaceholder,
  isVerified, verifiedTooltip, verifiedImage,
  uploadAvatar,
  ...props
}) => {
  const isAuthorized = currentUserIsOnTeam;
  return (
    <AvatarContainer {...props} isAuthorized={currentUserIsOnTeam} AvatarButtons={<AvatarButtons isAuthorized={isAuthorized} uploadAvatar={uploadAvatar}/>}>
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
      <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder={descriptionPlaceholder}/>
    </AvatarContainer>
  );
};
TeamAvatar.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })),
  thanksCount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  updateDescription: PropTypes.func.isRequired,
  descriptionPlaceholder: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

const CoverContainer = ({style, CoverButtons, children}) => {
  return (
    <section className="profile" style={style}>
      <div className="profile-info">
        {children}
      </div>
      {!!CoverButtons && <div className="upload-cover-buttons">{CoverButtons}</div>}
    </section>
  );
};

CoverContainer.propTypes = {
  style: PropTypes.object.isRequired,
  CoverButtons: PropTypes.node,
  children: PropTypes.element.isRequired,
};

export const CoverButtons = ({ isAuthorized, uploadCover, clearCover, hasCoverImage }) => (
  isAuthorized ?
    <React.Fragment>
      <button className="button-small button-tertiary" onClick={uploadCover}>
        Upload Cover  
      </button>
      { hasCoverImage && (
        <button className="button-small button-tertiary" onClick={clearCover}>
          Clear Cover  
        </button>
      )}
    </React.Fragment> :
    null
);
CoverButtons.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  hasCoverImage: PropTypes.bool.isRequired,
};

export const TeamProfile = ({fetched, currentUserIsOnTeam, style, ...props}) => (
  <CoverContainer style={style} CoverButtons={<CoverButtons {...props} isAuthorized={currentUserIsOnTeam}/>}>
    {fetched ? <TeamAvatar {...props} currentUserIsOnTeam={currentUserIsOnTeam} descriptionPlaceholder="Tell us about your team"/> : <Loader />}
  </CoverContainer>
);

TeamProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
};

export const UserProfile = ({
  fetched, style, avatarStyle, isAuthorized, updateDescription,
  name, userLoginOrId, thanksCount, description,
  ...props
}) => (
  <CoverContainer style={style} CoverButtons={<CoverButtons {...props} isAuthorized={isAuthorized}/>}>
    {fetched ?
      <AvatarContainer avatarStyle={avatarStyle}>
        { name ?
          <React.Fragment>
            <h1 className="username">{name}</h1>
            <h2 className="login">@{userLoginOrId}</h2>
          </React.Fragment>
          : <h1 className="login">@{userLoginOrId}</h1>
        }
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </AvatarContainer> :
      <Loader />
    }
  </CoverContainer>
);
                            
UserProfile.propTypes = {
  fetched: PropTypes.bool.isRequired,
  name: PropTypes.string,
  userLoginOrId: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  thanksCount: PropTypes.number.isRequired,
};
