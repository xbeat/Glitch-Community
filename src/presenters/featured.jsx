import React from 'react';
import PropTypes from 'prop-types';

import EmbedHtml from '../curated/embed';
import FeaturedItems from '../curated/featured';
import Link from './includes/link.jsx';

const imgWitch = 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fwitch-2.svg?1521578927355';

const ZineItems = () => (
  /* global ZINE_POSTS */
  <ul className="zine-items">
    {ZINE_POSTS.map(({id, title, url, feature_image, primary_tag}) => (
      <li key={id} className="zine-item">
        <Link to={`/culture${url}`}>
          {!!feature_image && <div className="mask-container">
            <img className="mask" src={`//culture-zine.glitch.me${feature_image}`} alt=""/>
          </div>}
          <div className="zine-item-meta">
            <h1 className="zine-item-title">{title}</h1>
            {!!primary_tag && <p className="zine-item-tag">
              {primary_tag.name}
            </p>}
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

const FeaturedPanel = ({img, link, title}) => (
  <Link to={link} data-track="featured-project" data-track-label={title}>
    <div className="featured-container">
      <img className="featured" src={img} alt=""/>
      <p className="project-name">{title}</p>
    </div>
  </Link>
);
FeaturedPanel.propTypes = {
  img: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Featured = ({embedHtml, featured}) => (
  <section className="featured featured-collections">
    <h2>Check These Out</h2>
    <div className="community-pick-embed-container">
      <img className="witch" src={imgWitch} width="110px" height="82px" alt=""/>
      <span dangerouslySetInnerHTML={{__html: embedHtml}}/>
    </div>
    <ul className="featured-items">
      {featured.map(item => (
        <li key={item.link}>
          <FeaturedPanel {...item}/>
        </li>
      ))}
    </ul>
    <ZineItems/>
  </section>
);
Featured.propTypes = {
  embedHtml: PropTypes.string.isRequired,
  featured: PropTypes.array.isRequired,
};

const FeaturedContainer = () => (
  <Featured embedHtml={EmbedHtml} featured={FeaturedItems}/>
);

export default FeaturedContainer;