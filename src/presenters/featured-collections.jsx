import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';

import {getLink} from '../models/collection';
import CollectionAvatar from './includes/collection-avatar';
import CollectionLink from './includes/link';
import {ProjectsUL} from './projects-list';

const Collection = ({collection}) => {
  const ulProps = {
    projects: collection.projects||[],
    categoryColor: collection.color,
    homepageCollection: true,
    collectionUrl: getLink(collection),
  };
  return (
    <article className="projects" style={{backgroundColor: collection.coverColor}}>
      <header className="category">
        <CollectionLink className="category-name" collection={collection}>
          <h2>{collection.name}</h2>
        </CollectionLink>
        <span className="category-image-container">
          <CollectionLink className="category-image" collection={collection}>
            <img height="80px" width="120px" src={collection.avatarUrl} alt="" />
          </CollectionLink>
        </span>
        <p className="category-description">{collection.description}</p>
      </header>
      <ProjectsUL {...ulProps} projectCount={projectCount} collectionColor={collection.coverColor}/>
    </article>
  );
};

Collection.propTypes = {
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
  
  async componentDidMount() {
    // The API gives us a json blob with all of the categories, but only
    // the 'projects' field on 3 of them.  If the field is present,
    // then it's an array of projects.
    const {data} = await this.props.api.get('categories/random?numCategories=3');
    const categoriesWithProjects = data.filter(category => !!category.projects);
    const categories = sampleSize(categoriesWithProjects, 3);
    this.setState({categories});
    // Now load each category to see how many projects it has
    categories.forEach(async ({id}) => {
      const {data} = await this.props.api.get(`categories/${id}`);
      this.setState(prevState => ({
        categoriesProjectCount: {...prevState.categoriesProjectCount, [id]: data.projects.length},
      }));
    });
  }
  
  render() {
    return this.state.categories.map(category => (
      <Category key={category.id} category={category} projectCount={this.state.categoriesProjectCount[category.id]}/>
    ));
  }
}

CategoryLoader.propTypes = {
  api: PropTypes.any.isRequired,
};

export default CategoryLoader;