import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";

export const CollectionsList = ({title, collections, placeholder, projectOptions, api, isAuthorized}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}
    
    {( isAuthorized 
      ? <a href="/wondrous">
          <button className={`button create-collection`} onClick={null}>
            Create Collection
          </button>
        </a>
      : null      
      )}

    <CollectionsUL {...{collections, projectOptions, api}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export const CollectionsUL = ({collections, projectOptions, categoryColor, api}) => {
  return (
    <ul className="collections-container">
      { collections.map(collection => (
        <CollectionItem key={collection.id} collection={collection} api={api}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
};


export default CollectionsList;
