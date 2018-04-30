import React from 'react';
import PropTypes from 'prop-types';
import UsersList from '../users-list.jsx';

const ProjectResultItem = (project) => (
  <li className="result" onClick={() => project.action(project)}>
    <img className="avatar" src={project.avatar} alt={`Project avatar for ${project.title}`}/>
    <div className="result-name" title={project.domain}>{project.domain}</div>
    <div className="result-description">{project.description}</div>
    { project.users.length > 0 && <UsersList users={project.users} /> }
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

ProjectResultItem.defaultProps = {
  users: []
};

export default ProjectResultItem;
