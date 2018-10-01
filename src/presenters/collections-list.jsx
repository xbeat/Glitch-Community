import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";
import axios from 'axios';
import _ from 'lodash';

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
      ? <button className={`button create-collection`} onClick={createCollection(api)}>
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
async function createCollection(api){
  console.log('attempt to create collection!');
  // generate random name for collection
  const {data} = await wordsApi.get('word-pairs');
  console.log(`data: ${data}`);
  let name = data[0];
  console.log(`name: ${name}`);
  let description = `A collection of ${name.split("-")[0]} projects that does ${name.split("-")[1]} things`;
  console.log(`description: ${description}`);
  let url = _.kebabCase(name); // what is the typical format for this URL?  relative?
  // const {response} = await api.post('collections', {
  //   name,
  //   description,
  //   url,
  // });
  // console.log(`response: ${response}`);
  
  // open up new collection
  // window.location.replace(url);
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

