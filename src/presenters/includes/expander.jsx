import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      scrollHeight: Infinity,
    };
    this.ref = React.createRef();
  }
  
  componentDidMount() {
    this.updateHeight();
    this.ref.current.addEventListener('load', this.updateHeight.bind(this), {capture: true});
  }
  
  componentDidUpdate() {
    this.updateHeight();
  }
  
  updateHeight() {
    if (this.ref.current.scrollHeight !== this.state.scrollHeight) {
      this.setState({scrollHeight: this.ref.current.scrollHeight});
    }
  }
  
  expand() {
    this.updateHeight();
    this.setState({expanded: true});
  }
  
  onExpandEnd(evt) {
    if (evt.propertyName === 'max-height') {
      this.setState({maxHeight: undefined});
    }
  }
  
  render() {
    const {expanded, scrollHeight, maxHeight} = this.state;
    return (
      <div
        className="expander" style={{maxHeight}}
        onTransitionEnd={(expanded && !!maxHeight) ? this.onExpandEnd.bind(this) : null}
        ref={this.ref}
      >
        {this.props.children}
        {!!maxHeight && scrollHeight > maxHeight && (
          <div className="expander-mask">
            {!expanded && scrollHeight > maxHeight && (
              <button
                onClick={this.expand.bind(this)}
                className="expander-button button-small button-tertiary"
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