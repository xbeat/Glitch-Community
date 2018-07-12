import React from 'react';
import PropTypes from 'prop-types';

import {matches, reject} from 'lodash';

export default class EntityEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.initial;
  }
  
  localAddItem(field, model) {
    this.setState(prev => ({[field]: [...prev[field], model]}));
  }
  
  localRemoveItem(field, model) {
    this.setState(prev => ({[field]: reject(prev[field], matches(model))}));
  }
  
  updateFields(changes) {
    return this.props.api.patch(`${this.props.type}/${this.state.id}`, changes).then(({data}) => {
      this.setState(data);
    });
  }
  
  addItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.post(`${this.props.type}/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.localAddItem(localField, localModel);
    });
  }
  
  removeItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.delete(`${this.props.type}/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.localRemoveItem(localField, localModel);
    });
  }
  
  render() {
    return this.props.children({
      entity: this.state,
      updateFields: this.updateFields.bind(this),
      addItem: this.addItem.bind(this),
      removeItem: this.removeItem.bind(this),
      localAddItem: this.localAddItem.bind(this),
      localRemoveItem: this.localRemoveItem.bind(this),
    });
  }
}

EntityEditor.propTypes = {
  api: PropTypes.any.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};