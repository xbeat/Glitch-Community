import React from 'react';


const Users = ({users}) => {
  return (
    <p>i am users</p> 
  )
}

const ProjectResultItem = ({title, domain, description, avatar, url, action, users}) => {  
  return (
    <a href={url} onClick={action}>
      <li className="result">
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
        <Users/>
        {console.log(users)}
        { users && Users }

        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </li>
    </a>
  );
};

export default ProjectResultItem;
