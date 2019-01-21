import React from 'react';

import {moreIdeasTeam} from '../curated/collections';
import {getContrastTextColor} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import {CollectionLink} from './includes/link';
import {DataLoader} from './includes/loader';

const MoreIdeasDisplay = ({collections}) => (
  <section className="more-ideas" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      {collections.map(collection => (
        <li key={collection.id}>
          <CollectionLink className="more-ideas-box-link" collection={collection}>
            <div className="more-ideas-box centered" style={{backgroundColor: collection.coverColor}}>
              <CollectionAvatar backgroundColor={collection.coverColor}/>
            </div>
            <div className="more-ideas-box-label centered" style={{
              backgroundColor: collection.coverColor,
              color: getContrastTextColor(collection.coverColor),
            }}>{collection.name}</div>
          </CollectionLink>
        </li>
      ))}
    </ul>
  </section>
);

const MoreIdeas = ({api}) => (
  <DataLoader get={() => api.get(`teams/byUrl/${moreIdeasTeam}`)}>
    {({data}) => (
      <MoreIdeasDisplay collections={data.collections.map(collection => ({...collection, team: data}))}/>
    )}
  </DataLoader>
);

export default MoreIdeas;