import React from 'react';
import PropTypes from 'prop-types';

import {ThanksShort} from './thanks.jsx';

const UserResultItem = ({user, action}) => {
  const {userAvatarUrl, name, login, thanksCount} = user;
  
  const handleClick = (event) => {
    console.log('💣');
    action(event);
  };

  return (
    <button onClick={handleClick} className="button-unstyled">
      <div className="result">
        <img className="avatar" src={userAvatarUrl} alt={`User avatar for ${login}`}/>
        <div className="result-name" title={name}>{name}</div>
        <div className="result-description" title={login}>@{login}</div>
        { thanksCount > 0 && <ThanksShort count={thanksCount} />}
      </div>
    </button>
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
