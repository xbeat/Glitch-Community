import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";

export const CollectionsList = ({title, collections, placeholder, collectionOptions}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <CollectionsUL {...{collections, collectionOptions}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

export const CollectionsUL = ({collections, collectionOptions, collectionColor}) => {
  return (
    <ul className="collections-container">
      { collections.map(collection => (
        <CollectionItem key={collection.id} {...{collection, collectionOptions, collectionColor}}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  collections: PropTypes.array.isRequired,
};


export default CollectionsList;
