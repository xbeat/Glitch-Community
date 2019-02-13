import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const TextField = ({opaque, ...props}) => {
  const className = cx({
    'text-input': true,
    'opaque': opaque,
    'underline': !opaque,
  });
  return (
    <input className={className} {...props}/>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.function,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default TextField;