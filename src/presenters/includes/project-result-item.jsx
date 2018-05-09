import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const Description = ({description}) => (
  <div className="result-description">{description}</div>
);

const ProjectResultItem = (props) => {
  const {domain, description, avatar, action, users} = props;
  
  return (
    <div className="result">
      <img className="avatar" src={avatar} alt={`Project avatar for ${domain}`}/>
      <div className="result-name" title={domain}>{domain}</div>
      
      { description.length > 0 && <Description description={description} /> }
      { users.length > 0 && <UsersList users={users} /> }
    </div>
  );
};

ProjectResultItem.propTypes = {
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
};

export default ProjectResultItem;
