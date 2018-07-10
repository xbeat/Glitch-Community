import React from 'react';
import PropTypes from 'prop-types';

import Thanks from '../includes/thanks.jsx';

const MEMBER_ACCESS_LEVEL = 20
const ADMIN_ACCESS_LEVEL = 30

// Remove from Team 👋

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


// User Actions Section

const UserActions = ({user}) => (
  <section className="pop-over-actions user-actions">
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


// Admin Actions Section

// TODO add/remove admin 
  // API
  // update UI, user props
  // I can unadmin myself: (test this case, UI should adapt)
const AdminActions = ({user, userIsTeamAdmin, api, teamId}) => {
  const removeAdminStatus = () => {
    console.log ('remove AdminStatus clicked', teamId, user.id)
    api.patch((`teams/${teamId}/users/${user.id}`), {
      access_level: MEMBER_ACCESS_LEVEL
    })
    .then(({data}) => 
      console.log('🌹', data)
      // update user
    ).catch(error =>
      console.error("removeAdminStatus", error, error.response)
    )
    // PATCH /teams/<teamId>/users/<userId>
    // https://www.notion.so/glitch/teams-teamId-users-userId-29d069b57861494082b0404fc2fb16a7
  }

  const addAdminStatus = ({user, userIsTeamAdmin, api, teamId}) => {
    console.log ('addAdminStatus clicked', user, ADMIN_ACCESS_LEVEL)
  }
  
  return (
    <section className="pop-over-actions admin-actions">
      { userIsTeamAdmin && 
        <button className="button-small button-tertiary" onClick={removeAdminStatus}>
          <span>Remove Admin Status</span>
        </button>
      ||
        <button className="button-small button-tertiary" onClick={addAdminStatus}>
          <span>Make an Admin</span>
        </button>
      }
    </section>
  )
};

AdminActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
  userIsTeamAdmin: PropTypes.bool.isRequired,
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
};


// Thanks 💖

const ThanksCount = ({count}) => (
  <section className="pop-over-info">
    <Thanks count={count} />
  </section>
);


// Team User Info

const TeamUserInfoPop = ({user, currentUserIsOnTeam, removeUserFromTeam, userIsTeamAdmin, togglePopover, api, teamId}) => {
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
            <div className="status-badge">
              <span className="status admin">Team Admin</span>
            </div> 
          }

        </div>
      </section>
      { user.thanksCount > 0 && <ThanksCount count={user.thanksCount} /> }
      <UserActions user={user} />
      <AdminActions user={user} userIsTeamAdmin={userIsTeamAdmin} api={api} teamId={teamId}/>
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
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
};

TeamUserInfoPop.defaultProps = {
  user: {
    isOnTeam: false
  },
  currentUserIsOnTeam: false,
};

export default TeamUserInfoPop;
