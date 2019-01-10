import React from 'react';
import PropTypes from 'prop-types';

import Link from './includes/link.jsx';

const FeaturedEmbed = ({image, mask, title, url, embed, body, color}) => (
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
  image: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  embed: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default FeaturedEmbed;