import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { sampleSize } from 'lodash';

import { captureException } from '../utils/sentry';
import { featuredCollections } from '../curated/collections';
import { isDarkColor } from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import { CollectionLink } from './includes/link';
import { DataLoader } from './includes/loader';
import { TruncatedMarkdown } from './includes/markdown';
import ProjectsLoader from './projects-loader';
import { ProjectsUL } from './projects-list';
import { TeamTile } from './teams-list';
import { UserTile } from './users-list';

const CollectionWide = ({ collection, api }) => {
  const dark = isDarkColor(collection.coverColor) ? 'dark' : '';
  return (
    <article
      className="collection-wide projects"
      style={{ backgroundColor: collection.coverColor }}
    >
      <header className={`collection ${dark}`}>
        <CollectionLink
          className="collection-image-container"
          collection={collection}
        >
          <CollectionAvatar color={collection.coverColor} />
        </CollectionLink>
        <CollectionLink className="collection-name" collection={collection}>
          <h2>
            {collection.name}
          </h2>
        </CollectionLink>
        {!!collection.team && <TeamTile team={collection.team} />}
        {!!collection.user && <UserTile {...collection.user} />}
        <div className="collection-description">
          <TruncatedMarkdown length={80}>
            {collection.description}
          </TruncatedMarkdown>
        </div>
      </header>
      <div className="collection-contents">
        <ProjectsLoader api={api} projects={collection.projects}>
          {projects => <ProjectsUL projects={projects} api={api} />}
        </ProjectsLoader>
        <CollectionLink collection={collection} className="collection-view-all">
          View all
          {' '}
          <Pluralize count={collection.projectCount} singular="project" />
          {' '}
          <span aria-hidden>→</span>
        </CollectionLink>
      </div>
    </article>
  );
};

CollectionWide.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  api: PropTypes.any.isRequired,
};

const loadCollection = async (api, { owner, name }) => {
  try {
    const { data: collectionId } = await api.get(
      `collections/${owner}/${name}`,
    );
    const { data: collection } = await api.get(`collections/${collectionId}`);
    collection.projectCount = collection.projects.length;
    collection.projects = sampleSize(collection.projects, 3).map(p => ({
      ...p,
      users: p.users || [],
    }));
    return collection;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    captureException(error);
  }
  return null;
};

const loadAllCollections = async (api, infos) => {
  // don't await until every request is sent so they can all run at once
  const promises = infos.map(info => loadCollection(api, info));
  return Promise.all(promises);
};

export const FeaturedCollections = ({ api }) => (
  <DataLoader get={() => loadAllCollections(api, featuredCollections)}>
    {collections => collections
      .filter(c => !!c)
      .map(collection => (
        <CollectionWide
          collection={collection}
          api={api}
          key={collection.id}
        />
      ))
    }
  </DataLoader>
);

FeaturedCollections.propTypes = {
  api: PropTypes.any.isRequired,
};

export default FeaturedCollections;
