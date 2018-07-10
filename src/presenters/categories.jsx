import React from 'react';

function prefixUrl(url) {
  if(url.startsWith("/")){
    return url;
  }
  return "/"+url;
}
  
const Categories = ({categories}) => (
  <section className="categories" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      { categories.map(({avatarUrl, color, name, url}, key) => (
        <a key={key} className="category-box-link" href={prefixUrl(url)}>
          <li>
            <div className="category-box centered" style={{backgroundColor: color}}>
              <img src={avatarUrl} alt={name}/>
            </div>
            <div className="category-box-label centered" style={{backgroundColor: color}}>{name}</div>
          </li>
        </a>
      ))}
    </ul>
  </section>
);

export default Categories;
