// import React from 'react';
// import PropTypes from 'prop-types';

// import {getAvatarUrl} from  '../../models/project';
// import UsersList from '../users-list.jsx';

// const ProjectResultItem = ({id, domain, description, users, action, isActive}) => {
//   var resultClass = "button-unstyled result ";
//   if(isActive) {
//     resultClass += " active";
//   }

//   return (
//     <button className={resultClass} onClick={action}>
//       <img className="avatar" src={getAvatarUrl(id)} alt={`Project avatar for ${domain}`}/>
//       <div className="result-name" title={domain}>{domain}</div>
      
//       { description.length > 0 && <div className="result-description">{description}</div> }
//       { users.length > 0 && <UsersList users={users} /> }
//     </button>
//   );
// };

// ProjectResultItem.propTypes = {
//   action: PropTypes.func.isRequired,
//   domain: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   users: PropTypes.array.isRequired,
//   isActive: PropTypes.bool
// };

// export default ProjectResultItem;

import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarThumbnailUrl} from '../../models/user';

const UserResultItem = ({user, action}) => {
  const {name, login, thanksCount} = user;
  
  const handleClick = (event) => {
    console.log('💣');
    action(event);
  };

  return (
    <button onClick={handleClick} className="button-unstyled result">
      <img className="avatar" src={getAvatarThumbnailUrl(user)} alt={`User avatar for ${login}`}/>
      <div className="result-name" title={name}>{name}</div>
      <div className="result-description" title={login}>@{login}</div>
    </button>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};


export default UserResultItem;

