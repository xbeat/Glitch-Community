import React from 'react';
import PropTypes from 'prop-types';


const Users = ({users}) => {
  return (
    <p>i am users</p> 
  )
}

const ResultItem = () => (
  return (
    <li className="result">
      <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>

      { users.length > 0 && <Users/> }

      <div className="result-name" title={domain}>{domain}</div>
      <div className="result-description">{description}</div>
    </li>
  )
};

const ResultItemWithUrl = ({props}) => {
  return (
    <a href={props.url} >
      <ResultItem />
    </a>
  );
};

const ProjectResultItem = ({props}) => {
  return (
    
    { props.url && <ResultItemWithUrl {...props} /> }
    
  );
};

ProjectResultItem.propTypes = {
  title: PropTypes.string.isRequired, 
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  users: PropTypes.array,
};



export default ProjectResultItem;
