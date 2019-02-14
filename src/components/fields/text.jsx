import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

import Error from './error';

const TextField = ({className, error, opaque, postfix, prefix, search, ...props}) => {
  const wrapperClassName = cx(className, {
    wrap: true,
    underline: !opaque,
    opaque: opaque,
  });
  const inputClassName=cx({
    input: true,
    part: true,
    search: search,
  });
  return (
    <Error error={error}>
      <label className={wrapperClassName}>
        {!!prefix && <div className={cx('part')}>{prefix}</div>}
        <input className={inputClassName} {...props}/>
        {!!postfix && <div className={cx('part')}>{postfix}</div>}
      </label>
    </Error>
  );
};

TextField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  search: PropTypes.bool,
  value: PropTypes.string,
};

export default TextField;