import React from 'react';
import PropTypes from 'prop-types'

import Loader from '../includes/loader.jsx';
import Thanks from './thanks.jsx';
import TeamUsers from "../includes/team-users.jsx";
/*TeamUsers() {
  const props = {
    users: application.team().users().map(user => user.asProps()),
    currentUserIsOnTeam: application.team().currentUserIsOnTeam(application),
    removeUserFromTeam: ({id}) => application.team().removeUser(application, User({id}))
  };
*/

import AddTeamUser from '../includes/add-team-user.jsx';
/* addTeamUserButton() {
      const props = {
        search: (query) => User.getSearchResultsJSON(application, query).then(users => users.map(user => User(user).asProps())),
        add: (id) => application.team().addUser(application, User({id})),
        members: application.team().users().map(user => user.id()),
      };
      return Reactlet(AddTeamUser, props, "TeamPageAddUserButton");
      <AddTeamUser {search, add, members}/>
    },*/


class TeamDescription extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {
      currentUserIsOnTeam,
      description,
      updateDescription,
      applyDescription,
      initialTeamDescription
    } = this.props;
    
    if(!currentUserIsOnTeam) {
      if(!description) {
        return null;
      }
      return <p className="description read-only">{description}</p>;
    }
    
    return (
      <p 
        className="description content-editable" 
        onKeyUp={updateDescription} 
        onBlur={applyDescription} 
        placeHolder="Tell us about your team"
        contentEditable="true"
        role="textbox"
        aria-multiline="true"
        spellCheck="false">{initialTeamDescription}</p>
      );
  }
}

const UserAvatarContainer = ({
  addUserToTeam,
  avatarStyle,
  currentUserIsOnTeam,
  name,
  removeUserFromTeam,
  search,
  teamUsers,
  thanksCount,
  uploadAvatar,
  verified,
  verifiedImage,
  verifiedTooltip,
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
            { verified && <img className="verified" src={verifiedImage}/> }
          </span>
        </h1>
        <div className="users-information">
          <TeamUsers {...{teamUsers, currentUserIsOnTeam, removeUserFromTeam}}/>
          <AddTeamUser {...{search, add: addUserToTeam, teamUsers: teamUsers.map(({id}) => id)}}/>
        </div>
        { thanksCount > 0 && <Thanks count={thanksCount}/> }
      </div>
      <TeamDescription/>
    </div>
  );
};

UserAvatarContainer.propTypes = {
  addUserToTeam: PropTypes.func.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  teamUsers: PropTypes.string.isRequired,
  thanksCount: PropTypes.string.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  verified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
};

const TeamProfile = ({style, fetched, currentUserIsOnTeam, uploadCover, ...props}) => {
  return (
    <section className="profile">
      <div className="profile-container" style={style}>
        <div className="profile-info">
          { !fetched && <Loader/> }
          
          { fetched && <UserAvatarContainer {...props}/>}
        </div>
      </div>
      {currentUserIsOnTeam && (
        <button className="button-small button-tertiary upload-cover-button" onClick={uploadCover}>
          Upload Cover  
        </button>
      )}
    </section>
  )
}

TeamProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
}

export default TeamProfile;

