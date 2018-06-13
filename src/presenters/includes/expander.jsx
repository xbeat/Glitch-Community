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
      maxHeight: this.ref.current.scrollHeight,
    });
    setTimeout(() => {
      this.setState({maxHeight: undefined});
    }, 500); // <- the css transition should match this
  }
  
  render() {
    const {expanding, maxHeight} = this.state;
    return (
      <div className="expander" style={{maxHeight}} ref={this.ref}>
        {this.props.children}
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