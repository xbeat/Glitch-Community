import React from 'react';
import PropTypes from 'prop-types';

// react tells me that nested <a> tags is bad and I should not do it
// so instead we will put the <a> tags in a special onclick <div>
// which will act like a li

const handler = (evt) => {
  if (evt.target.closest('a[href], button, input')) return;
  if (evt.target.closest('[data-href]') !== evt.currentTarget) return;
  window.location.assign(evt.currentTarget.dataset.href);
  evt.preventDefault();
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