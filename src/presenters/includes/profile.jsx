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
  descriptionPlaceholder
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

UserAvatar.propTypes = {
  addUserToTeam: PropTypes.func.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  thanksCount: PropTypes.number.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
  descriptionPlaceholder: PropTypes.string.isRequired,
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

Profile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};

export const TeamProfile = (props) => {
  return <Profile {...props} descriptionPlaceholder="Tell us about your team"/>
};

export const UserProfile = (props) => {
  return <Profile {...props} descriptionPlaceholder="Tell us about yourself"/>
};
                            
UserProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};
