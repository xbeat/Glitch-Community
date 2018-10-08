import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";
import {getLink} from '../models/collection';

import axios from 'axios';
import _ from 'lodash';

const wordsApi = axios.create({
  baseURL: 'https://friendly-words.glitch.me/',
});

export const CollectionsList = ({title, collections, placeholder, deleteCollection, api, isAuthorized}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}
    
    {( isAuthorized 
      ? <button className={`button create-collection`} onClick={() => createCollection(api)}>
            Create Collection
        </button>      
      : null      
    )}
    
    {/* <a href="/favorites"><button className={`button create-collection`} onClick={createCollection}>Create Collection</button></a>*/}

    <CollectionsUL {...{collections, deleteCollection, api, isAuthorized}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

// ensure that the user doesn't already have a collection with this name
async function validate(name){
  return true
}

// Create a new collection
async function createCollection(api){
  console.log('attempt to create collection!');
  
  // generate random name for collection
  const {word_pair} = await wordsApi.get('word-pairs');
  console.log(`word_pair: ${word_pair}`);
  let name = word_pair[0];
  console.log(`name: ${name}`);
  let description = `A collection of projects that does ${name.split("-")[0]} things`;
  console.log(`description: ${description}`);
  let url = _.kebabCase(name);
  let avatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"; // default fish
  if(validate(name)){
    const {data} = await api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
    });
   console.log(`data: ${data}`);
   history.push(getLink(data));
  }
}

export const CollectionsUL = ({collections, deleteCollection, categoryColor, api, isAuthorized}) => {
  return (
    <ul className="collections-container">
      {/* DUMMY EMPTY COLLECTION CARD */}
      <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      
      { collections.map(collection => (
        <CollectionItem key={collection.id} collection={collection} api={api} isAuthorized={isAuthorized} deleteCollection={deleteCollection}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};


export default CollectionsList;

