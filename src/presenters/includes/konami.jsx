import React from 'react';
import PropTypes from 'prop-types';
import ReactKonami from 'react-konami';

// Usage:
// <Konami>
//   Inner part will render once konami code is entered.
// </Konami>

export default class Konami extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  render() {
    return (
      <>
        <ReactKonami easterEgg={() => this.setState({ active: true })} />
        {!!this.state.active && this.props.children}
      </>
    );
  }
}

Konami.propTypes = {
  children: PropTypes.node.isRequired,
};
