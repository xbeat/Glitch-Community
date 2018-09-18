/* globals Set */

import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarThumbnailUrl, getDisplayName} from '../../models/user';
import {getAvatarUrl} from  '../../models/project';

import PopoverNested from './popover-nested.jsx';
import {UserLink} from '../includes/link.jsx';
import Loader from '../includes/loader.jsx';
import Notifications from '../notifications.jsx';
import Thanks from '../includes/thanks.jsx';

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


// Admin Actions Section ⏫⏬

const AdminActions = ({user, userIsTeamAdmin, updateUserPermissions}) => {
  return (
    <section className="pop-over-actions admin-actions">
      <p className="action-description">
        Admins can update team info, billing, and remove users
      </p>
      { userIsTeamAdmin && 
        <button className="button-small button-tertiary has-emoji" onClick={() => updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL)}>
          Remove Admin Status <span className="emoji fast-down" />
        </button>
      ||
        <button className="button-small button-tertiary has-emoji" onClick={() => updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL)}>
          Make an Admin <span className="emoji fast-up" />
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

const TeamUserInfo = ({toggleUserInfoHidden, currentUser, ...props}) => {
  const userAvatarStyle = {backgroundColor: props.user.color};
  const canRemoveUser = props.currentUserIsTeamAdmin || (currentUser && currentUser.id === props.user.id);
  return (
    <dialog className="pop-over team-user-info-pop">
      <section className="pop-over-info user-info">
        <UserLink user={props.user}>
          <img className="avatar" src={getAvatarThumbnailUrl(props.user)} alt={props.user.login} style={userAvatarStyle}/>
        </UserLink>
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
      { props.currentUserIsTeamAdmin &&
        <AdminActions 
          user={props.user}
          userIsTeamAdmin={props.userIsTeamAdmin}
          updateUserPermissions={props.updateUserPermissions}
        />
      }
      { canRemoveUser && <RemoveFromTeam toggleUserInfoHidden={() => toggleUserInfoHidden()} /> }
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
      selectedProjects: new Set(),
    };
    this.selectAllProjects = this.selectAllProjects.bind(this);
    this.unselectAllProjects = this.unselectAllProjects.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }
  
  removeUser() {
    this.props.togglePopover();
    this.props.createNotification(`${getDisplayName(this.props.user)} removed from Team`);
    this.props.removeUserFromTeam(this.props.user.id, Array.from(this.state.selectedProjects));
  }
  
  selectAllProjects() {
    this.setState(({userTeamProjects}) => ({
      selectedProjects: new Set(userTeamProjects.map(p => p.id))
    }));
  }
  
  unselectAllProjects() {
    this.setState({
      selectedProjects: new Set()
    });
  }
  
  handleCheckboxChange(evt) {
    const {checked, value} = evt.target;
    this.setState(({selectedProjects}) => {
      selectedProjects = new Set(selectedProjects);
      if (checked) {
        selectedProjects.add(value);
      } else {
        selectedProjects.delete(value);
      }
      return {selectedProjects};
    });
  }
  
  async getUserWithProjects() {
    const {data} = await this.props.api.get(`users/${this.props.user.id}`);
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
    const allProjectsSelected = this.state.userTeamProjects.every(p => this.state.selectedProjects.has(p.id));
    const userAvatarStyle = {backgroundColor: this.props.user.color};
    
    let projects = null;
    if (this.state.gettingUser) {
      projects = <Loader/>;
    } else if (this.state.userTeamProjects.length > 0) {
      projects = (
        <React.Fragment>
          <p className="action-description">
            Also remove them from these projects
          </p>
          <div className="projects-list">
            { this.state.userTeamProjects.map(project => (
              <label key={project.id} htmlFor={`remove-user-project-${project.id}`}>
                <input className="checkbox-project" type="checkbox" id={`remove-user-project-${project.id}`}
                  checked={this.state.selectedProjects.has(project.id)} value={project.id}
                  onChange={this.handleCheckboxChange}
                />
                <img className="avatar" src={getAvatarUrl(project.id)} alt={`Project avatar for ${project.domain}`}/>
                {project.domain}
              </label>
            ))}
          </div>
          {this.state.userTeamProjects.length > 1 && (
            <button className="button-small"
              onClick={allProjectsSelected ? this.unselectAllProjects : this.selectAllProjects}
            >
              {allProjectsSelected ? 'Unselect All' : 'Select All'}
            </button>
          )}
        </React.Fragment>
      );
    }
    
    return (
      <dialog className="pop-over team-user-info-pop team-user-remove-pop">
        <button className="button-unstyled clickable-label" onClick={this.props.toggleUserInfoVisible} aria-label="go back">
          <section className="pop-over-info team-user-remove-header">
            <div className="back icon"><div className="left-arrow icon" /></div>
            &nbsp;
            <div className="pop-title">Remove {getDisplayName(this.props.user)}</div>
          </section>
        </button>
        
        <section className="pop-over-actions" id="user-team-projects">
          {projects || (
            <p className="action-description">
              {getDisplayName(this.props.user)} is not a member of any projects
            </p>
          )}
        </section>
        
        <section className="pop-over-actions danger-zone">
          <button className="button-small has-emoji" onClick={this.removeUser}>
            Remove <img className="emoji avatar" src={getAvatarThumbnailUrl(this.props.user)} alt={this.props.user.login} style={userAvatarStyle}/>
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
  createNotification: PropTypes.func.isRequired,
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
        { this.state.userInfoVisible ? (
          <TeamUserInfo
            {...this.props}
            toggleUserInfoHidden={() => this.toggleUserInfoHidden()}
          />
        ) : (
          <Notifications>
            {notifyFuncs => (
              <TeamUserRemove
                {...notifyFuncs}
                {...this.props}
                toggleUserInfoVisible={() => this.toggleUserInfoVisible()}
              />
            )}
          </Notifications>
        )}
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

