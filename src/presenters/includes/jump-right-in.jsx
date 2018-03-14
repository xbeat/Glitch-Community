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
      <a href={`https://glitch.com/edit/#!/remix/${domain}`}>
        <div className="project">
          <div className="project-container">
            <img className="avatar" src={avatarUrl} alt={`Avatar image for ${title}`}/>
            <button>
              <span className="private-project-badge"></span>
              <div className="project-name">{title} <div className="emoji microphone"></div></div>
            </button>
            <div className="description">{description}</div>
            <div className="overflow-mask"></div>
          </div>
        </div>
      </a>
    </li>
  );
};
  
const JumpRightIn = () => {
  const starterProjects = [
    {
      title: "Remix a Node.js App",
      domain: "hello-node",
      description: "Behold the wonderful description of what it is to be a node app.",
      avatarUrl: "https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2FNode.js_logo.svg?1521062036657"
    },
    {
      title: "Remix a Web Page",
      domain: "hello-website",
      description: "Behold the wonderful description of what it is to be a website.",
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
