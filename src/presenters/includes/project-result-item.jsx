import React from 'react';

// const Users = ({users}) => {
//   if (!users) {
//     return null
//   }
//   return (
//     <p>i am users</p> 
//   )
  
  /*
  
  //you can also do it inline if you want, e.g....
  */
// };
// kinda like a private method on a class or something. kewlz
  // yup! 

//you can also choose to expose it if you want, like this:


// the 'export' means that _if someone chooses to_, they can grab it an use it,  but by default
// they won't.   this is handy if you have a bunch of components that really all go together,
// so tehy can be in the same file.

// so i can have multiple exports per file? it's not like module.exports :) COOL

/*
right, exports are sweeeeeeet.   they work like this:

from the module's perspective, you say:

'export' {thing};   now it's available.  do it as much as you want.
'export default {thing};  // optional but good practice,  sets up the default for the importer.


now, on the importers side..

import foo from 'module';
  // sets foo = whatever we set as 'default'

..but if i want then others, then...
import {first, second, third} from 'module';
 //assumes 'first, second, third' are marked as 'export'.

super cool

///and bonus points: 
  webpack knows how to tree-shake modules.
  so at build time it'll cut all the module code that isn't called.  :joy: whoa
  this mostly matters for the npm modules we use.
  so if i add a big package and use it only on the team page, it's not downloaded by the user when loading the homepage?
  
  eventually, yes;  right _now_, unfortunately, no, because we serve the same bundle for all.
  _however_ it will delete all the code in teh module that you don't use.
  
  for example, join me over in application.js....

  

*/

export const OtherComponent = () => (
  <p> I'm only used by ProjectResultItem, so use the fact that I'm part of this module,
   but not an exported component, to keep me encapsulated.
  
  however, it's awesome that I'm in my on top scope, because it guarantees that 
  i don't accidentally use any variables that aren't given to me as props.</p>
  );

const ProjectResultItem = ({title, domain, description, avatar, url, action, users}) => {
  
  // subtemplates should always be in the scope of ProjectResultItem?
  
  //no,  it depends.  The guiding principle is this:
  /*
    A component's job is to calculate its output (and inputs to its subcomponents) based on the props it receives.
    Anything that is part of that calculation lives _here_, in this scope.
    Anything that's dispatched to  (most, but not all, subcomponents), should be in their own component outside this scope.
    
    Where should the subcomponent be? well,  if it's only used by this component, then it can live in this file,
    e.g.
    
  
  */
  
  // 
  let variablething = <users></users>;
  if(notusers) {
    variablething =  <other></other>
            ;
  
  return (
    <a href={url} onClick={action}>
      <li className="result">
        <img className="avatar" src={avatar} alt={`Project avatar for ${title}`}/>
        <Users/>
        //or:
        // what does the first users mean? like it's just data at this point
        { users && <p>i am users</p> } {// <-- good for simple little things;  yup, it's javascript evaluation.}
          { true && <p> i will render.</p> }
          { false && <p> i will not render.</p> }
          // so it's not like if(x&&y) {do a thing} 
          // yeah, you can do 'if', sence every {} must return something to get it into the template
          // so most of the time, just use a component and give it what info it needs, e.g.:
          <Users {users}/>
          // but if you want to do a switch in this scope, you can do thigns like
          {variablething}
          //but that starts to get a little ugly, so only use it sparsely. - ya im not a ternary operator fan generally
            // I like to extract it up a layer if it gets gross, but it's truly the logic we want.  like this, watch...
          
          //this form is pretty clean though:
          { shouldIdoit? && <thingtodo/>} // coolz
          
        //it'll be calling a subtemplate for users if the condition is true. what 
        <div className="result-name" title={domain}>{domain}</div>
        <div className="result-description">{description}</div>
      </li>
    </a>
  );
};

export default ProjectResultItem;
