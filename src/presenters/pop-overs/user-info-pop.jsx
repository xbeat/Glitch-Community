import React from 'react';
import PropTypes from 'prop-types';

const UserThanks = ({thanks}) => (
  <p className="user-thanks">
    {thanks}
    &nbsp;
    <span className="emoji sparkling_heart" />
  </p>
);

const RemoveFromTeam = ({action}) => (
  <section className="pop-over-actions danger-zone">
    <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={action}>
      Remove from Team
      <span className="emoji wave" />
    </button>
  </section>
);

const UserActions = ({user}) => (
  <section className="pop-over-actions">
    <a href={user.userLink}>
      <button className="button button-small has-emoji button-tertiary">
        <span>Profile </span>
        <img className="emoji avatar" src={user.userAvatarUrl} alt={user.login}></img>
      </button>
    </a>
  </section>
);

const UserInfoPop = (props) => {
  let {user} = props;
  return (
    <dialog className="pop-over user-info-pop">
      <section className="pop-over-info">
        <a href={user.userLink}>
          <img className="avatar" src={user.userAvatarUrl} alt={user.login} style={user.style}/>
        </a>
        <div className="info-container">
          <p className="name" title={user.name}>{user.name}</p>
          <p className="user-login" title={user.login}>{user.login}</p>
        </div>
        { user.thanksCount > 0 && <UserThanks thanks={user.userThanks} />}
      </section>
      <UserActions user={user} />
      { props.currentUserIsOnTeam === true && <RemoveFromTeam action={props.removeUserFromTeam} />}
    </dialog>
  );
};

UserInfoPop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    userAvatarUrl: PropTypes.string.isRequired,
    userLink: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
    userThanks: PropTypes.string,
    isOnTeam: PropTypes.bool,
  }).isRequired,
  currentUserIsOnTeam: PropTypes.bool,
  removeUserFromTeam: PropTypes.func,
};

UserInfoPop.defaultProps = {
  user: {
    isOnTeam: false
  },
  currentUserIsOnTeam: false,
  removeUserFromTeam: () => undefined
};

export default UserInfoPop;
