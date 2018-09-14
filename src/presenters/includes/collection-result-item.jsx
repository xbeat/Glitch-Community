import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';

const CollectionResultItem = ({id, domain, description, action, isActive, avatarUrl, url}) => {
  var resultClass = "button-unstyled result result-collection";
  if(isActive) {
    resultClass += " active";
  }

  return (
    <button className={resultClass} onClick={action} data-project-id={id}>
      <img className="avatar" src={avatarUrl} alt={`Project avatar for ${domain}`}/>
      <div className="results-info">
        <div className="result-name" title={domain}>{domain}</div>
        { description.length > 0 && <div className="result-description">{description}</div> }
      </div>
      <a href={`/${url}`} className="view-project-link" target="_blank">
        <button className="view-project button-small button-docs">
          View →
        </button>
      </a>
        
    </button>
  );
};

CollectionResultItem.propTypes = {
  action: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  avatarUrl: PropTypes.string,
  url: PropTypes.string
};

export default CollectionResultItem;

