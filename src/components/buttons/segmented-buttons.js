import React from 'react';
import PropTypes from 'prop-types';
import styles from './segmented-buttons.styl';
import Button from './button';

const SegmentedButtons = ({ value, buttons, onClick }) => (
  <div className={styles.segmentedButtons}>
    {buttons.map((button) => (
      <Button 
        key={button.name} 
        size="small" 
        type="tertiary" 
        active={button.name === value} 
        onClick={() => onClick(button.name)}
      >
        {button.contents}
      </Button>
    ))}
  </div>
);

SegmentedButtons.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      /** name: the filter name, passed back to onClick */
      name: PropTypes.string.isRequired,
      contents: PropTypes.node.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SegmentedButtons;
