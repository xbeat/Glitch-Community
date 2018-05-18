import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const ProjectResultItem = ({domain, description, avatar, users, action, isActive}) => {
  var resultClass = "button-unstyled result ";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <button className={resultClass} onClick={action}>
      <img className="avatar" src={avatar} alt={`Project avatar for ${domain}`}/>
      <div className="result-name" title={domain}>{domain}</div>
      
      { description.length > 0 && <div className="result-description">{description}</div> }
      { users.length > 0 && <UsersList users={users} /> }
    </button>
  );
};

ProjectResultItem.propTypes = {
  action: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isActive: PropTypes.bool
};

export default ProjectResultItem;
