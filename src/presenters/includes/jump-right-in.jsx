import React from 'react';
const StarterProject = ({title, domain, description, avatar, showOverlay}) => {
  const GlitchTeamAvatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267"

  function clickProject(event) {
    event.preventDefault();
    event.stopPropagation();
    showOverlay();
  }
  
  return (
    <li>
      <div className="users">
        <div className="user made-by-glitch" data-tooltip="Glitch Team" data-tooltip-left="true">
          <img width="32" height="32" src={GlitchTeamAvatarUrl} alt="Glitch Team"/>
        </div>
      </div>
      <a href={`/~${domain}`} onClick={clickProject}>
        <div className="project">
          <div className="project-container">
            <img className="avatar" src={avatar} alt={`Avatar image for ${title}`}/>
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
  
const JumpRightIn = ({starterProjects}) => {
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
