import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import mdFactory from 'markdown-it';

const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true,
});

class EditableDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      description: this.props.initialDescription,
    };
    
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onChange(evt) {
    const description = evt.currentTarget.value;
    this.setState({ description });
    this.props.updateDescription(description.trim());
  }
  
  onFocus() {
    this.setState({focused: true});
  }
  
  onBlur() {
    this.setState({focused: false});
  }
  
  render() {
    const {placeholder} = this.props;
    const {description} = this.state;
    return (this.state.focused
      ?
      <TextArea
        className="description content-editable"
        value={description}
        onChange={this.onChange}
        onFocus={this.onFocus} onBlur={this.onBlur}
        placeholder={placeholder}
        spellCheck={false}
        autoFocus
      />
      :
      <p
        className="description content-editable"
        role="textbox" tabIndex={0}
        onFocus={this.onFocus} onBlur={this.onBlur}
        placeholder={placeholder}
        dangerouslySetInnerHTML={{__html: md.render(description)}}
      ></p>
    );
  }
}
EditableDescription.propTypes = {
  initialDescription: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
};

const StaticDescription = ({description}) => (
  description ? <p className="description read-only" dangerouslySetInnerHTML={{__html: md.render(description)}}></p> : null
);
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export { EditableDescription, StaticDescription };