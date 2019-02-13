import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const TextField = ({opaque, postfix, prefix, ...props}) => {
  const className = cx({
    'text-input': true,
    'opaque': opaque,
    'underline': !opaque,
  });
  return (
    <input className={className}/>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.function,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  value: PropTypes.string,
};

export default TextField;