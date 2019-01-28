import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';
import {captureException} from '../utils/sentry';

import {featuredCollections} from '../curated/collections';
import {getContrastTextColor} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';
import {TruncatedMarkdown} from './includes/markdown';
import ProjectsLoader from './projects-loader';
import {ProjectsUL} from './projects-list';
import {TeamTile} from './teams-list';
import {UserTile} from './users-list';

const CollectionWide = ({collection, api}) => {
  const dark = getContrastTextColor(collection.coverColor) === 'white' ? 'dark' : '';
  return (
    <div className="collection-wide">
      <article className="projects" style={{backgroundColor: collection.coverColor}}>
        <header className={`collection ${dark}`}>
          <CollectionLink className="collection-image-container" collection={collection}>
            <CollectionAvatar color={collection.coverColor}/>
          </CollectionLink>
          <CollectionLink className="collection-name" collection={collection}>
            <h2>{collection.name}</h2>
          </CollectionLink>
          {!!collection.team && <TeamTile team={collection.team}/>}
          {!!collection.user && <UserTile {...collection.user}/>}
          <div className="collection-description">
            <TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown>
          </div>
        </header>
        <div className="collection-contents">
          <ProjectsLoader api={api} projects={collection.projects}>
            {projects => <ProjectsUL projects={projects}/>}
          </ProjectsLoader>
          <CollectionLink collection={collection} className="collection-view-all">View all {collection.projectCount} projects →</CollectionLink>
        </div>
      </article>
    </div>
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
  api: PropTypes.any.isRequired,
};

const loadCollection = async info => {
  let collections = [];
  if (info.team) {
    const {data: teamId} = await this.props.api.get(`teamid/byUrl/${info.team}`);
    if (teamId !== 'NOT FOUND') {
      const {data} = await this.props.api.get(`collections?teamId=${teamId}`);
      collections = data;
    }
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
    data.projectCount = data.projects.length;
    data.projects = sampleSize(data.projects, 3).map(p => ({...p, users: p.users||[]}));
    return data;
  }
  return null;
};

export const FeaturedCollections = ({api}) => (
  <>
    {featuredCollections.map(info => (
     <DataLoader get={() => loadCollection(info)}>
       {collection => !!collection && (
         
       )}
     </DataLoader>
    ))}
  </>
);

class FeaturedCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: {},
      done: false,
      error: false,
    };
  }
  
  async loadCollection(n, info) {
    try {
      let collections = [];
      if (info.team) {
        const {data: teamId} = await this.props.api.get(`teamid/byUrl/${info.team}`);
        if (teamId !== 'NOT FOUND') {
          const {data} = await this.props.api.get(`collections?teamId=${teamId}`);
          collections = data;
        }
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
        data.projectCount = data.projects.length;
        data.projects = sampleSize(data.projects, 3).map(p => ({...p, users: p.users||[]}));
        this.setState(({collections}) => ({collections: {...collections, [n]: data}}));
      }
    } catch (error) {
      console.log(error);
      captureException(error);
      throw error;
    }
  }
  
  componentDidMount() {
    const loaders = featuredCollections.map((info, n) => this.loadCollection(n, info));
    Promise.all(loaders).then(() => {
      
    }, () => {
    });
  }
  
  render() {
    const collections = Array.from(featuredCollections.keys()).map(n => this.state.collections[n]);
    return collections.filter(c => !!c).map(collection => (
      <CollectionWide key={collection.id} collection={collection} api={this.props.api}/>
    ));
  }
}

FeaturedCollections.propTypes = {
  api: PropTypes.any.isRequired,
};

export default FeaturedCollections;