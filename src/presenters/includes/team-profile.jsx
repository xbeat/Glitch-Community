import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

import Loader from '../includes/loader.jsx';
import Thanks from './thanks.jsx';
import TeamUsers from "../includes/team-users.jsx";
import AddTeamUser from '../includes/add-team-user.jsx';


class EditableTeamDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { description: this.props.initialTeamDescription };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onChange(evt) {
    console.log(evt.currentTarget.value);
    this.setState({ description: evt.currentTarget.value });
    this.props.updateDescription(evt);
  }
  
  onBlur(evt) {
    this.props.applyDescription(evt);
  }
  
  render() {
    return (
      <TextArea
        className="description content-editable"
        value={this.state.description}
        onChange={this.onChange}
        onBlur={this.onBlur}
        placeholder="Tell us about your team"
        spellCheck="false"
      />
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
          { currentUserIsOnTeam && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
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
    this.state = { observedProps: this.props.propsObservable() };
  }
  
  componentDidMount() {
    this.props.propsObservable.observe((props) => {
      this.setState({observedProps: props});
    });
  }
  componentWillUnmount() {
    this.props.propsObservable.releaseDependencies();
  }
  
  render() {
    return <TeamProfile {...this.state.observedProps}/>;
  }
}

TeamProfileContainer.propTypes = {
  propsObservable: PropTypes.func.isRequired,
};

export default TeamProfileContainer;

