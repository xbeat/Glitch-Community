import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import EmbedHtml from '../curated/embed';
import FeaturedItems from '../curated/featured';
import Link from './includes/link.jsx';
import Loader from './includes/loader.jsx';

const imgWitch = 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fwitch-2.svg?1521578927355';

class ZineItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {posts: null};
  }
  async componentDidMount() {
    //this.setState({"posts":[{"id":"5bb66cc271231c026d77720c","title":"Make Time to Get Away","feature_image":"/culture/content/images/2018/10/make-time-to-get-away.jpg","url":"/this-week-on-glitch-week-40-2018/","primary_tag":null},{"id":"5bb66cc271231c026d77720b","title":"Transform!","feature_image":"/culture/content/images/2018/10/transform.jpg","url":"/this-week-on-glitch-week-39-2018/","primary_tag":null},{"id":"5bb66cc271231c026d77720a","title":"Doing It Yourself","feature_image":"/culture/content/images/2018/10/doing-it-yourself.jpg","url":"/this-week-on-glitch-week-38-2018/","primary_tag":null},{"id":"5bb66cc271231c026d777205","title":"Space and Time","feature_image":"/culture/content/images/2018/10/space-and-time.jpg","url":"/this-week-on-glitch-week-37-2018/","primary_tag":null}]});
    const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
    const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag';
    const {data} = await axios.get(`https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`);
    this.setState(data);
  }
  render() {
    if (!this.state.posts) {
      return <Loader/>;
    }
    return (
      <ul className="zine-items">
        {this.state.posts.map(({id, title, url, feature_image, primary_tag}) => (
          <li key={id} className="zine-item">
            <Link to={`/culture${url}`}>
              {!!feature_image && <div className="mask-container">
                <img className="mask" src={feature_image} alt=""/>
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