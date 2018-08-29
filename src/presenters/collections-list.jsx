import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";

export const CollectionsList = ({title, projects, placeholder, projectOptions}) => (
  <article className="projects">
    <h2>{title}</h2>

    {!!(placeholder && !projects.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <ProjectsUL {...{projects, projectOptions}}></ProjectsUL>

  </article>
);

CollectionsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

export const ProjectsUL = ({projects, projectOptions, categoryColor}) => {
  return (
    <ul className="collections-container">
      { projects.map(project => (
        <CollectionItem key={project.id} {...{project, projectOptions, categoryColor}}></CollectionItem>
      ))}
    </ul>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};


export default CollectionsList;
