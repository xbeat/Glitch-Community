import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from "./project-item.jsx";

export const ProjectsList = ({title, projects, placeholder, projectOptions}) => (
  <article className="projects">
    <h2>{title}</h2>

    {!!(placeholder && !projects.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <ProjectsUL {...{projects, projectOptions}}></ProjectsUL>

  </article>
);

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

export const ProjectsUL = ({projects, projectOptions, categoryColor, homepageCollection, collectionUrl, ...props}) => {
  return (
    <React.Fragment>
      <ul className="projects-container">
        { projects.map(project => (
          <ProjectItem key={project.id} {...{project, projectOptions, categoryColor}}></ProjectItem>
        ))}
        
        {/* The link to view all projects for collections on the homepage  TO DO show actual count of projects*/}  
      {homepageCollection
        ? <a href={collectionUrl} className="collection-view-all">View all {projects.length} projects →</a>
        : null
      }
        
      </ul>

    </React.Fragment>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};


export default ProjectsList;
