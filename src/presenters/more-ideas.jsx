import React from 'react';

import categories from '../curated/categories';
import {moreIdeasTeam} from '../curated/collections';
import {isDarkColor} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import Link, {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';

const MoreIdeasCollectionsDisplay = ({collections}) => (
  <section className="more-ideas" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      {collections.map(collection => (
        <li key={collection.id}>
          <CollectionLink className="more-ideas-box-link" collection={collection}>
            <div className="more-ideas-box centered" style={{backgroundColor: collection.coverColor}}>
              <CollectionAvatar color={collection.coverColor}/>
            </div>
            <div className="more-ideas-box-label centered" style={{
              backgroundColor: collection.coverColor,
              color: isDarkColor(collection.coverColor) ? 'white' : '',
            }}>{collection.name}</div>
          </CollectionLink>
        </li>
      ))}
    </ul>
  </section>
);

export const MoreIdeasCollections = ({api}) => (
  <DataLoader get={() => api.get(`teamid/byUrl/${moreIdeasTeam}`)}>
    {({data}) => (
      <DataLoader get={() => data !== 'NOT FOUND' ? api.get(`collections?teamId=${data}`) : null}>
        {({data}) => (
          <MoreIdeasCollectionsDisplay collections={data.map(collection => ({...collection, team: {url: moreIdeasTeam}}))}/>
        )}
      </DataLoader>
    )}
  </DataLoader>
);

const MoreIdeas = () => (
  <section className="more-ideas" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      {categories.map(category => (
        <li key={category.id}>
          <Link className="more-ideas-box" to={category.url} style={{backgroundColor: category.color}}>
            <img src={category.avatarUrl} alt=""/>
            <div>{category.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MoreIdeas;