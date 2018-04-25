import React from 'react';
// import Project from 'Project';
import ProjectResultListItem from 'project-result'; // change to -result-list-item

// - ProjectItem = require "./project-item"
// - NewProjectItemPresenter = require "../../source/presenters/pop-overs/new-project-item"

// function githubAuthLink() {
//   var clientId, redirectUri, scope;
//   clientId = GITHUB_CLIENT_ID;
//   scope = "user:email";
//   redirectUri = encodeURIComponent(`${APP_URL}/login/github`);
//   return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
// }

// function facebookAuthLink() {
//   var callbackURL, clientId, scopes;
//   clientId = FACEBOOK_CLIENT_ID;
//   scopes = "email";
//   callbackURL = encodeURIComponent(`${APP_URL}/login/facebook`);
//   return "https://www.facebook.com/v2.9/dialog/oauth?" + `client_id=${clientId}&scope=${scopes}&redirect_uri=${callbackURL}`;
// }

// const SignInPopButton = (props) => (
//   <a className="button-link" href={props.href}>
//     <div className="button button-small">Sign in with {props.company}
//       <span className={`emoji ${props.emoji}`}></span>
//     </div>
//   </a>
// );

const basepath = "https://glitch.com/edit";
const newProjects = [
  {
    domain: 'hello-express',
    // staticName: 'node-app',
    description: 'Create a Node app built on Express',
    staticAvatar: basepath + '/images/new-project-avatars/hello-express.svg',
    avatarUpdatedAt: new Date()
  },
  {
    domain: 'hello-sqlite',
    // staticName: 'node-sqlite',
    description: 'A Node app with an SQLite database to hold data.',
    staticAvatar: basepath + '/images/new-project-avatars/hello-sqlite.svg',
    avatarUpdatedAt: new Date()
  },
  {
    domain: 'hello-webpage',
    // staticName: 'webpage',
    description: 'Your very own web page',
    staticAvatar: basepath + '/images/new-project-avatars/hello-webpage.svg',
    avatarUpdatedAt: new Date()
  }
]

const NewProjectPop = () => (
  <div className="pop-over new-project-pop pop-list">
    <section className="pop-over-actions pop-list-results">
      <ul className="results">
        
        // for each NewProjects (project) , projectresultitem
        {console.log(application.newProjects())}        
      </ul>
    </section>
  </div>
);

export default NewProjectPop;
