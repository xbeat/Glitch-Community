import React from 'react';
import PropTypes from 'prop-types';


const PseudoExpander = ({ expanded, actions, children }) => (
  <div>
    {children}
    <div>
      {actions}
    </div>
  </div>
)

PseudoExpander.propTypes = {
  expanded: PropTypes.bool.isRequired,
  actions: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
}