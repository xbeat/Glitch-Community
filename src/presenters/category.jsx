import React from 'react';
import PropTypes from 'prop-types';

import {ProjectsUL} from "./projects-list.jsx";

export const Category = (application, category) => {
  const ulProps = {
    closeAllPopOvers: application.closeAllPopOvers,
    projects: projects.map(project => project.asProps()),
    categoryColor: category.color(),
  };
  return (
    <article className="projects" style={backgroundColor: category.backgroundColor()}>
      <header className="category">
        <a className="category-name" href={category.url()}>
          <h2>{category.name()} <span className="arrow">→</span></h2>
        </a>
        <span className="category-image-container">
          <a className="category-image" href={category.url()}>
            <img src={category.avatarUrl()} alt={category.name()} />
          </a>
        </span>
        <p className="category-description">{category.description()}</p>
      </header>
      <ProjectsUL {...ulProps}/>
    </article>
  );
}

export default Category;