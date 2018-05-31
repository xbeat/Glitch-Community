import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: this.props.value,
      inputId: null,
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.props.update, 1000);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onChange(evt) {
    const value = evt.currentTarget.value.trim();
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
  
  componentDidMount() {
    this.setState({inputId: uniqueId()});
  }
  
  render() {
    return (
      <div className="content-editable-container">
        { !!this.props.mask && <label htmlFor={this.state.inputId} className="content-editable-mask">{this.props.mask}</label> }
        <input
          id={this.state.inputId}
          className="content-editable"
          value={this.state.value}
          onChange={this.onChange}
          autoComplete="off"
          spellCheck={false}
          placeholder={this.props.placeholder}
          />
        </div>
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
