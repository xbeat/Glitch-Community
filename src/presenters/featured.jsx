import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import EmbedHtml from '../curated/embed';
import FeaturedItems from '../curated/featured';
import Link from './includes/link.jsx';

const imgWitch = 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fwitch-2.svg?1521578927355';

const ZineItem = ({title, url, feature_image, primary_tag}) => (
  <Link to={`/culture${url}`} className="zine-item">
    {!!feature_image && <div className="mask-container">
      <img className="mask" src={feature_image}/>
    </div>}
    <div className="zine-item-meta">
      <h1 className="zine-item-title">{title}</h1>
      {!!primary_tag && <p className="zine-item-tag">
        {primary_tag.name}
      </p>}
    </div>
  </Link>
);
ZineItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  feature_image: PropTypes.string,
  primary_tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

class ZineItems extends React.Component {
  async componentDidMount() {
    const params = 'client_id=ghost-frontend&client_secret=c9a97f14ced8&filter=featured:true';
    const {data} = await axios.get(`https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${params}`);
  }
  render() {
    if (!this.state.posts) {
      return <Loader/>;
    }
  }
}

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
    <ul>
      {featured.map(item => (
        <li key={item.link}>
          <FeaturedPanel {...item}/>
        </li>
      ))}
    </ul>
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