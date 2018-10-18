import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';
import UsersList from '../users-list.jsx';

const ProjectResultItem = ({id, domain, description, users, action, isActive}) => {
  var resultClass = "button-unstyled result result-project";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <div>
      <button className={resultClass} onClick={action} data-project-id={id}>
        <img className="avatar" src={getAvatarUrl(id)} alt={`Project avatar for ${domain}`}/>
        <div className="results-info">
          <div className="result-name" title={domain}>{domain}</div>
          { description.length > 0 && <div className="result-description">{description}</div> }
          { users.length > 0 && <UsersList users={users} /> }
        </div>
        <a href={`/~${domain}`} className="view-project-link" target="_blank">
          <button className="view-project button-small button-docs">
            View →
          </button>
        </a>
      </button>
      <a href={`/~${domain}`} className="view-project-link" target="_blank">
        <button className="view-project button-small button-docs">
          View →
        </button>
      </a>
    </div>
  );
};

ProjectResultItem.propTypes = {
  action: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isActive: PropTypes.bool
};

export default ProjectResultItem;

