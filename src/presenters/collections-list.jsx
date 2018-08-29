import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";

export const CollectionsList = ({title, projects, placeholder, projectOptions}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !projects.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <CollectionsUL {...{projects, projectOptions}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

export const CollectionsUL = ({projects, projectOptions, categoryColor}) => {
  return (
    <ul className="collections-container">
      { projects.map(project => (
        <CollectionItem key={project.id} {...{project, projectOptions, categoryColor}}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};


export default CollectionsList;
