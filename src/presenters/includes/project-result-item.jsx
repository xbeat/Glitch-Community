import React from 'react';

const ProjectResultItem = ({title, domain, description, avatar, url, action}) => {
  return (
    <li>
      <a className="result" href={url} onClick={action}>
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </a>
    </li>
  );
};

export default ProjectResultItem;
