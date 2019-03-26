import React from 'react';
import PropTypes from 'prop-types';
import styles from './segmented-buttons.styl';
import Button from './button';

const SegmentedButtons = ({ value, buttons, onClick }) => (
  <div className={styles.segmentedButtons}>
    {buttons.map((button) => (
      <Button key={button.id} size="small" type="tertiary" active={button.id === value} onClick={() => onClick(button.id)}>
        {button.contents}
      </Button>
    ))}
  </div>
);

SegmentedButtons.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      contents: PropTypes.node.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SegmentedButtons;
