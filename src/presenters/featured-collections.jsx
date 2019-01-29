import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import {sampleSize} from 'lodash';

import {featuredCollections} from '../curated/collections';
import {isDarkColor} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';
import {TruncatedMarkdown} from './includes/markdown';
import ProjectsLoader from './projects-loader';
import {ProjectsUL} from './projects-list';
import {TeamTile} from './teams-list';
import {UserTile} from './users-list';

const CollectionWide = ({collection, api}) => {
  const dark = isDarkColor(collection.coverColor) ? 'dark' : '';
  return (
    <article className="collection-wide projects" style={{backgroundColor: collection.coverColor}}>
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
          <TruncatedMarkdown length={80}>{collection.description}</TruncatedMarkdown>
        </div>
      </header>
      <div className="collection-contents">
        <ProjectsLoader api={api} projects={collection.projects}>
          {projects => <ProjectsUL projects={projects}/>}
        </ProjectsLoader>
        <CollectionLink collection={collection} className="collection-view-all">
          View all <Pluralize count={collection.projectCount} singular="project"/> <span aria-hidden>→</span>
        </CollectionLink>
      </div>
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
  api: PropTypes.any.isRequired,
};

const loadCollection = async (api, info) => {
  let collections = [];
  if (info.team) {
    const {data: teamId} = await api.get(`teamId/byUrl/${info.team}`);
    if (teamId !== 'NOT FOUND') {
      const {data: teamCollections} = await api.get(`collections?teamId=${teamId}`);
      collections = teamCollections;
    }
  } else if (info.user) {
    const {data: userId} = await api.get(`userId/byLogin/${info.user}`);
    if (userId !== 'NOT FOUND') {
      const {data: userCollections} = await api.get(`collections?userId=${userId}`);
      collections = userCollections;
    }
  }
  const collection = collections.find(c => c.url === info.name);
  if (collection) {
    const {data} = await api.get(`collections/${collection.id}`);
    data.projectCount = data.projects.length;
    data.projects = sampleSize(data.projects, 3).map(p => ({...p, users: p.users||[]}));
    return data;
  }
  return null;
};

const loadAllCollections = async (api, infos) => {
  // don't await until every request is sent so they can all run at once
  const promises = infos.map(info => loadCollection(api, info));
  return await Promise.all(promises);
};

export const FeaturedCollections = ({api}) => (
  <DataLoader get={() => loadAllCollections(api, featuredCollections)}>
    {collections => collections.filter(c => !!c).map(collection => (
      <CollectionWide collection={collection} api={api} key={collection.id}/>
    ))}
  </DataLoader>
);

FeaturedCollections.propTypes = {
  api: PropTypes.any.isRequired,
};

export default FeaturedCollections;