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

export default class CategoryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }
  
  componentDidMount() {
    this.props.getCategories().then((categoriesJSON) => {
      // The API gives us a json blob with all of the categories, but only
      // the 'projects' field on 3 of them.  If the field is present,
      // then it's an array of projects.
      const categoriesWithProjects = categoriesJSON.filter(category => !!category.projects);
      const sampledCategories = sampleSize(categoriesWithProjects, 3);
      const categories = sampledCategories.map(categoryJSON => {
        const {...category} = this.props.categoryModel(categoryJSON).asProps();
        category.projects = sampleSize(category.projects, 3);
        return category;
      });
      this.setState({categories});
    });
  }
  render() {
    return (
      <React.Fragment>
        { this.state.categories.map((category) => (
          <Category key={category.id} category={category} closeAllPopOvers={this.props.closeAllPopOvers}/>
        ))}
      </React.Fragment>
    );
  }
}

CategoryContainer.propTypes = {
  getCategories: PropTypes.func.isRequired,
  closeAllPopOvers: PropTypes.func.isRequired,
  categoryModel: PropTypes.func.isRequired,
};
