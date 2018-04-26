import React from 'react';
import PropTypes from 'prop-types';


const Users = ({users}) => {
  return (
    <p>i am users</p> 
  )
}

const ProjectResultItem = ({title, domain, description, avatar, url, action, users=[]}) => {    //tada, now users will *ALWAYS* be an array. 
  return (
    <a href={url} onClick={action}>
      <li className="result">
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
        <Users/>
        { users.length && <Users/> }

        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </li>
    </a>
  );
};

ProjectResultItem.propTypes = {
  //each 'key' maps to a prop that you use here.
  //if your only use of the prop is to pass it to a child, you can skip it.
  // do i have to specify types on all params? should i?
  //you don't _have to_, but it's a good idea, and it'll propagate up the entire call tree.
  // so there should never be redundancy unless multiple parts of the chain depend on the same prop,
  // in which case the duplicate prop types are good because they'll guard you in refactors.
  // ok coolz
  // so you mean i dont have to redefined the proptype for a child?
  // cool
  // i mean that proptypes should only be defined in the spot that they are used.
  // so if you trust that your children do it, you don't have to because they'll catch it for you.
  // ..but if you yourself use it, then you do.
  title: PropTypes.string.isRequired, 
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  users: PropTypes.array,  //now it's optional,  but if it comes in then it has to be an array.
  // can i evaluate it if it's not included , like users.length won't work on undefined. un
  // unless i set a default. cool 
  // right, so always use a default.  watch:
  
  // ah fancy, does =[] replace the need for proptyles?
  // nope, because that's just a default value if it's undefined.
  // if somebody passes you a string, proptypes will shout it down for you.
  // ahhh icic
  
  // now here, decide if you want to require it or not.  if you want i
  // users maybe should be optional. in some results lists it shouldn't be a consideration
  // so i like to think about 'whose decision should that be?",
  // parent/caller?
  // we can make it required here and then the parent would just pass '[]' if it wants to,
  // or we can make it optional here and the parent can leave it off - i like this approach for this
  // ok cool, then we do this....
  // make it optional in proptypes and give it a default <--
  // both are fairly ok, it kind of has to do with how many parents you have :p
  // my thinking is that parents should only be concerned with what they're gonna render, rather than the structure of a method - as much as possible anyways
};



export default ProjectResultItem;
