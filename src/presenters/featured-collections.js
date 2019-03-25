import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { sampleSize } from 'lodash';

import { featuredCollections } from '../curated/collections';
import { isDarkColor } from '../models/collection';

import { loadCollection } from './pages/collection';
import CollectionAvatar from './includes/collection-avatar';
import { CollectionLink } from './includes/link';
import { DataLoader } from './includes/loader';
import Markdown from '../components/text/markdown';
import ProjectsLoader from './projects-loader';
import { getSingleItem } from '../../shared/api';
import { ProjectsUL } from './projects-list';
import { TeamTile } from './teams-list';
import { UserTile } from './users-list';

import { useAPI } from '../state/api';
import Heading from '../components/text/heading';

const CollectionWide = ({ collection }) => {
  const dark = isDarkColor(collection.coverColor) ? 'dark' : '';
  return (
    <article className="collection-wide projects" style={{ backgroundColor: collection.coverColor }}>
      <header className={`collection ${dark}`}>
        <CollectionLink className="collection-image-container" collection={collection}>
          <CollectionAvatar color={collection.coverColor} />
        </CollectionLink>
        <CollectionLink className="collection-name" collection={collection}>
          <Heading tagName="h2">{collection.name}</Heading>
        </CollectionLink>
        {!!collection.team && <TeamTile team={collection.team} />}
        {!!collection.user && <UserTile {...collection.user} />}
        <div className="collection-description">
          <Markdown length={80}>{collection.description}</Markdown>
        </div>
      </header>
      <div className="collection-contents">
        <ProjectsUL projects={sampleSize(collection.projects, 3)} />
        <CollectionLink collection={collection} className="collection-view-all">
          View all <Pluralize count={collection.projects.length} singular="project" /> <span aria-hidden>→</span>
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
};

const loadAllCollections = async (api, infos) => {
  const promises = infos.map(({ owner, name }) => loadCollection(api, owner, name));
  return Promise.all(promises);
};

export const FeaturedCollections = () => {
  const api = useAPI();
  return (
    <DataLoader get={() => loadAllCollections(api, featuredCollections)}>
      {(collections) => collections.filter((c) => !!c).map((collection) => <CollectionWide collection={collection} key={collection.id} />)}
    </DataLoader>
  );
};
export default FeaturedCollections;
