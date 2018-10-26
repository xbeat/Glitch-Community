import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanding: false,
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
    const scrollHeight = this.ref.current.scrollHeight
    if (scrollHeight !== this.state.scrollHeight) {
      this.setState({scrollHeight});
    }
  }
  
  expand() {
    this.updateHeight();
    this.setState({expanding: true});
  }
  
  onExpandEnd(evt) {
    if (evt.propertyName === 'max-height') {
      this.setState({expanded: true});
    }
  }
  
  render() {
    const {expanding, expanded, scrollHeight} = this.state;
    const maxHeight = expanding ? scrollHeight : this.props.height;
    return (
      <div
        className="expander" style={!expanded ? {maxHeight} : null}
        onTransitionEnd={(expanding && !expanded) ? this.onExpandEnd.bind(this) : null}
        ref={this.ref}
      >
        {this.props.children}
        {!expanded && scrollHeight > maxHeight && (
          <div className="expander-mask">
            {!expanding && scrollHeight > maxHeight && (
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