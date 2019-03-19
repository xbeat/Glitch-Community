import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

import Markdown from '../../components/text/markdown';
import { OptimisticValue } from './field-helpers';

class EditableDescriptionImpl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus(event) {
    if (event.currentTarget === event.target) {
      this.setState({ focused: true });
    }
  }

  onBlur() {
    this.setState({ focused: false });
    this.props.onBlur(event.target.value);
  }

  render() {
    const { description, placeholder, maxLength } = this.props;
    return this.state.focused ? (
      <TextArea
        className="description content-editable"
        value={description}
        onChange={(evt) => this.props.update(evt.target.value)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        placeholder={placeholder}
        spellCheck={false}
        maxLength={maxLength}
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      />
    ) : (
      <p
        className="description content-editable"
        placeholder={placeholder}
        aria-label={placeholder}
        role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
        tabIndex={0}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {description && <Markdown>{description}</Markdown>}
      </p>
    );
  }
}

EditableDescriptionImpl.propTypes = {
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
};

EditableDescriptionImpl.defaultProps = {
  placeholder: '',
  onBlur: null,
  maxLength: 524288, // this is the built in default
};

const EditableDescription = ({
  description, placeholder, update, onBlur, maxLength,
}) => (
  <OptimisticValue value={description} update={update}>
    {({ optimisticValue, optimisticUpdate }) => (
      <EditableDescriptionImpl
        description={optimisticValue}
        update={optimisticUpdate}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    )}
  </OptimisticValue>
);
EditableDescription.propTypes = {
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
};

EditableDescription.defaultProps = {
  placeholder: '',
  onBlur: null,
  maxLength: null,
};

export const StaticDescription = ({ description }) =>
  description ? (
    <p className="description read-only">
      <Markdown>{description}</Markdown>
    </p>
  ) : null;
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export const AuthDescription = ({ authorized, description, placeholder, update, onBlur, maxLength }) =>
  authorized ? (
    <EditableDescription description={description} update={update} onBlur={onBlur} placeholder={placeholder} maxLength={maxLength} />
  ) : (
    <StaticDescription description={description} />
  );

AuthDescription.propTypes = {
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func,
  maxLength: PropTypes.number,
};

AuthDescription.defaultProps = {
  placeholder: '',
  maxLength: null,
  update: null,
};
