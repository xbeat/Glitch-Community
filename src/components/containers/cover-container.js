/* globals CDN_URL */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './cover-container.styl';


const cx = classNames.bind(styles);

const cacheBuster = Math.floor(Math.random() * 1000);

export function getProfileStyle(entityType, { id, hasCoverImage, coverColor, cache = cacheBuster, size = 'large', _cacheCover }) {
  console.log("inside getProfileStyle", { _cacheCover, cache } )
  const customImage = `${CDN_URL}/${entityType}-cover/${id}/${size}?${cache}`;
  const defaultImage = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

// Cover Container
const CoverContainer = ({ buttons, children, className, entity, entityType, ...props }) => (
  <div style={getProfileStyle(entityType, entity)} className={`${cx({ 'cover-container': true })} ${className}`} {...props}>
    {children}
    {buttons}
  </div>
);

CoverContainer.propTypes = {
  children: PropTypes.node.isRequired,
  entity: PropTypes.object.isRequired,
  // currently used for 'user' and 'team'
  entityType: PropTypes.string.isRequired,
  // There is no need to use these props,
  // this is just needed to support old instances of CoverContainer without having refactor all-the-things
  buttons: PropTypes.node, // please use 'children'
  className: PropTypes.string, // please avoid styling components where possible
};

CoverContainer.defaultProps = {
  className: '',
  buttons: null,
};

export default CoverContainer;
