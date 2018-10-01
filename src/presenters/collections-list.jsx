import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";
import axios from 'axios';

const wordsApi = axios.create({
  baseURL: 'https://friendly-words.glitch.me/',
});

export const CollectionsList = ({title, collections, placeholder, projectOptions, api, isAuthorized}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}
    
    {( isAuthorized 
      ? <button className={`button create-collection`} onClick={createCollection}>
            Create Collection
        </button>      
      : null      
    )}
    
    {/* <a href="/favorites"><button className={`button create-collection`} onClick={createCollection}>Create Collection</button></a>*/}

    <CollectionsUL {...{collections, projectOptions, api, isAuthorized}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

// Create a new collection
async function createCollection(){
  console.log('attempt to create collection!');
  // generate random name for collection
  let name = ''; // name for collection
  name = await wordsApi.get('word-pairs')[0];
  description = `A collection of projects that does wondrous things`;
  $.get("https://friendly-words.glitch.me/word-pairs/").then((data) => {
    name = data[0];
    console.log(`name: ${name}`);
  });
  
  
  // open up new collection
}

export const CollectionsUL = ({collections, projectOptions, categoryColor, api, isAuthorized}) => {
  return (
    <ul className="collections-container">
      {/* DUMMY EMPTY COLLECTION CARD */}
      <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      
      { collections.map(collection => (
        <CollectionItem key={collection.id} collection={collection} api={api} isAuthorized={isAuthorized}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};


export default CollectionsList;
