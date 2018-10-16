import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import ProjectModel from '../models/project';

import {ProjectsUL} from './projects-list.jsx';

const Category = ({category}) => {
  const ulProps = {
    projects: category.projects||[],
    categoryColor: category.color,
    homepageCollection: true,
    collectionUrl: category.url
  };
  return (
    <article className="projects" style={{backgroundColor: category.backgroundColor}}>
      <header className="category">
        <a className="category-name" href={category.url}>
          <h2>{category.name} </h2>
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

class CategoryLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }
  
  async loadCategoryProjectCount(categoryId){
    // const {data} = await this.props.api.get('categories/
  }
  
  async loadCategories() {
    // The API gives us a json blob with all of the categories, but only
    // the 'projects' field on 3 of them.  If the field is present,
    // then it's an array of projects.
    const {data} = await this.props.api.get('categories/random?numCategories=3');
    const categoriesWithProjects = data.filter(category => !!category.projects);
    const sampledCategories = sampleSize(categoriesWithProjects, 3);
    console.log("sampledCategories %O", sampledCategories);
    const categories = sampledCategories.map(({projects, ...category}) => {
      const sampledProjects = projects;
      console.log("projects %O", projects);
      return {
        projects: sampledProjects.map(project => ProjectModel(project).update(project).asProps()),
        ...category,
      };
    });
    this.setState({categories});
  }
  
  componentDidMount() {
    this.loadCategories();
  }
  
  render() {
    return this.state.categories.map((category) => (
      <Category key={category.id} category={category}/>
    ));
  }
}

CategoryLoader.propTypes = {
  api: PropTypes.any.isRequired,
};

export default CategoryLoader;