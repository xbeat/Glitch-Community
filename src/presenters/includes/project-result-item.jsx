import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const ProjectResultItem = ({
  title, 
  domain, 
  description, 
  avatar, 
  action, 
  users=[]
}) => (
  <li className="result" onClick={action}>
    <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
    <div className="result-name" title={domain}>{domain}</div>
      
    { users.length > 0 && <UsersList users={users} /> }

    <div className="result-description">{description}</div>
  </li>
);

ProjectResultItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired, 
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  users: PropTypes.array,
};


export default ProjectResultItem;
