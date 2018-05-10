import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import {isFragment} from 'react-is';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/
const Wrapper = ({children}) => (children);

Wrapper.propTypes = {
  children: PropTypes.element.isRequired
};

export default class PopoverContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.mounted = false;
    
    // We need to set up and instantiate an onClickOutside wrapper
    // It's important to instantiate it once and pass though its children,
    // otherwise the diff algorithm won't be able to figureo out our hijinks.
    // https://github.com/Pomax/react-onclickoutside

    // We do extra work with disableOnClickOutside and handleClickOutside
    // to prevent event bindings from being created until the popover is opened.
    const clickOutsideConfig = {
      handleClickOutside: () => this.handleClickOutside,
      excludeScrollbar: true,
    };
    this.MonitoredComponent = onClickOutside(Wrapper, clickOutsideConfig);
  }
  
  componentDidMount() {
    this.mounted = true;
  }
  
  componentWillUnmount() {
    this.mounted = false;
  }
  
  handleClickOutside(event) {
    if(!this.mounted) {
      return;
    }
    
    // On keyup events, only hide the popup if it was the 'esc' key (27).
    console.log("click outside!", event);
    if(event.type === "keyup" && event.key !== "Escape") {
      return;
    }
    
    this.setState({visible: false});
  }
  
  toggle() {
    this.setState((prevState) => {
      return {visible: !prevState.visible};
    });
  }

  render() {
    const inner = this.props.children({visible: this.state.visible, togglePopover: this.toggle});
    if(isFragment(inner)) {
      console.error("PopoverContainer does not support React.Fragment as the top level item. Please use a different element.");
    }
    return (
      <this.MonitoredComponent disableOnClickOutside={!this.state.visible} eventTypes={["mousedown", "touchstart", "keyup"]}>
        {inner}
      </this.MonitoredComponent>
    );
  }
}

PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
};
