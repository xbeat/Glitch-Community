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
    this.state = { description: this.props.initialDescription };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onChange(evt) {
    const description = evt.currentTarget.value;
    this.setState({ description });
    this.props.updateDescription(description);
  }
  
  onBlur(evt) {
    this.props.applyDescription(evt);
  }
  
  render() {
    return (
      <TextArea
        className="description content-editable"
        value={this.state.description}
        onChange={this.onChange}
        onBlur={this.onBlur}
        placeholder={this.props.description}
        spellCheck="false"
      />
    );
  }
}
EditableDescription.propTypes = {
  initialDescription: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  applyDescription: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
};

const StaticDescription = ({description}) => (
  description ? <p className="description read-only" dangerouslySetInnerHTML={{__html: md.render(description)}}></p> : null
);
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export { EditableDescription, StaticDescription };