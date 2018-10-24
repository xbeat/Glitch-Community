import React from 'react';
import PropTypes from 'prop-types';
import {kebabCase} from 'lodash';

import {getLink} from '../../models/collection';
import {EditableWrappingField} from './editable-wrapping-field.jsx';

export const EditCollectionNameAndUrl = ({owner, name, url, update, isAuthorized}) => {
  const placeholder = 'Name your collection';
  return (
    <React.Fragment>
      <h1 className="collection-name">
        {(isAuthorized
          ? <EditableWrappingField
              value={name} placeholder="Name your collection"
              update={name => update({name, url: kebabCase(name)})}
              />
          : name
        )}
      </h1>
      <p className="collection-url">{getLink(owner, url)}</p>
    </React.Fragment>
  );
};
EditCollectionNameAndUrl.propTypes = {
  owner: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default EditCollectionNameAndUrl;