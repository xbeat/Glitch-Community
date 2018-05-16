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

const Avatar = ({
  avatarStyle,
  isAuthorized,
  description,
  name,
  thanksCount,
  updateDescription,
  uploadAvatar,
  descriptionPlaceholder,
  TeamFields,
  UserFields,
  UsernameTooltip,
}) => {
  return (
    <div className="user-avatar-container">
      <div className="user-avatar" style={avatarStyle}>
        { isAuthorized && (
          <button className="button-small button-tertiary upload-avatar-button" onClick={uploadAvatar}>
            Upload Avatar
          </button>
        )}
      </div>
      <div className="user-information">
        <h1 className="username">{name}
          {UsernameTooltip}
        </h1>
        {UserFields}
        {TeamFields}
        { thanksCount > 0 && <Thanks count={thanksCount}/> }
        {isAuthorized
          ?
          <EditableDescription
            initialDescription={description}
            updateDescription={updateDescription}
            placeholder={descriptionPlaceholder}
          />
          :
          <StaticDescription description={description} />}
      </div>
    </div>
  );
};

Avatar.propTypes = {
  avatarStyle: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  thanksCount: PropTypes.number.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  initialDescription: PropTypes.string.isRequired,
  updateDescription: PropTypes.func.isRequired,
  descriptionPlaceholder: PropTypes.string.isRequired,
  TeamFields: PropTypes.element,
  UserFields: PropTypes.element,
  UsernameTooltip: PropTypes.element,
};


const TeamAvatar = ({
  isAuthorized, removeUserFromTeam, search, addUserToTeam, users,
  isVerified, verifiedTooltip, verifiedImage,
  ...props
}) => {
  
  const UserInformation = (
    <div className="users-information">
      <TeamUsers {...{users, currentUserIsOnTeam: isAuthorized, removeUserFromTeam}}/>
      { isAuthorized && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
    </div>
  );
  
  const UsernameTooltip = (
    <span data-tooltip={verifiedTooltip}>
      { isVerified && <img className="verified" src={verifiedImage} alt={verifiedTooltip}/> }
    </span>
  );
  
  return <Avatar {...props} TeamFields={UserInformation} UserFields={null} UsernameTooltip={UsernameTooltip}/>
};
TeamAvatar.propTypes = {
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
};

const UserAvatar = ({userLoginOrId, ...props}) => {
  const UserID = (
    <h2 className="login">@{userLoginOrId}</h2>
  );
  return <Avatar {...props} TeamFields={null} UserFields={UserID} UsernameTooltip={null}/>
};
UserAvatar.propTypes = {
  userLoginOrId: PropTypes.string.isRequired,
};

export const Profile = ({isAuthorized, style, uploadCover, Avatar}) => {
  return (
    <section className="profile">
      <div className="profile-container" style={style}>
        <div className="profile-info">
          {Avatar}
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
  isAuthorized: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
  Avatar: PropTypes.element.isRequired,
};

export const TeamProfile = ({fetched, ...props}) => {
  const Avatar = fetched ? <TeamAvatar {...props} descriptionPlaceholder="Tell us about your team"/> : <Loader />;
  return <Profile {...props} Avatar={Avatar}/>
};

export const UserProfile = ({fetched, ...props}) => {
  const Avatar = fetched ? <UserAvatar {...props} descriptionPlaceholder="Tell us about yourself"/> : <Loader />;
  return <Profile {...props} Avatar={Avatar}/>
};
                            
UserProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};
