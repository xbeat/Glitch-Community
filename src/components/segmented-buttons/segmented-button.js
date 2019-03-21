import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './segmented-button.styl';
import Button from '../../components/buttons/button';

const cx = classNames.bind(styles);

const SegmentedButtons = ({ buttons, onClick }) => {
  const className = cx({
    'segmented-buttons': true,
  });

  return (
    <div className={className}>
      {buttons.map( (button) => (
        <Button
          size="small"
          type="tertiary"
          active={button.active}
          onClick={() => onClick}
          >
          {button.contents}
        </Button>
        ))}
    </div>
  );
};


SegmentedButtons.propTypes = {
  buttons: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  type: null,
  size: null,
  hover: false,
  active: false,
};

export default Button;
