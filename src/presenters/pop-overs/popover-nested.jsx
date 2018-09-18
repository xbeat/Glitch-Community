import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext();

export class NestedPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: false, // true for alt page, false for main
    };
    this.toggle = this.toggle.bind(this);
  }
  
  toggle() {
    this.setState(({page}) => ({page: !page}));
  }
  
  render() {
    const {children, menu} = this.props;
    return (
      <Provider value={this.toggle}>
        {this.state.page ? menu(this.toggle) : children(this.toggle)}
      </Provider>
    );
  }
}

NestedPopover.propTypes = {
  children: PropTypes.func.isRequired,
  menu: PropTypes.func.isRequired,
};

export default NestedPopover;

export {Consumer as NestedPopoverConsumer};

export const NestedPopoverTitle = ({children}) => (
  <Consumer>
    {toggle => (
      <button className="button-unstyled clickable-label" onClick={toggle} aria-label="go back">
        <section className="pop-over-info team-user-remove-header">
          <div className="back icon"><div className="left-arrow icon" /></div>
          &nbsp;
          <div className="pop-title">{children}</div>
        </section>
      </button>
    )}
  </Consumer>
);
NestedPopoverTitle.propTypes = {
  children: PropTypes.node.isRequired,
};