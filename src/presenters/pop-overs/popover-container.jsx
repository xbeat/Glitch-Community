import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

class UnmonitoredComponent extends React.Component {
  handleClickOutside(event) {
    console.log(event);
    // On keyup events, only hide the popup if it was the Escape key
    if (event.type === 'keyup' && !['Escape', 'Esc'].includes(event.key)) {
      return;
    }
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

const PopoverContainer = ({ children, outer, startOpen }) => {
  const [visible, setVisible] = React.useState(startOpen);
  const togglePopover = () => setVisible(!visible);

  const props = { visible, setVisible, togglePopover };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error(
      'PopoverContainer does not support Fragment as the top level item. Please use a different element.',
    );
  }
  const before = outer ? outer(props) : null;

  return (
    <>
      {before}
      <MonitoredComponent
        //disableOnClickOutside={!visible}
        eventTypes={['mousedown', 'touchstart', 'keyup']}
        onClickOutside={() => setVisible(false)}
      >
        {inner}
      </MonitoredComponent>
    </>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  outer: null,
  startOpen: false,
};

export default PopoverContainer;
