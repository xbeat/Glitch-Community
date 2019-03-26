import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactKonami from 'react-konami';

// Usage:
// <Konami>
//   Inner part will render once konami code is entered.
// </Konami>

export default function Konami ({ children }) {
  const [active, setActive] = useState(false)
    return (
      <>
        <ReactKonami easterEgg={() => this.setState({ active: true })} />
        {!!active && children}
      </>
    );
}

Konami.propTypes = {
  children: PropTypes.node.isRequired,
};
