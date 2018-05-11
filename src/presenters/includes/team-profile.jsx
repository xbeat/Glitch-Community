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
  teamAvatarStyle,
  currentUserIsOnTeam,
  uploadAvatar,
  teamName,
  verifiedTeamTooltip,
  isVerifiedTeam,
  verifiedImage,
  hasTeamThanks,
  thanksCount,
  users,
  removeUserFromTeam,
  search,
  addUserToTeam
}) => {
  return (
    <div className="user-avatar-container">
      <div className="user-avatar" style={teamAvatarStyle}>
        { currentUserIsOnTeam && (
          <button className="button-small button-tertiary upload-avatar-button" onClick={uploadAvatar}>
            Upload Avatar
          </button>
        )}
      </div>
      <div className="user-information">
        <h1 className="username">{teamName}
          <span data-tooltip={verifiedTeamTooltip}>
            { isVerifiedTeam && <img className="verified" src={verifiedImage}/> }
          </span>
        </h1>
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
          <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>
        </div>
        { hasTeamThanks && <Thanks count={thanksCount} />}
      </div>
      <TeamDescription/>
    </div>
  );
};

const TeamProfile = ({teamProfileStyle,isTeamFetched, currentUserIsOnTeam, uploadCover, ...props}) => {
  return (
    <section className="profile">
      <div className="profile-container" style={teamProfileStyle}>
        <div className="profile-info">
          { !isTeamFetched && <Loader/> }
          
          { isTeamFetched && <UserAvatarContainer {...props}/>}
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

export default TeamProfile;

