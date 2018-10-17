import React from 'react';
import PropTypes from 'prop-types';
import {kebabCase} from 'lodash';

import {getLink} from '../../models/collection';

import {OptimisticValue} from '../includes/field-helpers.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

export const EditCollectionName = ({name, url, update, owner, ...props}) => (
  <OptimisticValue value={{name, url}} update={update} resetOnError={false}>
    {({update, value, ...valueProps}) => <React.Fragment>
      <h1 className="collection-name">
        <PureEditableField {...props} update={name => update({name, url: kebabCase(name)})} value={value.name} {...valueProps}/>
      </h1>
      <p>{getLink(owner, value.url)}</p>
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