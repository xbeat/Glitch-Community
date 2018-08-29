import React from 'react';
import PropTypes from 'prop-types';

//import {getDisplayName} from '../../models/user';
import {WhitelistedDomainIcon} from './team-elements.jsx';
import AddTeamUserPop from '../pop-overs/add-team-user-pop.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';


// Team Users list (in profile container)

export const TeamUsers = (props) => {
  
  let userIsTeamAdmin = (user) => {
    return props.adminIds.includes(user.id);
  };
  return (
    <UserPopoversList users={props.users} adminIds={props.adminIds}>
      {(user, togglePopover) => 
        <TeamUserInfoPop 
          userIsTeamAdmin={userIsTeamAdmin(user)}
          togglePopover={togglePopover} 
          user={user} 
          {...props}
        />
      }
    </UserPopoversList>
  );
};

TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array.isRequired,
};


// Whitelisted domain icon

export const WhitelistedDomain = ({domain, setDomain}) => {
  const tooltip = `Anyone with an @${domain} email can join`;
  return (
    <PopoverContainer>
      {({visible, setVisible}) => (
        <details onToggle={evt => setVisible(evt.target.open)} open={visible} className="popover-container whitelisted-domain-container">
          <summary data-tooltip={!visible ? tooltip : null}>
            <WhitelistedDomainIcon domain={domain}/>
          </summary>
          <dialog className="pop-over">
            <section className="pop-over-info">
              <p className="info-description">
                {tooltip}
              </p>
            </section>
            {!!setDomain && (
              <section className="pop-over-actions danger-zone">
                <button className="button button-small button-tertiary button-on-secondary-background has-emoji" onClick={() => setDomain(null)}>
                  Remove {domain} <span className="emoji bomb"></span>
                </button>
              </section>
            )}
          </dialog>
        </details>
      )}
    </PopoverContainer>
  );
};

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};


// Add Team User

export class AddTeamUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitee: '',
    };
    this.removeNotifyInvited = this.removeNotifyInvited.bind(this);
  }
  
  wrapFunction(togglePopover, func, invitee) {
    if (!func) {
      return null;
    }
    return async (...args) => {
      togglePopover();
      await func(...args);
      if (invitee) {
        this.setState({
          invitee: invitee(...args),
        });
      }
    };
  }

  removeNotifyInvited() {
    this.setState({
      invitee: '',
    });
  }

  render() {
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <span className="add-user-container">
            <button onClick={togglePopover} className="button button-small button-tertiary add-user">Add</button>
            {!!this.state.invitee &&
              <div className="notification notifySuccess inline-notification" onAnimationEnd={this.removeNotifyInvited}>
                Invited {this.state.invitee}
              </div>
            }
            {visible && 
              <AddTeamUserPop 
                {...this.props}
                setWhitelistedDomain={this.wrapFunction(togglePopover, this.props.setWhitelistedDomain)}
                inviteUser={this.wrapFunction(togglePopover, this.props.inviteUser)}
                inviteEmail={this.wrapFunction(togglePopover, this.props.inviteEmail, email => email)}
              />
            }
          </span>
        )}
      </PopoverContainer>
    );
  }
}
AddTeamUser.propTypes = {
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  setWhitelistedDomain: PropTypes.func,
};

// Join Team

export const JoinTeam = ({onClick}) => (
  <button className="button button-small button-cta join-team-button" onClick={onClick}>
    Join Team
  </button>
);