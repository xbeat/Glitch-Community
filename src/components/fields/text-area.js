import React from 'react';
import PropTypes from 'prop-types';

import TextAreaAutosize from 'react-textarea-autosize';
import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';
import useUniqueId from './use-unique-id';

import styles from './text-area.styl';

const TextArea = ({ autoFocus, disabled, error, name, onChange, placeholder, value }) => {
  const uniqueId = useUniqueId();
  return (
    <label className={styles.inputWrap} htmlFor={uniqueId}>
      <div className={styles.inputBorder}>
        <TextAreaAutosize
          autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          className={styles.input}
          disabled={disabled}
          id={uniqueId}
          name={name}
          onChange={(evt) => onChange(evt.target.value)}
          placeholder={placeholder}
          value={value}
        />
        {!!error && <InputErrorIcon className={styles.errorIcon} />}
      </div>
      {!!error && <InputErrorMessage>{error}</InputErrorMessage>}
    </label>
  );
};

TextArea.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

TextArea.defaultProps = {
  autoFocus: false,
  disabled: false,
  error: null,
  name: undefined,
  placeholder: undefined,
};

export default TextArea;
