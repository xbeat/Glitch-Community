import React from 'react';
import PropTypes from 'prop-types';

import Thanks from '../includes/thanks.jsx';

const RemoveFromTeam = ({action}) => (
  <section className="pop-over-actions danger-zone">
    <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={action}>
      Remove from Team
      <span className="emoji wave" />
    </button>
  </section>
);
RemoveFromTeam.propTypes = {
  action: PropTypes.func.isRequired,
};

const UserActions = ({user}) => (
  <section className="pop-over-actions">
    <a href={user.userLink}>
      <button className="button-small has-emoji button-tertiary">
        <span>Profile </span>
        <img className="emoji avatar" src={user.userAvatarUrl} alt={user.login}></img>
      </button>
    </a>
  </section>
);
UserActions.propTypes = {
  user: PropTypes.shape({
    userLink: PropTypes.string.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
};

// test w anon user too // admin badge uses grey. badge on buttons is gross. is it more gross than , post attempt surprise?
const AdminActions = ({user, userIsTeamAdmin}) => (
  <section className="pop-over-actions">
    { userIsTeamAdmin && 
      <button className="button-small has-emoji button-tertiary">
        <span>Remove Admin Status</span>
      </button>
    ||
      <button className="button-small has-emoji button-tertiary">
        <span>Make an Admin</span>
      </button>
    }
  </section>
);
AdminActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
};

const ThanksCount = ({count}) => (
  <section className="pop-over-info">
    <Thanks count={count} />
  </section>
);

const TeamUserInfoPop = ({user, currentUserIsOnTeam, removeUserFromTeam, userIsTeamAdmin, togglePopover}) => {
  const removeFromTeamAction = () => {
    togglePopover();
    removeUserFromTeam();
  };
  return (
    <dialog className="pop-over team-user-info-pop">
      <section className="pop-over-info">
        <a href={user.userLink}>
          <img className="avatar" src={user.userAvatarUrl} alt={user.login} style={user.style}/>
        </a>
        <div className="info-container">
          <p className="name" title={user.name}>{user.name}</p>
          <p className="user-login" title={user.login}>@{user.login}</p>
          { userIsTeamAdmin && 
            <p className="status-badge admin">Admin</p> 
          }

        </div>
      </section>
      { user.thanksCount > 0 && <ThanksCount count={user.thanksCount} /> }
      <UserActions user={user} />
      <AdminActions user={user} userIsTeamAdmin={userIsTeamAdmin} />
      { currentUserIsOnTeam && <RemoveFromTeam action={removeFromTeamAction} />}
    </dialog>
  );
};
TeamUserInfoPop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
    userLink: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
};
TeamUserInfoPop.defaultProps = {
  user: {
    isOnTeam: false
  },
  currentUserIsOnTeam: false,
};

export default TeamUserInfoPop;
