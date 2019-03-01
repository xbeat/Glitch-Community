import React from 'react';
import PropTypes from 'prop-types';

import { getDisplayName } from '../../models/user';
import { TrackClick } from '../analytics';
import { WhitelistedDomainIcon } from './team-elements';
import { UserAvatar } from './avatar';
import AddTeamUserPop from '../pop-overs/add-team-user-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';
import PopoverContainer from '../pop-overs/popover-container';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop';
import UsersList from '../users-list';

// Team Users list (in profile container)

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
};

export const TeamUsers = props => (
  <ul className="users">
    {props.users.map((user) => {
      const userIsTeamAdmin = props.adminIds.includes(user.id);

      return (
        <li key={user.id}>
          <PopoverWithButton
            buttonClass="user button-unstyled"
            buttonText={(
              <UserAvatar
                user={user}
                suffix={adminStatusDisplay(props.adminIds, user)}
              />
            )}
            passToggleToPop
          >
            <TeamUserInfoPop
              userIsTeamAdmin={userIsTeamAdmin}
              userIsTheOnlyAdmin={
                userIsTeamAdmin && props.adminIds.length === 1
              }
              userIsTheOnlyMember={props.users.length === 1}
              user={user}
              {...props}
            />
          </PopoverWithButton>
        </li>
      );
    })}
  </ul>
);

TeamUsers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  // these are all used by a spread. why doesn't eslint understand?
  /* eslint-disable react/no-unused-prop-types */
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
  adminIds: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  api: PropTypes.func,
  /* eslint-enable */
};

TeamUsers.defaultProps = {
  api: null,
};

// Whitelisted domain icon

export const WhitelistedDomain = ({ domain, setDomain }) => {
  const tooltip = `Anyone with an @${domain} email can join`;
  return (
    <PopoverContainer>
      {({ visible, setVisible }) => (
        <details
          onToggle={evt => setVisible(evt.target.open)}
          open={visible}
          className="popover-container whitelisted-domain-container"
        >
          <summary data-tooltip={!visible ? tooltip : null}>
            <WhitelistedDomainIcon domain={domain} />
          </summary>
          <dialog className="pop-over">
            <section className="pop-over-info">
              <p className="info-description">
                {tooltip}
              </p>
            </section>
            {!!setDomain && (
              <section className="pop-over-actions danger-zone">
                <button
                  className="button button-small button-tertiary button-on-secondary-background has-emoji"
                  onClick={() => setDomain(null)}
                >
                  Remove {domain} <span className="emoji bomb" />
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
WhitelistedDomain.defaultProps = {
  setDomain: null,
};

// Add Team User

export class AddTeamUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitee: '',
      newlyInvited: [],
    };
    this.removeNotifyInvited = this.removeNotifyInvited.bind(this);
  }

  async setWhitelistedDomain(togglePopover, domain) {
    togglePopover();
    await this.props.setWhitelistedDomain(domain);
  }

  async inviteUser(togglePopover, user) {
    togglePopover();

    this.setState(prevState => ({
      invitee: getDisplayName(user),
      newlyInvited: [...prevState.newlyInvited, user],
    }));
    await this.props.inviteUser(user);
  }

  async inviteEmail(togglePopover, email) {
    togglePopover();
    this.setState({
      invitee: email,
    });
    await this.props.inviteEmail(email);
  }

  removeNotifyInvited() {
    this.setState({
      invitee: '',
    });
  }

  render() {
    const alreadyInvitedAndNewInvited = this.props.invitedMembers.concat(
      this.state.newlyInvited,
    );
    const {
      inviteEmail,
      inviteUser,
      setWhitelistedDomain,
      ...props
    } = this.props;
    return (
      <PopoverContainer>
        {({ visible, togglePopover }) => (
          <span className="add-user-container">
            {alreadyInvitedAndNewInvited.length > 0 && (
              <UsersList users={alreadyInvitedAndNewInvited} />
            )}
            <TrackClick name="Add to Team clicked">
              <button
                onClick={togglePopover}
                className="button button-small button-tertiary add-user"
              >
                Add
              </button>
            </TrackClick>
            {!!this.state.invitee && (
              <div
                className="notification notifySuccess inline-notification"
                onAnimationEnd={this.removeNotifyInvited}
              >
                Invited
                {' '}
                {this.state.invitee}
              </div>
            )}
            {visible && (
              <AddTeamUserPop
                {...props}
                setWhitelistedDomain={
                  setWhitelistedDomain
                    ? domain => this.setWhitelistedDomain(togglePopover, domain)
                    : null
                }
                inviteUser={
                  inviteUser
                    ? user => this.inviteUser(togglePopover, user)
                    : null
                }
                inviteEmail={
                  inviteEmail
                    ? email => this.inviteEmail(togglePopover, email)
                    : null
                }
              />
            )}
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

AddTeamUser.defaultProps = {
  setWhitelistedDomain: null,
  inviteUser: null,
  inviteEmail: null,
};

// Join Team

export const JoinTeam = ({ onClick }) => (
  <button
    className="button button-small button-cta join-team-button"
    onClick={onClick}
  >
    Join Team
  </button>
);
