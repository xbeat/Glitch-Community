import React from 'react';
const StarterProject = ({title, domain, description, avatarUrl}) => {
  const GlitchTeamAvatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267"

  return (
    <li>
      <div className="users">
        <div className="user made-by-glitch" data-tooltip="Glitch Team" data-tooltip-left="true">
          <img width="32" height="32" src={GlitchTeamAvatarUrl} alt="Glitch Team"/>
        </div>
      </div>
      <a href={`/~${domain}`}>
        <div className="project">
          <div className="project-container">
            <img className="avatar" src={avatarUrl} alt={`Avatar image for ${title}`}/>
            <button>
              <span className="private-project-badge"></span>
              <div className="project-name">{title}</div>
            </button>
            <div className="description">{description}</div>
            <div className="overflow-mask"></div>
          </div>
        </div>
      </a>
    </li>
  );
};
  
const JumpRightIn = ({application, ProjectModel}) => {
  
  const starterProjects = [ 'hello-expres', 'hello-webpage' ];
    {
      title: "hello-express",
      domain: "hello-express",
      description: "A simple Node app built on Express, instantly up and running.",
      avatarUrl: "https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2FNode.js_logo.svg?1521062036657"
    },
    {
      title: "hello-webpage",
      domain: "hello-webpage",
      description: "Your very own basic web page, ready for you to customize.",
      avatarUrl: "https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2FHTML5_logo_and_wordmark.svg?1521062032021"
    },
  ];
     
  return (
    <article className="jump-right-in projects">
      <h2>Jump Right In</h2>
      <ul className="projects-container">
        { starterProjects.map((starter, key) => (
          <StarterProject key={key} {...starter}/>
        ))}
      </ul>
    </article>
  );
}

export default JumpRightIn;
