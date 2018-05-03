import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const ProjectResultItem = (props) => {
  const {title, domain, description, avatar, action, users} = props;
  
  return (
    <li className="result" tabIndex="0" onClick={() => action(props)}>
      <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
      <div className="result-name" title={domain}>{domain}</div>
      <div className="result-description">{description}</div>
      { users.length > 0 && <UsersList users={users} /> }
    </li>
  );
};

ProjectResultItem.propTypes = {
  title: PropTypes.string.isRequired, 
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  action: PropTypes.func,
  users: PropTypes.array,
};

ProjectResultItem.defaultProps = {
  users: []
};

export default ProjectResultItem;
