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
    <a href={user.link}>
      <button className="button button-small has-emoji button-tertiary">
        <span>Profile </span>
        <img className="emoji avatar" src={user.avatar} alt="Your avatar"></img>
      </button>
    </a>
  </section>
);

const UserInfoPop = (user) => {
  console.log('🌎',user);
  return (
    <dialog className="pop-over user-info-pop">
      <section className="pop-over-info">
        <a href={user.link}>
          <img className="avatar" src={user.avatar} alt={`User avatar for ${user.login}`}/>
        </a>
        <div className="info-container">
          <p className="name" title={user.name}>{user.name}</p>
          <p className="user-login" title={user.login}>{user.login}</p>
        </div>
        { user.thanksCount > 0 && <UserThanks thanks={user.thanksString} />}
      </section>    
      <UserActions user={user} />
      { user.currentUserIsOnTeam === true && <RemoveFromTeam action={user.removeUserFromTeam} />}
    </dialog>
  );
};

UserInfoPop.propTypes = {
  id: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired, 
  name: PropTypes.string,
  login: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  thanksCount: PropTypes.number.isRequired,
  thanksString: PropTypes.string,
  isOnTeam: PropTypes.bool,
  currentUserIsOnTeam: PropTypes.bool,
  removeUserFromTeam: PropTypes.func,
};

UserInfoPop.defaultProps = {
  isOnTeam: false,
  currentUserIsOnTeam: false,
  removeUserFromTeam: () => undefined
};

export default UserInfoPop;
