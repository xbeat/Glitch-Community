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
  }
  
  onExpandEnd(evt) {
    if (evt.propertyName === 'max-height') {
      this.setState({maxHeight: undefined});
    }
  }
  
  render() {
    const {expanded, maxHeight} = this.state;
    return (
      <div
        className="expander" style={{maxHeight}}
        onTransitionEnd={(expanded && !!maxHeight) ? this.onExpandEnd.bind(this) : null}
        ref={this.ref}
      >
        {this.props.children}
        {!!maxHeight && (
          <div className="expander-mask">
            {!expanded && (
              <button
                onClick={this.expand.bind(this)}
                className="expander-button button button-tertiary button-link"
              >
                Show More
              </button>
            )}
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