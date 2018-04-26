import React from 'react';

const Users = ({users}) => {
  if (users) {
    <p>i am users</p>  //missing 'return' ;-)
  }
  /*
  I'd usually do:
  if(!users) {
     return null - PK isn't the null implied? like if there are no users , dont do the thing
     //nope, all react components must return;  "null" means "render nothing",  
  }
  
  return (
    <p> I am users. etc. </p>
  );
  */
};

const ProjectResultItem = ({title, domain, description, avatar, url, action}) => {
  return (
    <a href={url} onClick={action}>
      <li className="result">
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
        {Users}
        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </li>
    </a>
  );
};

export default ProjectResultItem;
