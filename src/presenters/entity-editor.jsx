import React from 'react';
import PropTypes from 'prop-types';

export default class EntityEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.state.initial;
  }
  
  updateFields(changes) {
    return this.props.api.patch(`${this.props.type}/${this.state.id}`, changes).then(() => {
      this.setState(changes);
    });
  }
  
  updateField(field, value) {
    const change = {[field]: value};
    return this.updateFields(change);
  }
  
  addItem(field, Model, id) {
    return this.props.api.post(`${this.props.type}/${this.state.id}/${field}/${id}`).then(() => {
      const item = Model({id}).asProps(); //weewoo weewoo this relies on the model having been loaded elsewhere
      this.setState(prev => ({[field]: [...prev[field], item]}));
    });
  }
  
  removeItem(field, id) {
    return this.props.api.delete(`teams/${this.state.id}/${field}/${id}`).then(() => {
      this.setState(prev => ({[field]: prev[field].filter(item => item.id !== id)}));
    });
  }
  
  render() {
    return this.children({entity: this.state});
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