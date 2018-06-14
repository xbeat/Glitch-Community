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
    }, 500); // <- the css transition should match this
  }
  
  render() {
    const {expanded, maxHeight} = this.state;
    return (
      <div className="expander" style={{maxHeight}} ref={this.ref}>
        {this.props.children}
        {!expanded ? (
          <div className="expander-mask">
            <div className="expander-gradient">
              <button
                onClick={this.expand.bind(this)}
                className="button button-small button-tertiary"
              >
                Show More
              </button>
            </div>
          </div>
        ) : (!!maxHeight && 
          <div className="expander-gradient">
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