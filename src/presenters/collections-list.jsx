import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from "./collection-item.jsx";

export const CollectionsList = ({title, collections, placeholder, projectOptions}) => (
  <article className="collections">
    <h2>{title}</h2>

    {!!(placeholder && !collections.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <CollectionsUL {...{collections, projectOptions}}></CollectionsUL>

  </article>
);

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  api: PropTypes.func.isRequired
};

export const CollectionsUL = ({collections, projectOptions, categoryColor}) => {
  return (
    <ul className="collections-container">
      { collections.map(collection => (
        <CollectionItem key={collection.id} collection={collection}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  collections: PropTypes.array.isRequired,
};


export default CollectionsList;
