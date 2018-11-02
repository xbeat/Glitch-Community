import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';
import {StaticUsersList} from '../users-list.jsx';

const ProjectResultItem = ({id, domain, description, users, action, isActive, isPrivate}) => {
  var resultClass = "button-unstyled result result-project";
  if(isActive) {
    resultClass += " active";
  }
  if(isPrivate){
    resultClass += " private";
  }

  return (
<<<<<<< HEAD
    <div>
      <button className={resultClass} onClick={action} data-project-id={id}>
        <img className="avatar" src={getAvatarUrl(id)} alt={`Project avatar for ${domain}`}/>
        <div className="results-info">
          <div className="result-name" title={domain}>{domain}</div>
          { description.length > 0 && <div className="result-description">{description}</div> }
          { users.length > 0 && <StaticUsersList users={users} /> }
        </div>
      </button>
      <a href={`/~${domain}`} className="view-result-link" target="_blank" rel="noopener noreferrer">
        <button className="view-project button-small button-docs">
          View →
        </button>
      </a>
    </div>
=======
    <button className={resultClass} onClick={action}>
      <img className="avatar" src={getAvatarUrl(id)} alt={`Project avatar for ${domain}`}/>
      <div className="result-name" title={domain}>{domain}</div>
      
      { description.length > 0 && <div className="result-description">{description}</div> }
      { users.length > 0 && <StaticUsersList users={users} /> }
    </button>
>>>>>>> 35e836243266b5299bf71937240a47dcdd2b0970
  );
};

ProjectResultItem.propTypes = {
  action: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  isPrivate: PropTypes.bool,
};

export default ProjectResultItem;

