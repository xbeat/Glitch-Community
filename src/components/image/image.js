import React from 'react';
import PropTypes from 'prop-types';

/**
 * 🖼️ Image Component
 *
 * @param {string} src - Image source
 * @param {array} srcSet - Responsive image source set
 * @param {alt} alt - Alternative text
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} role - Image role (typically presentation)
 * @param {object | string} className - extra classes to be passed down to the component
 * @param {boolean} backgroundImage - If we want the image to be rendered as a background image
 */

const Image = ({ alt, backgroundImage, backgroundRatio, className, height, role, src, srcSet, sizes, width }) => (
  <>
    {!backgroundImage ? (
      <img
        alt={alt}
        className={className || undefined}
        height={height || undefined}
        role={role}
        sizes={sizes}
        src={src}
        srcSet={srcSet.length > 0 ? srcSet : undefined}
        width={width || undefined}
      />
    ) : (
      <div
        className={className || undefined}
        role={role}
        style={{
          backgroundImage: `url(${src})`,
          paddingBottom: `${backgroundRatio}%`,
          backgroundRepeat: 'no-repeat',
          width,
          height,
        }}
      />
    )}
  </>
);

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  backgroundImage: PropTypes.bool,
  backgroundRatio: PropTypes.number,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  role: PropTypes.string,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.array,
  sizes: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Image.defaultProps = {
  backgroundImage: false,
  backgroundRatio: 65,
  className: '',
  height: '100%',
  role: 'presentation',
  srcSet: [],
  sizes: '',
  width: '100%',
};

export default Image;
