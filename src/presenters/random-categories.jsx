import React from 'react';
import PropTypes from 'prop-types';

import {ProjectsUL} from "./projects-list.jsx";
import {sampleSize} from 'lodash';

const Category = ({closeAllPopOvers, category}) => {
  const ulProps = {
    closeAllPopOvers,
    projects: category.projects||[],
    categoryColor: category.color,
  };
  return (
    <article className="projects" style={{backgroundColor: category.backgroundColor}}>
      <header className="category">
        <a className="category-name" href={category.url}>
          <h2>{category.name} <span className="arrow">→</span></h2>
        </a>
        <span className="category-image-container">
          <a className="category-image" href={category.url}>
            <img  height="80px" width="120px" src={category.avatarUrl} alt={category.name} />
          </a>
        </span>
        <p className="category-description">{category.description}</p>
      </header>
      <ProjectsUL {...ulProps}/>
    </article>
  );
};

Category.propTypes = {
  category: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const Categories = ({categories, closeAllPopOvers}) => (
  <React.Fragment>
    { this.props.categories.map((category) => (
      <Category key={category.id} category={category} closeAllPopOvers={this.props.closeAllPopOvers}/>
    ))}
  </React.Fragment>
);

Categories.propTypes = {
  categories: PropTypes.arrayOf({
    id: PropTypes.number.isRequired,
  }).isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
};

export default Categories;
