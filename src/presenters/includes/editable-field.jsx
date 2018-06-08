import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      error: "",
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.update.bind(this), 500);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  
  update(value){
    this.props.update(value).then(this.handleUpdate);
  }
  
  handleUpdate({success, data, message}) {
    if(success) {
      this.setState({error: ""});
      return;
    }
    
    // The update failed; we can ignore this if our state has already moved on
    if(data !== this.state.value.trim()){
      return;
    }
    
    // Ah, we haven't moved on, and we know the last edit failed.
    // Ok, display an error.
    this.setState({error: message||""});
  }
  
  onChange(evt) {
    let value = evt.currentTarget.value;
    this.setState((lastState) => {
      if(lastState.value.trim() !== value.trim()) {
        this.update(value.trim());
      }
      return {value};
    });
  }  
  render() {
    const classes = ["content-editable", this.state.error ? "error" : ""].join(" ");
    const inputProps = {
      className: classes,
      value:this.state.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      id: uniqueId("editable-field-"),
    };
    
    const maybeErrorIcon = !!this.state.error && (
      <span className="editable-field-error-icon" role="img" aria-label="Warning">🚒</span>
    );
    
    const maybeErrorMessage = !!this.state.error && (
      <div className="editable-field-error-message">
        {this.state.error}
      </div>
    );
    
    const maybePrefix = !!this.props.prefix && (
      <span className={"content-editable-prefix " + classes}>{this.props.prefix}</span>
    );
    
    return (
      <label htmlFor={inputProps.id}>
        <div className="editable-field-flex">
          {maybePrefix}
          <input {...inputProps}/>
          {maybeErrorIcon}
        </div>
        {maybeErrorMessage}
      </label>
    );
  }
}
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.string,
};
