/* global APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

export class Embed extends React.Component {  
  constructor(props) {
    super(props)
    this.state.browserSupported = this.browserSatisfiesRequirements()
  }
  
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
      console.log("Sorry, you don't have the necessary JavaScript features to run Glitch code editors. Try applying your latest system updates, or try again with a different web browser.", error);
      return false;
    }
  }
  
  render() {
    return <div className="glitch-embed-wrap">
      { this.state.browserSupported ?
        // Embed iframe for app
        <iframe title="embed"
          src={`${APP_URL}/embed/#!/embed/${this.props.domain}?path=README.md&previewSize=100`}
          alt={`${this.props.domain} on Glitch`}
          allow="geolocation; microphone; camera; midi; encrypted-media"
          height="100%" 
          width="100%"
          border="0"
        ></iframe> :
        // Error message if JS not supported
        // TODO(sheridan): Refactor this once we have a true error component
        <div className="error-container">
          <img className="error-image" src={telescopeImageUrl} alt="" width="50%" height="50%" />
          <div className="error-msg">
            <h2>The web browser you're using is missing some important Javascript features</h2>
            <p>To use this app, please try applying your latest system updates, or try again with a different web browser.</p>
          </div>
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