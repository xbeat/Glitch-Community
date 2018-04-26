import React from 'react';
import PropTypes from 'prop-types';


// const Users = ({users}) => {
//   return (
//     <p>i am users</p> 
//   )
// }


const Users = ({users}) => (
  <p>i am users</p>
)

const ProjectResultItem = ({
    title, 
    domain, 
    description, 
    avatar, 
    url="javascript:void(0);", 
    action, 
    users=[]
  }) => (
    <a href={url} onClick={action}>
      <li className="result">
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>

        { users.length > 0 && <Users/> }

        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </li>
    </a>
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
