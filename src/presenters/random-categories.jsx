import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import Link from './includes/link.jsx';
import {ProjectsUL} from './projects-list.jsx';

const Category = ({category, projectCount}) => {
  const ulProps = {
    projects: category.projects||[],
    categoryColor: category.color,
    homepageCollection: true,
    collectionUrl: category.url,
  };
  return (
    <article className="projects" style={{backgroundColor: category.backgroundColor}}>
      <header className="category">
        <Link className="category-name" to={category.url}>
          <h2>{category.name}</h2>
        </Link>
        <span className="category-image-container">
          <Link className="category-image" to={category.url}>
            <img height="80px" width="120px" src={category.avatarUrl} alt={category.name} />
          </Link>
        </span>
        <p className="category-description">{category.description}</p>
      </header>
      <ProjectsUL {...ulProps} projectCount={projectCount} collectionColor={category.color}/>
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
      categoriesProjectCount: {},
    };
  }
  
  loadCategoryProjectCount(){
    this.state.categories.forEach(async ({id}) => {
      const {data} = await this.props.api.get(`categories/${id}`);
      this.setState(({categoriesPro{categoriesProjectCount: this.state.categoriesProjectCount}});
    });
  }
  
  async loadCategories() {
    // The API gives us a json blob with all of the categories, but only
    // the 'projects' field on 3 of them.  If the field is present,
    // then it's an array of projects.
    const {data} = await this.props.api.get('categories/random?numCategories=3');
    const categoriesWithProjects = data.filter(category => !!category.projects);
    const categories = sampleSize(categoriesWithProjects, 3);
    this.setState({categories});
    this.loadCategoryProjectCount();
  }
  
  componentDidMount() {
    this.loadCategories();
  }
  
  render() {
    return this.state.categories.map((category, index) => (
      <Category key={category.id} category={category} projectCount={this.state.categoriesProjectCount[category.id]}/>
    ));
  }
}

CategoryLoader.propTypes = {
  api: PropTypes.any.isRequired,
};

export default CategoryLoader;