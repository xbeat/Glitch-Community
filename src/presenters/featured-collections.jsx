import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';
import {captureException, captureMessage} from '../utils/sentry';

import {featuredCollections} from '../curated/collections';
import {getLink} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import CollectionLink from './includes/link';
import {ProjectsUL} from './projects-list';

const CollectionWide = ({collection}) => {
  const ulProps = {
    projects: collection.projects,
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
      <ProjectsUL {...ulProps} projectCount={collection.projects.length} collectionColor={collection.coverColor}/>
    </article>
  );
};

CollectionWide.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

class FeaturedCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: {},
    };
  }
  
  async loadCollection(n, info) {
    try {
      let collections = [];
      if (info.team) {
        const {data} = await this.props.api.get(`teams/byUrl/${info.team}`);
        collections = data.collections;
      } else if (info.user) {
        const {data: userId} = await this.props.api.get(`userid/byLogin/${info.user}`);
        if (userId !== 'NOT FOUND') {
          const {data} = await this.props.api.get(`collections?userId=${userId}`);
          collections = data;
        }
      }
      const collection = collections.find(c => c.url === info.url);
      if (collection) {
        const {data} = await this.props.api.get(`collections/${collection.id}`);
        this.setState(({collections}) => ({collections: {...collections, [n]: data}}));
      }
    } catch (error) {
      console.log(error);
      captureException(error);
    }
  }
  
  componentDidMount() {
    featuredCollections.forEach((info, n) => {
      this.loadCollection(n, info);
    });
  }
  
  render() {
    const collections = Array.from(featuredCollections.keys()).map(n => this.state.collections[n]);
    return collections.filter(c => !!c).map(collection => (
      <CollectionWide key={collection.id} collection={collection}/>
    ));
  }
}

FeaturedCollections.propTypes = {
  api: PropTypes.any.isRequired,
};

export default FeaturedCollections;