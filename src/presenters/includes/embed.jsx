/* global APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

export class Embed extends React.Component {  
  browserSatisfiesRequirements() {
    try {
      /* eslint-disable no-unused-vars */
      let x = {a: 1, b: 2}; // Can we use let?
      const y = [1, 2, 3]; // Can we use const?
      const {a, ...aRest} = x; // Can we use object destructuring?
      const [b, ...bRest] = y; // Can we use array destructuring?
      const str = `${b}23`; // Can we use formatted strings?
      const func = (f, ...args) => f(...args); // Can we define arrow functions?
      func(async arg => await arg, Promise.resolve()); // Can we do async/await?
      new URLSearchParams(); // Do we have URLSearchParams? 
      /* eslint-enable no-unused-vars */

      return true;
    } catch (error) {
      console.log("Sorry, you don't have the necessary JS permissions to run Glitch code editors", error);
      return false;
    }
  }
  
  render() {
    return <div className="glitch-embed-wrap">
      { this.browserSatisfiesRequirements() ?
        // Embed iframe
        <iframe title="embed"
          src={`${APP_URL}/embed/#!/embed/${this.props.domain}?path=README.md&previewSize=100`}
          alt={this.props.alt}
          allow="geolocation; microphone; camera; midi; encrypted-media"
          height="100%" 
          width="100%"
          border="0"
        ></iframe> :
        // Error message if JS not supported
        <div className="error-msg">
          <h1>The web browser you're using is missing some important Javascript features</h1>
          <p>To use Glitch, please try applying your latest system updates, or try us with a different web browser.</p>
        </div>
      }
    </div>;
  }
}

Embed.propTypes = {
  domain: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default Embed;