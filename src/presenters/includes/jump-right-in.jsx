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

const StarterProject = ({name}) => (
  <li>
    <span>
      <div class="users hidden">
        <div class="users">
          <div class="user made-by-glitch" style="background-color:#74ecfc" data-tooltip="Glitch Team" data-tooltip-left="true">
            <img width="32" height="32" src={GlitchTeamAvatar alt="Glitch Team">
          </div></div></span><div class="project-options button-borderless opens-pop-over hidden"><div class="down-arrow"></div></div><a href="/~backbone-todomvc"><div class="project" data-track="project" data-track-label="backbone-todomvc" style="background-color: rgb(252, 243, 175); border-bottom-color: rgb(252, 243, 175);"><div class="project-container"><img class="avatar" src="https://cdn.glitch.com/project-avatar/c16a0c85-5369-42c2-9f2f-9144d02c5c93.png" alt="backbone-todomvc avatar"><button class=""><span class="private-project-badge"></span><div class="project-name">backbone-todomvc</div></button><div class="description">TodoMVC example using Backbone.js</div><div class="overflow-mask" style="background-color: rgb(252, 243, 175);"></div></div></div></a>
          </li>
);
  
const JumpRightIn = () => (
  <article className="jump-right-in">
    <h2>Jump Right In</h2>
    <ul>
      <StarterProject key="website" name="website"/>
      <StarterProject key="node" name="node"/>
    </ul>
  </article>
);

export default JumpRightIn;
