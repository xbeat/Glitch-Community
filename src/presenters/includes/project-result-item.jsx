import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const ResultItemDetails = () => {
  
};

const ProjectResultItem = ({
  title, 
  domain, 
  description, 
  avatar, 
  url="javascript:void(0);", 
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
  title: PropTypes.string.isRequired, 
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  url: PropTypes.string,
  action: PropTypes.func.isRequired,
  users: PropTypes.array,
};


export default ProjectResultItem;
