import React from 'react';
import PropTypes from 'prop-types';

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


// TODO
// done - convert to class
// done - add state for addbuttonlabel
// done - create updateAddButtonLabel , updates text, adds class
// done - on add user , trigger updateAddButtonLabel
// after setTimeout removesclass and reverts label to add
// style success and transitions between states
// move this to pr
export class AddTeamUser extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      addButtonLabel: 'Add',
      addButtonClass: undefined,
    };
    this.updateAddButtonInviteSent = this.updateAddButtonInviteSent.bind(this);
  }
  
  updateAddButtonInviteSent() {
    this.setState({
      addButtonLabel: 'Invite Sent',
      addButtonClass: 'success',
    })
    setTimeout(() => {
      this.setState({
        addButtonLabel: 'Add',
        addButtonClass: undefined,
      })
    }, 2000)
  }
  
  render() {
    return(
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <span className="add-user-container">
            <button onClick={togglePopover} className={"button button-small button-tertiary add-user " + this.state.addButtonClass}>{this.state.addButtonLabel}</button>
            {visible && 
              <AddTeamUserPop 
                {...this.props}
                togglePopover={togglePopover}
                updateAddButtonInviteSent={() => this.updateAddButtonInviteSent()}
              />
            }
          </span>
        )}
      </PopoverContainer>
    )
  }
};

// Join Team

export const JoinTeam = ({onClick}) => (
  <button className="button button-small button-cta join-team-button" onClick={onClick}>
    Join Team
  </button>
);