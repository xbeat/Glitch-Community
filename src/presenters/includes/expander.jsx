import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanding: false,
      maxHeight: props.height,
    };
    this.ref = React.createRef();
  }
  
  expand() {
    this.setState({
      expanding: true,
      maxHeight: 1000,
    });
  }
  
  render() {
    const {expanding, maxHeight} = this.state;
    return (
      <div className="expander" style={{maxHeight}}>
        <div ref={this.ref}>{this.props.children}</div>
        {!expanding && (
          <div className="expander-button">
            <button
              onClick={this.expand.bind(this)}
              className="button button-small button-tertiary"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    );
  }
}

Expander.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
};