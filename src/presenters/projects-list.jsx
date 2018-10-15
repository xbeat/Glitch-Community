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



export const ProjectsUL = ({projects, projectOptions, categoryColor}) => {
  return (
    <ul className="projects-container">
      { projects.map(project => (
        <ProjectItem key={project.id} {...{project, projectOptions, categoryColor}}></ProjectItem>
      ))}
    </ul>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};


export default ProjectsList;
