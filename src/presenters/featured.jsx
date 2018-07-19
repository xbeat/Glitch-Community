import React from 'react';
import PropTypes from 'prop-types';

const imgWitch = 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fwitch-2.svg?1521578927355';
const Witch = () => (
  <img className="witch" src={imgWitch} width="110px" height="82px"/>
);

const FeaturedPanel = ({imgTitle, link, src, title}) => (
  <a href={link} className="featured-container" data-track="featured-project" data-track-label={title}>
    <img className={featured} src={src} title={imgTitle} alt=""/>
    <p className="project-name">{title}</p>
  </a>
);

const Featured = ({embed, featured}) => (
  <section className="featured featured-collections">
    <h2>Check These Out</h2>
    <div className="community-pick-embed-container">
      <Witch/>
    </div>
    <ul>
      {featured.map(item => (
        <li key={link}>
          <FeaturedPanel {...item}/>
        </li>
        
  - if @link()
    a(href=@link)
      .featured-container(data-track="featured project" data-track-label=@title)
        img.featured(@src title=@imgTitle alt="")
        p.project-name= @title
  - else
    span
      .featured-container(data-track="featured project" data-track-label=@title)
        img.featured(@src title=@imgTitle alt="")
        p.project-name= @title
    </ul>
  </section>
    section.featured.featured-collections
      h2 Check These Out
      .community-pick-embed-container
        img.witch(src="https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fwitch-2.svg?1521578927355" width="110px" height="82px")
        = @embed()
    
      ul
        = @featuredCollections
);