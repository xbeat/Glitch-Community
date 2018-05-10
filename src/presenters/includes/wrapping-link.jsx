import React from 'react';
import PropTypes from 'prop-types';

const handler = (evt) => {
  console.log(evt);
};

const WrappingLink = ({href, children, className, style}) => (
  <div data-href={href} onClick={handler} className={className} style={style}>
    {children}
  </div>
);

WrappingLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default WrappingLink;