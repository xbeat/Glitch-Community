import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      maxHeight: props.height,
    };
    this.ref = React.createRef();
  }
  
  componentDidMount() {
    // If the area is only slightly too big don't bother cutting it off
    const maxHeight = this.props.height + 60;
    if (this.ref.current.scrollHeight <= maxHeight) {
      this.setState({
        expanded: true,
        maxHeight: undefined,
      });
    }
  }
  
  expand() {
    this.setState({
      expanded: true,
      maxHeight: this.ref.current.scrollHeight,
    });
    setTimeout(() => {
      this.setState({maxHeight: undefined});
    }, 600); // <- make this very slightly larger than the css transition
  }
  
  render() {
    const {expanded, maxHeight} = this.state;
    return (
      <div className="expander" style={{maxHeight}} ref={this.ref}>
        {this.props.children}
        {!!maxHeight && (
          <div className="expander-gradient"></div>
        )}
        {!expanded && (
          <React.Fragment>
            <div className="expander-mask" onClick={this.expand.bind(this)} role="presentation"></div>
            <button
              onClick={this.expand.bind(this)}
              className="expander-button button button-small button-tertiary"
            >
              Show More
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

Expander.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
};