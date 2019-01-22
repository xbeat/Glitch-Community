import React from 'react';
import PropTypes from 'prop-types';

import Link from './includes/link.jsx';
import Embed from './includes/embed.jsx';

const FeaturedEmbed = ({image, mask, title, appDomain, blogUrl, body, color}) => (
  <div className="featured-embed">
    <div className="mask-container">
      <Link to={`culture${blogUrl}`}>
        <img className={'mask ' + mask} src={image} alt=""/>
      </Link>
    </div>
      
    <div className="content" style={{backgroundColor: color}}>
      <div className="description">
        <Link to={`culture${blogUrl}`}>
          <h2>{title}</h2>
        </Link>
        <p dangerouslySetInnerHTML={{__html: body}}/>
        <Link to={`culture${blogUrl}`} className="learn-more">
          <button className="button-small">Learn More →</button>
        </Link>
      </div>
      <Embed domain={appDomain}/>
    </div>
  </div>
);

FeaturedEmbed.propTypes = {  
  image: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  appDomain: PropTypes.string.isRequired,
  blogUrl: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default FeaturedEmbed;