import React from 'react';

import {featuredCollections, moreIdeasTeam} from '../curated/collections';

import {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';

const MoreIdeas = ({collections}) => (
  <section className="more-ideas" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      {collections.map(collection => (
        <li key={collection.id}>
          <CollectionLink className="more-ideas-box-link" collection={collection}>
            <div className="more-ideas-box centered" style={{backgroundColor: collection.coverColor}}>
              <img src={collection.avatarUrl} alt=""/>
            </div>
            <div className="more-ideas-box-label centered" style={{backgroundColor: collection.coverColor}}>{collection.name}</div>
          </CollectionLink>
        </li>
      ))}
    </ul>
  </section>
);

export default ({api}) => (
  <DataLoader>
    {({data}) => (
      <MoreIdeas collections={data.collections.map(collection => ({...collection, team: data}))}/>
    )}
  </DataLoader>
);