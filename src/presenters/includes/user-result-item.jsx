import React from 'react';
import PropTypes from 'prop-types';

const UserThanks = ({thanksCount}) => {
  return (
    <div className="result-description">
      {thanksCount}
      &nbsp;
      <span className="emoji sparkling_heart"></span>
    </div>
  );
};

const UserResultItem = ({user, action}) => {
  const {userAvatarUrl, name, login, thanksCount} = user;
  
  const handleClick = (event) => {
    console.log('💣');
    action(event);
  };

  return (
    <li>
      <button onClick={() => console.log('💣')} className="button-flat">
        <div className="result">
          <img className="avatar" src={userAvatarUrl} alt={`User avatar for ${login}`}/>
          <div className="result-name" title={name}>{name}</div>
          <div className="result-description" title={login}>@{login}</div>
          { thanksCount > 0 && <UserThanks thanksCount={thanksCount} />}
        </div>
      </button>
    </li>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    userAvatarUrl: PropTypes.string.isRequired,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};


export default UserResultItem;
