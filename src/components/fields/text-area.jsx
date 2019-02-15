import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import TextAreaAutosize from 'react-textarea-autosize';
import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';

import styles from './text-area.styl';
const cx = classNames.bind(styles);

const TextArea = ({className, error, onChange, ...props}) => {
  const outerClassName = cx('input-wrap', className);
  const borderClassName = cx('input-border');
  const inputClassName = cx('input');
  return (
    <label className={outerClassName}>
      <div className={borderClassName}>
        <TextAreaAutosize className={inputClassName} onChange={evt => onChange(evt.target.value)} {...props}/>
        {!!error && <InputErrorIcon className={cx('error-icon')} />}
      </div>
      {!!error && <InputErrorMessage error={error}/>}
    </label>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default TextArea;