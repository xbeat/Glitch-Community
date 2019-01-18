/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

export class Embed extends React.Component {
  render() {
    return <div className="glitch-embed-wrap">
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