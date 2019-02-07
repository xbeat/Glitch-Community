import React from 'react';

import categories from '../curated/categories';
import {moreIdeasTeam} from '../curated/collections';
import {isDarkColor} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import Link, {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';

const MoreIdeasCollectionsDisplay = ({collections}) => (
  <section className="more-ideas">
    <h2>More Ideas</h2>
    <ul>
      {collections.map(collection => (
        <li key={collection.id}>
          <CollectionLink collection={collection} style={{backgroundColor: collection.coverColor}}
            className={"more-ideas-box " + (isDarkColor(collection.coverColor) ? "dark" : "")}
          >
            <CollectionAvatar color={collection.coverColor}/>
            {collection.name}
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

export const MoreIdeasCategories = () => (
  <section className="more-ideas">
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

export default MoreIdeasCategories;