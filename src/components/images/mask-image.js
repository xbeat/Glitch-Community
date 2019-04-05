import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sample } from 'lodash';
import styles from './mask-image.styl';

const maskClasses = ['mask1', 'mask2', 'mask3', 'mask4'];

const MaskImage = ({ maskClass: controlledMaskClass, ...props }) => {
  const randomMaskClass = useRef(sample(maskClasses));
  const maskClass = controlledMaskClass || randomMaskClass.current;

  return <img {...props} alt="" className={classnames(styles.mask, styles[maskClass])} />;
};

MaskImage.propTypes = {
  maskClass: PropTypes.oneOf(maskClasses),
}

MaskImage.defaultProps = {

}


export default MaskImage;
