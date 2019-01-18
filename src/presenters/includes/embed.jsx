/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

export const Loader = () => (
  <div className="loader">
    <div className="moon"></div>
    <div className="earth"></div>
    <div className="asteroid"></div>    
    <div className="asteroid-dust"></div>    
  </div>    
);

export class Embed extends React.Component {
  render() {
    <div className="glitch-embed-wrap">
      <iframe title="embed"
        src={`${APP_URL}/embed/#!/embed/${this.props.domain}?path=README.md&previewSize=100`}
        allow="geolocation; microphone; camera; midi; encrypted-media"
      ></iframe>
    </div>
  }
}

Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default Embed;