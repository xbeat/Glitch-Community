import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: this.props.value,
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.props.update, 1000);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.unmask = this.unmask.bind(this);
  }
  
  unmask(value) {
    const mask = this.props.mask;
    const trimmed = value.trim();
    if(value.startsWith(mask)){
      return value.substring(mask.length);
    }
    return trimmed;
  }
  
  onChange(evt) {
    const value = this.unmask(evt.currentTarget.value);
    this.setState({ value });
    this.update(value);
  }
  
  onFocus(evt) {
    if (evt.currentTarget === evt.target) {
      this.setState({focused: true});
    }
  }
  
  onBlur() {
    this.setState({focused: false});
  }
  
  render() {
    const value = this.props.mask + this.state.value;
    return (
      <input
        className="content-editable"
        value={value}
        onChange={this.onChange}
        autoComplete="off"
        spellCheck={false}
        placeholder={this.props.placeholder}
        />
    );
  }
}
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  mask: PropTypes.string,
};
EditableField.defaultProps = {
  mask: "",
};
