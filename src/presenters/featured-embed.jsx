import React from 'react';
import PropTypes from 'prop-types';

import Link from './includes/link.jsx';

const FeaturedEmbed = ({
  feature: {url, image, title, body, embed, mask, color}
}) => (
  <div className="featured-embed">
    <div className="mask-container">
      <Link to={`culture${url}`}>
        <img className={'mask ' + mask} src={image} alt=""/>
      </Link>
    </div>
      
    <div className="content" style={{backgroundColor: color}}>
      <div className="description">
        <Link to={`culture${url}`}>
          <h1>{title}</h1>
        </Link>
        <p dangerouslySetInnerHTML={{__html: body}}/>
        <Link to={`culture${url}`} className="learn-more">
          <button className="button-small">Learn More →</button>
        </Link>
      </div>
      <div className="embed">
        <span dangerouslySetInnerHTML={{__html: embed}}/>
      </div>
    </div>
  </div>
);

FeaturedEmbed.propTypes = {
  feature: PropTypes.shape({
    url: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    embed: PropTypes.string.isRequired,
    mask: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedEmbed;