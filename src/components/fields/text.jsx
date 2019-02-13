import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const TextField = ({opaque, search, ...props}) => {
  const className = cx({
    'text-input': true,
    'search': search,
    'opaque': opaque,
    'underline': !opaque,
  });
  return (
    <input className={className} {...props}/>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.function,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  search: PropTypes.bool,
  value: PropTypes.string,
};

export default TextField;