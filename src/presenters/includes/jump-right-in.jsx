/*

-      return Reactlet(J
+      return Reactlet(JumpRightIn, null);
     }
-    jumpRightInProjectsObservable: Observable([]),
-    JumpRightInProjects() {
-      const projectIds = [
-        '0a59806f-5c0d-468e-84bb-fa5b54ecf500', // hello-website,
-        'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // hello-node
-      ];
-      const category = {}
-      const projects = ProjectModel.getProjectsByIds(application.api(), projectIds);
-      
-      return projects.filter(
-        (project) => project.fetched()
-      ).map((project) => 
-        ProjectItemPresenter(application, project, category)
-      );
-    },


article.projects.jump-right-in
-      h2 Jump Right In
-      ul.projects-container
-        = @JumpRightInProjects

*/ 

import React from 'react';
const StarterProject = ({title, domain, description, avatarUrl}) => {
  const GlitchTeamAvatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267"

  return (
    <li>
      <span>
        <div className="users">
          <div className="user made-by-glitch" data-tooltip="Glitch Team" data-tooltip-left="true">
            <img width="32" height="32" src={GlitchTeamAvatarUrl} alt="Glitch Team"/>
          </div>
        </div>
      </span>
      <a href={`https://glitch.com/edit/#!/remix/{project}`}>
        <div className="project" data-track="project" data-track-label="backbone-todomvc">
          <div className="project-container">
            <img className="avatar" src="{avatarUrl}" alt="Avatar image for {title}"/>
            <button className="">
              <span className="private-project-badge"></span>
              <div className="project-name">{title}<div class="emoji microphone"></div></div>
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
  starterProjects = [
    {title: "Create a node.js app, domain, description, avatarUrl},
  ];
     
  return (
    <article className="jump-right-in projects">
      <h2>Jump Right In</h2>
      <ul className="projects-container">
        <StarterProject key="website" name="website"/>
        <StarterProject key="node" name="node"/>
      </ul>
    </article>
  );
}

export default JumpRightIn;
