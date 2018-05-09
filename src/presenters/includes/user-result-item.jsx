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
  console.log('💣', action);
  
  const handleClick = (event) => {
    debugger;
    event.preventDefault();
    event.stopPropagation();
    action(event);
  };
  const handleKeyPress = (event) => {
    if(["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      action(event);
    }
  };

  return (
    <li className="result" tabIndex="0" role="button" onClick={handleClick} onKeyPress={handleKeyPress}>
      <img className="avatar" src={userAvatarUrl} alt={`User avatar for ${login}`}/>
      <div className="result-name" title={name}>{name}</div>
      <div className="result-description" title={login}>@{login}</div>
      { thanksCount > 0 && <UserThanks thanksCount={thanksCount} />}
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
