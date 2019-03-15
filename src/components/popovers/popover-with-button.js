import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from '../../presenters/pop-overs/popover-container';
import Button from '../buttons/button';

import styles from './popover-with-button.styl';

const PopoverWithButtonComp = (props) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => {
      let childrenToShow = props.children;
      if (props.passToggleToPop) {
        childrenToShow = React.Children.map(props.children, (child) => React.cloneElement(child, { togglePopover }));
      }
      return (
        <div className={styles.buttonWrap}>
          <Button size="small" onClick={togglePopover}>
            {props.buttonText}
          </Button>
          {visible && childrenToShow}
        </div>
      );
    }}
  </PopoverContainer>
);

PopoverWithButtonComp.propTypes = {
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired, // should be the stuff to show in a popover
  passToggleToPop: PropTypes.bool,
};

PopoverWithButtonComp.defaultProps = {
  passToggleToPop: false,
};

export default PopoverWithButtonComp;
