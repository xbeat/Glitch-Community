import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }
  
  render() {
    const {collapsed} = this.state;
    const style = collapsed ? {maxHeight: this.props.height} : null;
    return (
      <div className="expander" style={style}>
        {this.props.children}
        {collapsed && (
          <div className="expander-button">
            <button
              onClick={() => this.setState({collapsed: false})}
              className="button button-small button-tertiary"
            >
              Show All
            </button>
          </div>
        )}}
      </div>
    );
  }
}

Expander.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
};