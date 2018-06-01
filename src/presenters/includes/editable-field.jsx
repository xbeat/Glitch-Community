import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      error: "",
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce((value) => {
      this.props.update(value).then(this.handleUpdate)
    }, 1000);
    this.handleUpdate = this.handleUpdate.bind(this);
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

    // We're pretending to be a single-line input,
    // so do not permit line breaks
    // https://stackoverflow.com/a/10805198/1388
    value = value.replace(/(\r\n\t|\n|\r\t)/gm,"");
    
    const mask = this.props.mask;
    if(mask) {
      // The mask character is not permitted to occur in the string:
      value = value.split(mask).join("");
    }
    
    this.setState((lastState) => {
      if(lastState.value.trim() !== value.trim()) {
        this.update(value.trim());
      }
      return {value};
    });
  }  
  render() {
    // We're using a textarea here instead of an <input/> because it's difficult
    // to get browsers to disable autocomplete for inputs.
    // ...So this is a textarea that
    return (
      <React.Fragment>
        <textarea
          style={{
            resize: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          rows="1"
          className={["content-editable", this.state.error ? "error" : "error"].join(" ")}
          value={this.props.mask + this.state.value}
          onChange={this.onChange}
          spellCheck={false}
          placeholder={this.props.placeholder}
        />
        {!!this.state.error && (
          <span className="error-message">
            <span role="img" aria-label="Warning">⚠️</span>
            {this.state.error}
          </span>
        )}
      </React.Fragment>
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
