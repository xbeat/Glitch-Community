import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      inputId: null,
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.props.update, 1000);
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
    
    this.setState({ value });
    this.update(value.trim());
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
        <textarea
          style={{resize: "none"}}
          rows="1"
          id={this.state.inputId}
          className="content-editable"
          value={this.props.mask + this.state.value}
          onChange={this.onChange}
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
