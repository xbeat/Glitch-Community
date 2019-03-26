/* global APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

// Babel does not transpile URLSearchParams, so using this as a compatibility check for showing embeds now.
// TODO(sheridan) make this more robust in future
const browserSatisfiesRequirements = (() => {
  try {
    if (URLSearchParams.name !== 'URLSearchParams') {
      throw new Error('URLSearchParams is minified, so it must have been polyfilled');
    }
    return true;
  } catch (error) {
    console.log(
      "Sorry, you don't have the necessary JavaScript features to run Glitch code editors. Try applying your latest system updates, or try again with a different web browser.",
      error,
    );
  }
  return false;
})();

const Embed = ({ domain }) => (
  <div className="glitch-embed-wrap">
    {browserSatisfiesRequirements ? (
      // Embed iframe for app
      <iframe
        title="embed"
        src={`${APP_URL}/embed/#!/embed/${domain}?path=README.md&previewSize=100`}
        alt={`${domain} on Glitch`}
        allow="geolocation; microphone; camera; midi; encrypted-media"
        height="100%"
        width="100%"
        border="0"
        allowvr="yes"
      />
    ) : (
      // Error message if JS not supported
      // TODO(sheridan): Refactor this once we have a true error component
      <div className="error-container">
        <img className="error-image" src={telescopeImageUrl} alt="" width="50%" height="50%" />
        <div className="error-msg">
          <h2>The web browser you're using is missing some important Javascript features</h2>
          <p>To use this app, please try applying your latest system updates, or try again with a different web browser.</p>
        </div>
      </div>
    )}
  </div>
);

Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default Embed;
