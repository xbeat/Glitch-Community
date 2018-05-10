import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/
export default class PopoverContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.key = Date.now();
    console.log("constructed; key is", this.key);
  }
  
  handleClickOutside(event) {
    // On keyup events, only hide the popup if it was the 'esc' key (27).
    if(event.type === "keyup" && event.keyCode !== 27) {
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
    // Invoke the children as a react component, passing them the toggle visibility controls.
    // The <span> is needed because onClickOutside doesn't support React.Fragment
    const Children = this.props.children;
    const WrappedChildren = () => (
      <span key={this.key+"wrapped"}>
        <Children key={this.key+"kiddos"} togglePopover={this.toggle} visible={this.state.visible}/>
      </span>
    );
    
    // The rest of this logic sets up and configures the onClickOutside wrapper
    // https://github.com/Pomax/react-onclickoutside

    // We do extra work with disableOnClickOutside and handleClickOutside
    // to prevent event bindings from being created until the popover is opened.
    const clickOutsideConfig = {
      handleClickOutside: () => this.handleClickOutside,
      excludeScrollbar: true,
    };
    const MonitoredComponent = onClickOutside(WrappedChildren, clickOutsideConfig);
    
    return (
      <MonitoredComponent key={this.key+"monitored"} disableOnClickOutside={!this.state.visible}  eventTypes={["mousedown", "touchstart", "keyup"]}/>
    );
  }
}

PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
};

