/* global notify */

import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarThumbnailUrl, getDisplayName, getLink} from '../../models/user';
import {getAvatarUrl} from  '../../models/project';

import Thanks from '../includes/thanks.jsx';
import Loader from '../includes/loader.jsx';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

// Remove from Team 👋

const RemoveFromTeam = ({toggleUserInfoHidden}) => (
  <section className="pop-over-actions danger-zone">
    <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={toggleUserInfoHidden}>
      Remove from Team
      <span className="emoji wave" />
    </button>
  </section>
);

RemoveFromTeam.propTypes = {
  toggleUserInfoHidden: PropTypes.func.isRequired,
};


// User Actions Section

const UserActions = ({user}) => {

  let backgroundColor = () => {
    return {backgroundColor: user.color};
  };
  
  return (
    <section className="pop-over-actions user-actions">
      <a href={getLink(user)}>
        <button className="button-small has-emoji button-tertiary">
          <span>Profile </span>
          <img className="emoji avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={backgroundColor()}></img>
        </button>
      </a>
    </section>
  );
};

UserActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatarThumbnailUrl: PropTypes.string,
    login: PropTypes.string,
  }).isRequired,
};


// Admin Actions Section ⏫⏬

const AdminActions = ({user, userIsTeamAdmin, updateUserPermissions}) => {
  
  let removeAdminStatus = () => {
    updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL);
  };
  
  let addAdminStatus = () => {
    updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL);
  };
  
  return (
    <section className="pop-over-actions admin-actions">
      <p className="action-description">
        Admins can update team info, billing, and remove users
      </p>
      { userIsTeamAdmin && 
        <button className="button-small button-tertiary has-emoji" onClick={() => {removeAdminStatus();}}>
          <span>Remove Admin Status </span>
          <span className="emoji fast-down" />
        </button>
      ||
        <button className="button-small button-tertiary has-emoji" onClick={() => {addAdminStatus();}}>
          <span>Make an Admin </span>
          <span className="emoji fast-up" />
        </button>
      }
    </section>
  );
};

AdminActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};


// Thanks 💖

const ThanksCount = ({count}) => (
  <section className="pop-over-info">
    <Thanks count={count} />
  </section>
);


// Team User Info 😍

const TeamUserInfo = ({toggleUserInfoHidden, ...props}) => {
  const userAvatarStyle = {backgroundColor: props.user.color};
  return (
    <dialog className="pop-over team-user-info-pop">
      <section className="pop-over-info">
        <a href={getLink(props.user)}>
          <img className="avatar" src={getAvatarThumbnailUrl(props.user)} alt={props.user.login} style={userAvatarStyle}/>
        </a>
        <div className="info-container">
          <p className="name" title={props.user.name}>{props.user.name || "Anonymous"}</p>
          { props.user.login &&
            <p className="user-login" title={props.user.login}>@{props.user.login}</p>
          }
          { props.userIsTeamAdmin && 
            <div className="status-badge">
              <span className="status admin" data-tooltip="Can edit team info and billing">
                Team Admin
              </span>
            </div>
          }
        </div>
      </section>
      { props.user.thanksCount > 0 && <ThanksCount count={props.user.thanksCount} /> }
      <UserActions user={props.user} />
      { props.currentUserIsTeamAdmin &&
        <AdminActions 
          user={props.user}
          userIsTeamAdmin={props.userIsTeamAdmin}
          updateUserPermissions={props.updateUserPermissions}
        />
      }
      { props.currentUserIsTeamAdmin && <RemoveFromTeam toggleUserInfoHidden={() => toggleUserInfoHidden()} /> }
    </dialog>
  );
};

TeamUserInfo.propTypes = {
  toggleUserInfoHidden: PropTypes.func.isRequired,
};


// Team User Remove 💣

class TeamUserRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gettingUser: true,
      userTeamProjects: [],
      selectProjects: 'Select All'
    };
    this.selectOrUnselectAllProjects = this.selectOrUnselectAllProjects.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }
  
  removeUser() {
    this.props.togglePopover();
    notify.createNotification(<div>{getDisplayName(this.props.user)} removed from Team</div>);
    // get list of checboxes selected
    // remove user from projects
    var selectedProjects = [];
    let checkboxes = document.getElementsByName('projects');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        console.log(checkbox);
        selectedProjects.push(checkbox.dataset.id);
      }
    });
    console.log ('selectedProjects', selectedProjects);

    this.props.removeUserFromTeam(this.props.user.id, selectedProjects)
  }
  
  selectOrUnselectAllProjects() {
    let checkboxes = document.getElementsByName('projects');
    if (this.state.selectProjects === 'Select All') {
      checkboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
      this.setState({
        selectProjects: 'Unselect All'
      });
    } else {
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      this.setState({
        selectProjects: 'Select All'
      });
    }
  }
  
  async getUserWithProjects() {
    const userPath = `users/${this.props.user.id}`;
    const {data} = await this.props.api.get(userPath)
    this.setState({
      userTeamProjects: data.projects.filter(userProj => {
        return this.props.team.projects.some(teamProj => teamProj.id === userProj.id);
      }),
      gettingUser: false
    });
  }
  
  componentDidMount() {
    this.getUserWithProjects();    
  }
  
  render() {
    const userAvatarStyle = {backgroundColor: this.props.user.color};
    return (
      <dialog className="pop-over team-user-info-pop team-user-remove-pop">
        <section className="pop-over-info clickable-label" onClick={this.props.toggleUserInfoVisible}>
          <div className="back icon">
            <div className="left-arrow icon" />
          </div>
          <div className="pop-title">
            Remove {getDisplayName(this.props.user)}
          </div>
        </section>

        {this.state.userTeamProjects &&
          <section className="pop-over-actions" id="user-team-projects">
            <p className="action-description">
              Also remove them from these projects
            </p>
            { this.state.gettingUser &&
              <Loader />
            }
            <div className="projects-list">
              { this.state.userTeamProjects.map(project => (
                <label key={project.id}>
                  <input className="checkbox-project" type="checkbox" name="projects" data-id={project.id} value={project.domain} />
                  <img className="avatar" src={getAvatarUrl(project.id)} alt={`Project avatar for ${project.domain}`}/>
                  {project.domain}
                </label>
              ))}
            </div>
            { this.state.userTeamProjects.length > 0 && (
              <button className="button-small button-tertiary" onClick={this.selectOrUnselectAllProjects}>{this.state.selectProjects}</button>
            )}
          </section>
        }
        <section className="pop-over-actions danger-zone">
          <button className="button-small has-emoji" onClick={this.removeUser}>
            <span>Remove</span>
            <img className="emoji avatar" src={getAvatarThumbnailUrl(this.props.user)} alt={this.props.user.login} style={userAvatarStyle}/>
          </button>
        </section>
      </dialog>
    );
  }
}

TeamUserRemove.propTypes = {
  api: PropTypes.func.isRequired,
  toggleUserInfoVisible: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
    color: PropTypes.string,
  }).isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired
  }),
  removeUserFromTeam: PropTypes.func.isRequired,
};


// Team User Info or Remove
// uses removeTeamUserVisible state to toggle between showing user info and remove views

export default class TeamUserInfoAndRemovePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfoVisible: true
    };
    this.toggleUserInfoVisible = this.toggleUserInfoVisible.bind(this);
    this.toggleUserInfoHidden = this.toggleUserInfoHidden.bind(this);
  }
  
  toggleUserInfoHidden() {
    this.setState({
      userInfoVisible: false
    });
  }

  toggleUserInfoVisible() {
    this.setState({
      userInfoVisible: true
    });
  }
  
  render() {
    return (
      <React.Fragment>
        { this.state.userInfoVisible &&
          <TeamUserInfo
            {...this.props}
            toggleUserInfoHidden={() => this.toggleUserInfoHidden()}
          />
        ||
          <TeamUserRemove 
            {...this.props}
            toggleUserInfoVisible={() => this.toggleUserInfoVisible()}
          />
        }
      </React.Fragment>
    );
  }
}

TeamUserInfoAndRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
    color: PropTypes.string,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired,
  }),
};

TeamUserInfoAndRemovePop.defaultProps = {
  user: {
    isOnTeam: false
  },
  currentUserIsOnTeam: false,
};

