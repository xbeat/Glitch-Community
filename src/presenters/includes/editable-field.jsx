import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

const PrefixedInput = ({prefix, inputId, children}) => {
  if(!prefix) {
    return children;
  }

  return (
    <label htmlFor={inputId} className="content-editable-prefix-container">
      <span className="content-editable content-editable-prefix">{prefix}</span>
      {children}
    </label>
  );
};
PrefixedInput.propTypes = {
  prefix: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

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
    const inputProps = {
      className: ["content-editable", this.state.error ? "error" : ""].join(" "),
      value:this.state.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      id: uniqueId("editable-field-"),
    };
    
    const 
    
    return (
      <label htmlFor={inputProps.id} className="editable-field-container">
        <div class="flex">
          <input {...inputProps}/>
          {!!this.state.error && (
            <React.Fragment>
              <span className="editable-field-error-icon" role="img" aria-label="Warning">🚒</span>
              <div className="editable-field-error-message">
                {this.state.error}
              </div>
            </React.Fragment>
          )}
        </PrefixedInput>
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

    <label htmlFor={inputId} className="content-editable-prefix-container">
      <span className="content-editable content-editable-prefix">{prefix}</span>
      {children}
    </label>