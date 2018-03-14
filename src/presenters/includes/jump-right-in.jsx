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
  
const JumpRightIn = () => (
  <article className="jump-right-in">
    <h2>Jump Right In</h2>
    <ul></ul>
  </article>
);

export default JumpRightIn;
