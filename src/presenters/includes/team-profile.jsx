import React from 'react';
import PropTypes from 'prop-types';

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


class EditableTeamDescription extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {
      applyDescription,
      initialTeamDescription,
      updateDescription,
    } = this.props;
    
    return (
      <p 
        className="description content-editable" 
        onKeyUp={updateDescription} 
        onBlur={applyDescription} 
        placeholder="Tell us about your team"
        contentEditable="true"
        role="textbox"
        aria-multiline="true"
        spellCheck="false"
      >
        {initialTeamDescription}
      </p>
    );
  }
}
EditableTeamDescription.propTypes = {
  applyDescription: PropTypes.func.isRequired,
  initialTeamDescription: PropTypes.string.isRequired,
  updateDescription: PropTypes.func.isRequired,
};

const StaticTeamDescription = ({description}) => (
  description ? <p className="description read-only">{description}</p> : null
);
StaticTeamDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

const UserAvatarContainer = ({
  addUserToTeam,
  applyDescription,
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
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
          <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>
        </div>
        { thanksCount > 0 && <Thanks count={thanksCount}/> }
      </div>
      {currentUserIsOnTeam
        ? <EditableTeamDescription initialTeamDescription={description} applyDescription={applyDescription} updateDescription={updateDescription} />
        : <StaticTeamDescription description={description} />}
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
  users: PropTypes.array.isRequired,
  thanksCount: PropTypes.string.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  isVerified: PropTypes.bool.isRequired,
  verifiedImage: PropTypes.string.isRequired,
  verifiedTooltip: PropTypes.string.isRequired,
};

const TeamProfile = (props) => {
  const {
    currentUserIsOnTeam,
    fetched,
    style,
    uploadCover,
  } = props;
  return (
    <section className="profile">
      <div className="profile-container" style={style}>
        <div className="profile-info">
          { fetched ? <UserAvatarContainer {...props}/> : <Loader />}
        </div>
      </div>
      {currentUserIsOnTeam && (
        <button className="button-small button-tertiary upload-cover-button" onClick={uploadCover}>
          Upload Cover  
        </button>
      )}
    </section>
  );
};

TeamProfile.propTypes = {
  style: PropTypes.object.isRequired,
  fetched: PropTypes.bool.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  uploadCover: PropTypes.func.isRequired,
};

class TeamProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.propsObservable = props.propsObservable;
    this.state = { observedProps: {} };
  }
  
  componentDidMount() {
    this.propsObservable.observe((props) => {
      this.setState({observedProps: props});
    });
  }
  componentWillUnmount() {
    this.propsObservable.releaseDependencies();
  }
  
  render() {
    return <TeamProfile {...this.state.observedProps}/>;
  }
}

TeamProfileContainer.propTypes = {
  propsObservable: PropTypes.func.isRequired,
};

export default TeamProfileContainer;

