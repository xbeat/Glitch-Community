import React from 'react';
import PropTypes from 'prop-types';

import {getLink} from '../../models/collection';

import {OptimisticValue} from '../includes/field-helpers.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

export const EditCollectionName = ({name, url, update, owner, ...props}) => (
  <OptimisticValue value={name} update={update} resetOnError={false}>
    {valueProps => <React.Fragment>
      <h1 className="collection-name">
        <PureEditableField {...props} {...valueProps}/>
      </h1>
      <p>{getLink(</p>
    </React.Fragment>}
  </OptimisticValue>
);

EditCollectionName.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  owner: PropTypes.string.isRequired,
};  

export default EditCollectionName;