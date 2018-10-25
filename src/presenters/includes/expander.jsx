import React from 'react';
import PropTypes from 'prop-types';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      scrollHeight: Infinity,
      maxHeight: props.height,
    };
    this.ref = React.createRef();
  }
  
  componentDidMount() {
    this.setState({scrollHeight: this.ref.current.scrollHeight});
  }
  
  onLoad(event) {
    console.log(event);
    if (this.ref.current.scrollHeight !== this.state.scrollHeight) {
      this.setState({scrollHeight: this.ref.current.scrollHeight});
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
    const {expanded, scrollHeight, maxHeight} = this.state;
    return (
      <div
        className="expander" style={{maxHeight}}
        onTransitionEnd={(expanded && !!maxHeight) ? this.onExpandEnd.bind(this) : null}
        onLoadCapture={this.onLoad.bind(this)}
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